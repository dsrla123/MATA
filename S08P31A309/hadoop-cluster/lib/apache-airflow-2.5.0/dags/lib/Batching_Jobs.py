import findspark
findspark.init("/usr/local/lib/spark-3.3.2-bin-hadoop3")

from pyspark.sql.functions import *
from pyspark.sql import *

from datetime import datetime
from datetime import timedelta
from dateutil.relativedelta import relativedelta

# 간편한 between 연산을 위해 만든 유틸리티 함수
# base_time: 기준 시간
# interval: 기분 시간으로부터 얼마나 조회를 할 지의 범위
# 초, 분, 시 등의 단위
# ex. timestamp_range("2023-03-21 13:49:00", 10, 'm') => 2023-03-21 13:49:00 부터 10분 이후의 시간까지
def timestamp_range(base_time, interval, unit):

    # dt_obj = datetime.strptime(base_time, '%Y-%m-%dT%H:%M:%S.%f%z')
    dt_obj = datetime.strptime((str(base_time))[:19], '%Y-%m-%dT%H:%M:%S')
    # dt_obj = datetime.fromtimestamp(int(base_time[:13])/1000.0)

    if unit=='s':
        if interval>=0:
            return (dt_obj, dt_obj+timedelta(seconds=interval))
        else:
            return (dt_obj-timedelta(seconds=-interval), dt_obj)
    if unit=='m':
        if interval>=0:
            return (dt_obj, dt_obj+timedelta(minutes=interval))
        else:
            return (dt_obj-timedelta(minutes=-interval), dt_obj)
    if unit=='h':
        if interval>=0:
            return (dt_obj, dt_obj+timedelta(hours=interval))
        else:
            return (dt_obj-timedelta(hours=-interval), dt_obj)
    if unit=='d':
        if interval>=0:
            return (dt_obj, dt_obj+timedelta(days=interval))
        else:
            return (dt_obj-timedelta(days=-interval), dt_obj)
    if unit=='w':
        if interval>=0:
            return (dt_obj, dt_obj+timedelta(days=interval*7))
        else:
            return (dt_obj-timedelta(days=-interval*7), dt_obj)
    if unit=='mo':
        if interval>=0:
            return (dt_obj, dt_obj+relativedelta(months=interval))
        else:
            return (dt_obj-relativedelta(months=-interval), dt_obj)
    if unit=='y':
        if interval>=0:
            return (dt_obj, dt_obj+relativedelta(years=interval))
        else:
            return (dt_obj-relativedelta(years=-interval), dt_obj)



##### Cassandra -> Hive Batching (분산 처리)
##### 1분 최소단위 집계, 더 길어질 수도 있음
def batching_cassandra_spark(base_time, amount, unit):

    if str(amount)+unit != "1m":
        print("invalid interval: interval should be 1m.")
        return 2

    cassandra_keyspace = "tagmanager"
    cassandra_table = "stream"

    session = SparkSession.builder \
        .appName("Batching_Cassandra_To_Hive") \
        .master("yarn") \
        .config("spark.yarn.queue", "batch") \
        .config("spark.jars.packages",
                "org.apache.spark:spark-sql-kafka-0-10_2.12:3.3.2,com.datastax.spark:spark-cassandra-connector_2.12:3.3.0") \
        .config("spark.hadoop.hive.exec.dynamic.partition.mode", "nonstrict") \
        .enableHiveSupport() \
        .getOrCreate()

    batch_df = session.read \
          .format("org.apache.spark.sql.cassandra") \
      .option("checkpointLocation", "/") \
      .option("spark.cassandra.connection.host", "slave01") \
      .option("spark.cassandra.connection.port", 9042) \
      .option("keyspace", cassandra_keyspace) \
      .option("table", cassandra_table) \
      .option("spark.cassandra.connection.remoteConnectionsPerExecutor", 10) \
      .option("spark.cassandra.output.concurrent.writes", 1000) \
      .option("spark.cassandra.concurrent.reads", 512) \
      .option("spark.cassandra.output.batch.grouping.buffer.size", 1000) \
      .option("spark.cassandra.connection.keep_alive_ms", 600000000) \
          .load()

    #########
    # components 테이블 집계
    component_df = batch_df.select("*") \
        .where(col("creation_timestamp") \
                .between(*timestamp_range(base_time, -amount, unit))) \
        .where(col("event").like("click")) \
        .groupBy("project_id", "target_name", "location", "screen_device", "user_language").agg( \
            count("key").alias("total_click"), \
        ).withColumn("update_timestamp", lit(base_time).cast("timestamp")) \
        .select("total_click", col("target_name").alias("tag_name"), "location", "screen_device", "user_language", "update_timestamp",  "project_id")
    component_df.write.mode("append") \
        .format("hive") \
        .insertInto("mata.components_{}{}".format(str(amount), unit))

    #########
    # clicks 테이블 집계
    click_df = batch_df.select("*") \
        .where(col("creation_timestamp") \
                .between(*timestamp_range(base_time, -amount, unit))) \
        .where(col("event").like("click")) \
        .groupBy("project_id", "position_x", "position_y", "location", "screen_device", "user_language").agg( \
            count("key").alias("total_click"), \
        ).withColumn("update_timestamp", lit(base_time).cast("timestamp")) \
        .select("total_click", "position_x", "position_y", "location", "screen_device", "user_language", "update_timestamp", "project_id")
    click_df.write.mode("append") \
        .format("hive") \
        .insertInto("mata.clicks_{}{}".format(str(amount), unit))

    #########
    # page_durations 테이블 집계
    page_durations_df = batch_df.select("*") \
        .where(col("creation_timestamp") \
                .between(timestamp_range(base_time, -amount, unit)[0]-timedelta(minutes=30), timestamp_range(base_time, -amount, unit)[1])) \
        .groupBy("project_id", "location", "session_id", "screen_device", "user_language").agg( \
            avg("page_duration").alias("page_duration"), \
        ).groupBy("project_id", "location", "screen_device", "user_language").agg( \
            count("session_id").alias("total_session"), \
            sum("page_duration").alias("total_duration") \
        ).withColumn("update_timestamp", lit(base_time).cast("timestamp")) \
        .select("total_duration","total_session","location", "screen_device", "user_language", "update_timestamp","project_id")
    page_durations_df.write.mode("append") \
        .format("hive") \
        .insertInto("mata.page_durations_{}{}".format(str(amount), unit))

    #########
    # page_journals 테이블 집계
    page_journals_df = batch_df.select("*") \
        .where(col("creation_timestamp") \
                .between(*timestamp_range(base_time, -amount, unit))) \
        .where(col("event").like("pageenter")) \
        .groupBy("project_id", "referrer", "location", "screen_device", "user_language").agg( \
            count("key").alias("total_journal"),\
         ).withColumn("update_timestamp", lit(base_time).cast("timestamp")) \
    .select("total_journal", col("referrer").alias("location_from"), col("location").alias("location_to"), "screen_device", "user_language", "update_timestamp", "project_id")
    page_journals_df.write.mode("append") \
        .format("hive") \
        .insertInto("mata.page_journals_{}{}".format(str(amount), unit))

    #########
    # page_refers 테이블 집계
    refer_df = batch_df \
        .where(col("creation_timestamp") \
               .between(*timestamp_range(base_time, -amount, unit))) \
        .withColumn("referrer", split(batch_df.referrer, "/").getItem(2)) \
        .groupBy("referrer", "project_id", "screen_device", "user_language") \
        .agg(countDistinct("session_id").alias("total_session"),
             sum(when(col("event") == "pageenter", 1).otherwise(0)).alias("total_pageenter")
             ) \
        .withColumn("update_timestamp", current_timestamp()) \
        .select("total_session", "total_pageenter", "referrer", "screen_device", "user_language", "update_timestamp", "project_id")

    refer_df.write.mode("append") \
        .format("hive") \
        .insertInto("mata.page_refers_{}{}".format(str(amount), unit))

    #########
    # events 테이블 집계, group_by(프로젝트ID, 이벤트명, 태그명) ... + 더 추가?
    event_df = batch_df \
        .where(col("creation_timestamp") \
               .between(*timestamp_range(base_time, -amount, unit))) \
        .groupBy("project_id", "event", "target_name", "screen_device", "user_language", "data") \
        .agg(count("key").alias("total_event_count"),
             countDistinct("session_id").alias("total_session_count")
             ) \
        .withColumn("update_timestamp", current_timestamp()) \
        .select("total_event_count", "total_session_count", "event", col("target_name").alias("tag_name"), "data", "screen_device", "user_language", "update_timestamp", "project_id")

    event_df.write.mode("append") \
        .format("hive") \
        .insertInto("mata.events_{}{}".format(str(amount), unit))

    
    session.stop()


##### Hive -> Hive Batching (단일 처리)
# 집계를 집계
def batching_hive(base_time, amount, unit):
    if str(amount)+unit not in ["5m", "10m", "30m", "1h", "6h", "12h", "1d", "1w", "1mo", "6mo", "1y"]:
        print("invalid interval: interval should be 5m, 10m, 30m, 1h, 6h, 12h, 1d, 1w, 1mo, 6mo, 1y.")
        return 2

    session = SparkSession.builder \
        .appName("Batching_Hive_To_Hive") \
        .master("yarn") \
        .config("spark.yarn.queue", "stream") \
        .config("spark.hadoop.hive.exec.dynamic.partition.mode", "nonstrict") \
        .enableHiveSupport() \
        .getOrCreate()

    component_df = session.read \
        .format("hive") \
        .table("mata.components_1m") \
        .select("*") \
        .where(col("update_timestamp") \
                .between(*timestamp_range(base_time, -amount, unit))) \
        .groupBy("project_id", "tag_name", "location", "screen_device", "user_language").agg(
            sum("total_click").alias("total_click") \
        ).withColumn("update_timestamp", lit(base_time).cast("timestamp")) \
        .select("total_click", "tag_name", "location", "screen_device", "user_language", "update_timestamp", "project_id")
    component_df.show()
    component_df.write.mode("append") \
        .format("hive") \
        .insertInto("mata.components_{}{}".format(amount, unit))

    #########
    # clicks 테이블 집계
    click_df = session.read \
        .format("hive") \
        .table("mata.clicks_1m") \
        .select("*") \
        .where(col("update_timestamp") \
                .between(*timestamp_range(base_time, -amount, unit))) \
        .groupBy("project_id", "position_x", "position_y", "location", "screen_device", "user_language").agg( \
            sum("total_click").alias("total_click"), \
        ).withColumn("update_timestamp", lit(base_time).cast("timestamp")) \
        .select("total_click", "position_x", "position_y","location", "screen_device", "user_language", "update_timestamp", "project_id")
    click_df.show()
    click_df.write.mode("append") \
        .format("hive") \
        .insertInto("mata.clicks_{}{}".format(amount, unit))

    #########
    # page_durations 테이블 집계
    page_durations_df = session.read \
        .format("hive") \
        .table("mata.page_durations_1m") \
        .select("*") \
        .where(col("update_timestamp") \
                .between(*timestamp_range(base_time, -amount, unit))) \
        .groupBy("project_id", "location", "screen_device", "user_language").agg(\
            sum("total_session").alias("total_session"),\
            sum("total_duration").alias("total_duration"),\
         ).withColumn("update_timestamp", lit(base_time).cast("timestamp")) \
        .select("total_duration","total_session","location", "screen_device", "user_language", "update_timestamp","project_id")
    page_durations_df.show()
    page_durations_df.write.mode("append") \
        .format("hive") \
        .insertInto("mata.page_durations_{}{}".format(amount, unit))

    #########
    # page_journals 테이블 집계
    page_journals_df = session.read \
        .format("hive") \
        .table("mata.page_journals_1m") \
        .select("*") \
        .where(col("update_timestamp") \
                .between(*timestamp_range(base_time, -amount, unit))) \
        .groupBy("project_id", "location_from", "location_to", "screen_device", "user_language").agg(\
            sum("total_journal").alias("total_journal"),\
         ).withColumn("update_timestamp", lit(base_time).cast("timestamp")) \
    .select("total_journal", "location_from", "location_to", "screen_device", "user_language", "update_timestamp", "project_id")
    page_journals_df.show()
    page_journals_df.write.mode("append") \
        .format("hive") \
        .insertInto("mata.page_journals_{}{}".format(amount, unit))

    #########
    # page_refers 테이블 집계
    page_refers_df = session.read \
        .format("hive") \
        .table("mata.page_refers_1m") \
        .select("*") \
        .where(col("update_timestamp") \
               .between(*timestamp_range(base_time, -amount, unit))) \
        .groupBy("referrer", "project_id", "screen_device", "user_language") \
        .agg(sum("total_pageenter").alias("total_pageenter"), sum("total_session").alias("total_session")) \
        .withColumn("update_timestamp", lit(base_time).cast("timestamp")) \
        .select("total_session", "total_pageenter", "referrer", "screen_device", "user_language", "update_timestamp", "project_id")

    page_refers_df.write.mode("append") \
        .format("hive") \
        .insertInto("mata.page_refers_{}{}".format(amount, unit))

    #########
    # events 테이블 집계, group_by(프로젝트ID, 이벤트명, 태그명) ... + 더 추가?
    event_df = session.read \
        .format("hive") \
        .table("mata.events_1m") \
        .select("*") \
        .where(col("update_timestamp") \
               .between(*timestamp_range(base_time, -amount, unit))) \
        .groupBy("project_id", "event", "tag_name", "data", "screen_device", "user_language") \
        .agg(
            sum("total_event_count").alias("total_event_count"), \
            sum("total_session_count").alias("total_session_count")) \
        .withColumn("update_timestamp", lit(base_time).cast("timestamp")) \
        .select("total_event_count", "total_session_count", "event", "tag_name", "data", "screen_device", "user_language", "update_timestamp", "project_id")

    event_df.write.mode("append") \
        .format("hive") \
        .insertInto("mata.events_{}{}".format(amount, unit))
    
    session.stop()


# 누적 집계 ... 5m 기준으로 쌓기
def batching_hive_all(base_time, unit):
    if unit != "all":
        print("invalid interval: interval should be all")
        return 2

    fixTime = 4
    unit = "m"
    table_select = "5m"

    session = SparkSession.builder \
        .appName("Batching_Hive_To_Hive") \
        .master("yarn") \
        .config("spark.yarn.queue", "stream") \
        .config("spark.hadoop.hive.exec.dynamic.partition.mode", "nonstrict") \
        .enableHiveSupport() \
        .getOrCreate()

    #########
    # components 테이블 집계
    components_df_temp = session.read \
        .format("hive") \
        .table(f"mata.components_{table_select}") \
        .select("*") \
        .where(col("update_timestamp") \
               .between(*timestamp_range(base_time, -fixTime, unit))) \
        .select("total_click", "tag_name", "location", "screen_device", "user_language", "update_timestamp", "project_id")

    components_df_all = session.read \
        .format("hive") \
        .table("mata.components_all") \
        .select("*") \
        .where(col("update_timestamp") \
               .between(*timestamp_range(base_time, -fixTime, unit))) \
        .select("total_click", "tag_name", "location", "screen_device", "user_language", "update_timestamp", "project_id")

    if components_df_all.count() != 0:
        components_df_new = \
            components_df_all \
                .union(components_df_temp.select("*")) \
                .groupBy("tag_name", "location", "screen_device", "user_language", "project_id").agg( \
                sum("total_click").alias("total_click"), \
                ).withColumn("update_timestamp", lit(base_time).cast("timestamp")) \
                .select("total_click", "tag_name", "location", "screen_device", "user_language", "update_timestamp", "project_id")
    else:
        components_df_new = components_df_temp

    components_df_new.write.mode("append") \
        .format("hive") \
        .insertInto("mata.components_all")

    #########
    # clicks 테이블 집계
    click_df_temp = session.read \
        .format("hive") \
        .table(f"mata.clicks_{table_select}") \
        .select("*") \
        .where(col("update_timestamp") \
               .between(*timestamp_range(base_time, -fixTime, unit))) \
        .select("total_click", "position_x", "position_y","location", "screen_device", "user_language", "update_timestamp", "project_id")

    click_df_all = session.read \
        .format("hive") \
        .table("mata.clicks_all") \
        .select("*") \
        .where(col("update_timestamp") \
               .between(*timestamp_range(base_time, -fixTime, unit))) \
        .select("total_click", "position_x", "position_y","location", "screen_device", "user_language", "update_timestamp", "project_id")

    if click_df_all.count() != 0:
        click_df_new = \
            click_df_all \
                .union(click_df_temp.select("*")) \
                .groupBy("position_x", "position_y","location", "screen_device", "user_language", "project_id").agg( \
                sum("total_click").alias("total_click"), \
                ).withColumn("update_timestamp", lit(base_time).cast("timestamp")) \
                .select("total_click", "position_x", "position_y","location", "screen_device", "user_language", "update_timestamp", "project_id")
    else:
        click_df_new = click_df_temp

    click_df_new.write.mode("append") \
        .format("hive") \
        .insertInto("mata.clicks_all")

    #########
    # page_durations 테이블 집계
    page_durations_df_temp = session.read \
        .format("hive") \
        .table(f"mata.page_durations_{table_select}") \
        .select("*") \
        .where(col("update_timestamp") \
               .between(*timestamp_range(base_time, -fixTime, unit))) \
        .select("total_duration","total_session","location", "screen_device", "user_language", "update_timestamp","project_id")

    page_durations_df_all = session.read \
        .format("hive") \
        .table("mata.page_durations_all") \
        .select("*") \
        .where(col("update_timestamp") \
               .between(*timestamp_range(base_time, -fixTime, unit))) \
        .select("total_duration","total_session","location", "screen_device", "user_language", "update_timestamp","project_id")

    if page_durations_df_all.count() != 0:
        page_durations_df_new = \
            page_durations_df_all \
                .union(page_durations_df_temp.select("*")) \
                .groupBy("location", "screen_device", "user_language","project_id").agg( \
                sum("total_session").alias("total_session"), \
                sum("total_duration").alias("total_duration"), \
                ).withColumn("update_timestamp", lit(base_time).cast("timestamp")) \
                .select("total_duration","total_session","location", "screen_device", "user_language", "update_timestamp","project_id")
    else:
        page_durations_df_new = page_durations_df_temp

    page_durations_df_new.write.mode("append") \
        .format("hive") \
        .insertInto("mata.page_durations_all")

    #########
    # page_journals 테이블 집계
    page_journals_df_temp = session.read \
        .format("hive") \
        .table(f"mata.page_journals_{table_select}") \
        .select("*") \
        .where(col("update_timestamp") \
               .between(*timestamp_range(base_time, -fixTime, unit))) \
        .select("total_journal", "location_from", "location_to", "screen_device", "user_language", "update_timestamp", "project_id")

    page_journals_df_all = session.read \
        .format("hive") \
        .table("mata.page_journals_all") \
        .select("*") \
        .where(col("update_timestamp") \
               .between(*timestamp_range(base_time, -fixTime, unit))) \
        .select("total_journal", "location_from", "location_to", "screen_device", "user_language", "update_timestamp", "project_id")

    if page_journals_df_all.count() != 0:
        page_journals_df_new = \
            page_journals_df_all \
                .union(page_journals_df_temp.select("*")) \
                .groupBy("location_from", "location_to", "screen_device", "user_language", "project_id").agg( \
                sum("total_journal").alias("total_journal"), \
                ).withColumn("update_timestamp", lit(base_time).cast("timestamp")) \
                .select("total_journal", "location_from", "location_to", "screen_device", "user_language", "update_timestamp", "project_id")
    else:
        page_journals_df_new = page_journals_df_temp

    page_journals_df_new.write.mode("append") \
        .format("hive") \
        .insertInto("mata.page_journals_all")

    #########
    # page_refers 테이블 집계
    page_refers_df_temp = session.read \
        .format("hive") \
        .table(f"mata.page_refers_{table_select}") \
        .select("*") \
        .where(col("update_timestamp") \
               .between(*timestamp_range(base_time, -fixTime, unit))) \
        .select("total_session", "total_pageenter", "referrer", "screen_device", "user_language", "update_timestamp", "project_id")

    page_refers_df_all = session.read \
        .format("hive") \
        .table("mata.page_refers_all") \
        .select("*") \
        .where(col("update_timestamp") \
               .between(*timestamp_range(base_time, -fixTime, unit))) \
        .select("total_session", "total_pageenter", "referrer", "screen_device", "user_language", "update_timestamp", "project_id")

    if page_refers_df_all.count() != 0:
        page_refers_df_new = \
            page_refers_df_all \
                .union(page_refers_df_temp.select("*")) \
                .groupBy("referrer", "screen_device", "user_language", "project_id").agg( \
                sum("total_pageenter").alias("total_pageenter"), \
                sum("total_session").alias("total_session"), \
                ).withColumn("update_timestamp", lit(base_time).cast("timestamp")) \
                .select("total_session", "total_pageenter", "referrer", "screen_device", "user_language", "update_timestamp", "project_id")
    else:
        page_refers_df_new = page_refers_df_temp

    page_refers_df_new.write.mode("append") \
        .format("hive") \
        .insertInto("mata.page_refers_all")

    #########
    # events 테이블 집계
    events_df_temp = session.read \
        .format("hive") \
        .table(f"mata.events_{table_select}") \
        .select("*") \
        .where(col("update_timestamp") \
               .between(*timestamp_range(base_time, -fixTime, unit))) \
        .select("total_event_count", "total_session_count", "event", "tag_name", "data", "screen_device", "user_language", "update_timestamp", "project_id")

    events_df_all = session.read \
        .format("hive") \
        .table("mata.events_all") \
        .select("*") \
        .where(col("update_timestamp") \
               .between(*timestamp_range(base_time, -fixTime, unit))) \
        .select("total_event_count", "total_session_count", "event", "tag_name", "data", "screen_device", "user_language", "update_timestamp", "project_id")

    if events_df_all.count() != 0:
        events_df_new = \
            events_df_all \
                .union(events_df_temp.select("*")) \
                .groupBy("event", "tag_name", "data", "screen_device", "user_language", "project_id").agg( \
                sum("total_event_count").alias("total_event_count"), \
                sum("total_session_count").alias("total_session_count"), \
                ).withColumn("update_timestamp", lit(base_time).cast("timestamp")) \
                .select("total_event_count", "total_session_count", "event", "tag_name", "data", "screen_device", "user_language", "update_timestamp", "project_id")
    else:
        events_df_new = events_df_temp

    events_df_new.write.mode("append") \
        .format("hive") \
        .insertInto("mata.events_all")
