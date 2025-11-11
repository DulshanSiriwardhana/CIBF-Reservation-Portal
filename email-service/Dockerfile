# Use an official JDK image
FROM eclipse-temurin:22-jdk-alpine

# Set working directory
WORKDIR /app

# Copy Maven build files
COPY mvnw .
COPY pom.xml .
COPY src ./src

# Build the project
RUN ./mvn clean package -DskipTests

# Copy the built JAR to container
COPY target/*.jar app.jar

# Expose port
EXPOSE 8081

# Run the Spring Boot app
ENTRYPOINT ["java", "-jar", "app.jar"]
