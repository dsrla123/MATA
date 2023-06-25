from airflow import DAG
from airflow.operators.python_operator import PythonOperator
from datetime import datetime, timedelta
from dateutil.relativedelta import relativedelta
# from lib.Batching_Jobs import batching_hive, batching_cassandra_spark, batching_hive_all
from batching_jobs import batching_hive, batching_cassandra_spark, batching_hive_all

default_args = {
    'owner': 'airflow',
    'start_date': datetime(2023, 5, 17, 9, 0),
    'retries': 0,
    'retry_delay': timedelta(minutes=1)
}

# dag1m = DAG(
#     'dag_cassandraSpark_1m',
#     default_args=default_args,
#     description='cassandraSpark_1m',
#     schedule_interval=timedelta(minutes=1),
#     catchup=False
# )

# dag5m = DAG(
#     'dag_cassandraSpark_5m',
#     default_args=default_args,
#     description='cassandraSpark_5m',
#     schedule_interval=timedelta(minutes=5),
#     catchup=False
# )

dag10m = DAG(
    'dag_cassandraSpark_10m',
    default_args=default_args,
    description='cassandraSpark_10m',
    schedule_interval=timedelta(minutes=10),
    catchup=False
)

dag30m = DAG(
    'dag_hiveSpark_30m',
    default_args=default_args,
    description='hiveSpark_30m',
    schedule_interval=timedelta(minutes=30),
    catchup=False
)

dag1h = DAG(
    'dag_hiveSpark_1h',
    default_args=default_args,
    description='hiveSpark_1h',
    schedule_interval=timedelta(hours=1),
    catchup=False
)

dag6h = DAG(
    'dag_hiveSpark_6h',
    default_args=default_args,
    description='hiveSpark_6h',
    schedule_interval=timedelta(hours=6),
    catchup=False
)

dag12h = DAG(
    'dag_hiveSpark_12h',
    default_args=default_args,
    description='hiveSpark_12h',
    schedule_interval=timedelta(hours=12),
    catchup=False
)

dag1d = DAG(
    'dag_hiveSpark_1d',
    default_args=default_args,
    description='hiveSpark_1d',
    schedule_interval= "@daily",
    catchup=False
)

dag1w = DAG(
    'dag_hiveSpark_1w',
    default_args=default_args,
    description='hiveSpark_1w',
    schedule_interval= "@weekly",
    catchup=False
)

dag1mo = DAG(
    'dag_hiveSpark_1mo',
    default_args=default_args,
    description='hiveSpark_1mo',
    schedule_interval= "@monthly",
    catchup=False
)

dag6mo = DAG(
    'dag_hiveSpark_6mo',
    default_args=default_args,
    description='hiveSpark_6mo',
    schedule_interval=relativedelta(months=6),
    catchup=False
)

dag1y = DAG(
    'dag_hiveSpark_1y',
    default_args=default_args,
    description='hiveSpark_1y',
    schedule_interval= "@yearly",
    catchup=False
)


# cassandra_to_spark_1m = PythonOperator(
#     task_id='cassandra_to_spark_1m',
#     python_callable=batching_cassandra_spark,
#     op_kwargs = {"base_time" : '{{ ts }}',
#                  "amount" : 1,
#                  "unit" : "m"},
#     dag=dag1m
# )

# hiveSpark_5m = PythonOperator(
#     task_id='cassandra_to_spark_5m',
#     python_callable=batching_cassandra_spark,
#     op_kwargs = {"base_time" : '{{ ts }}',
#                  "amount" : 5,
#                  "unit" : "m"},
#     dag=dag5m
# )

hiveSpark_10m = PythonOperator(
    task_id='cassandra_to_spark_10m',
    python_callable=batching_cassandra_spark,
    op_kwargs = {"base_time" : '{{ ts }}',
                 "amount" : 10,
                 "unit" : "m"},
    dag=dag10m
)

hiveSpark_30m = PythonOperator(
    task_id='hiveSpark_30m',
    python_callable=batching_hive,
    op_kwargs = {"base_time" : '{{ ts }}',
                 "amount" : 30,
                 "unit" : "m"},
    dag=dag30m
)

hiveSpark_1h = PythonOperator(
    task_id='hiveSpark_1h',
    python_callable=batching_hive,
    op_kwargs = {"base_time" : '{{ ts }}',
                 "amount" : 1,
                 "unit" : "h"},
    dag=dag1h
)

hiveSpark_6h = PythonOperator(
    task_id='hiveSpark_6h',
    python_callable=batching_hive,
    op_kwargs = {"base_time" : '{{ ts }}',
                 "amount" : 6,
                 "unit" : "h"},
    dag=dag6h
)

hiveSpark_12h = PythonOperator(
    task_id='hiveSpark_12h',
    python_callable=batching_hive,
    op_kwargs = {"base_time" : '{{ ts }}',
                 "amount" : 12,
                 "unit" : "h"},
    dag=dag12h
)

hiveSpark_1d = PythonOperator(
    task_id='hiveSpark_1d',
    python_callable=batching_hive,
    op_kwargs = {"base_time" : '{{ ts }}',
                 "amount" : 1,
                 "unit" : "d"},
    dag=dag1d
)

hiveSpark_1w = PythonOperator(
    task_id='hiveSpark_1w',
    python_callable=batching_hive,
    op_kwargs = {"base_time" : '{{ ts }}',
                 "amount" : 1,
                 "unit" : "w"},
    dag=dag1w
)

hiveSpark_1mo = PythonOperator(
    task_id='hiveSpark_1mo',
    python_callable=batching_hive,
    op_kwargs = {"base_time" : '{{ ts }}',
                 "amount" : 1,
                 "unit" : "mo"},
    dag=dag1mo
)

hiveSpark_6mo = PythonOperator(
    task_id='hiveSpark_6mo',
    python_callable=batching_hive,
    op_kwargs = {"base_time" : '{{ ts }}',
                 "amount" : 6,
                 "unit" : "mo"},
    dag=dag6mo
)

hiveSpark_1y = PythonOperator(
    task_id='hiveSpark_1y',
    python_callable=batching_hive,
    op_kwargs = {"base_time" : '{{ ts }}',
                 "amount" : 1,
                 "unit" : "y"},
    dag=dag1y
)

hiveSpark_all = PythonOperator(
    task_id='hiveSpark_all',
    python_callable=batching_hive_all,
    op_kwargs = {"base_time" : '{{ ts }}',
                 "unit" : "all"},
    dag=dag1h
)

hiveSpark_1h >> hiveSpark_all
