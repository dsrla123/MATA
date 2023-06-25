#!/bin/bash

/etc/init.d/redis-server start
java -jar -Dspring.profiles.active=stage /home/spring-api.jar