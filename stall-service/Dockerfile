FROM openjdk:17-jdk-alpine
VOLUME /tmp
ARG JAR_FILE=target/*.jar
COPY ${JAR_FILE} stall-service.jar
ENTRYPOINT ["java","-jar","/stall-service.jar"]
EXPOSE 8082