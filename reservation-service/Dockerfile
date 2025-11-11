# Use an official JDK image
FROM eclipse-temurin:22-jdk-alpine

# Set working directory
WORKDIR /app

# Copy Maven build files
COPY pom.xml .
COPY src ./src

# Build the project
RUN ./mvnw clean package -DskipTests

# Copy the built JAR to container
COPY target/*.jar app.jar

# Expose port
EXPOSE 8084

# Run the Spring Boot app
ENTRYPOINT ["java", "-jar", "app.jar"]
