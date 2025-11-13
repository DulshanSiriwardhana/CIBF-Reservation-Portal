# Use an official JDK image
FROM eclipse-temurin:22-jdk-alpine AS builder

# Set working directory
WORKDIR /app

# Copy Maven build files
COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .
COPY src ./src

# Build the project
RUN chmod +x mvnw
RUN ./mvnw clean package -DskipTests

# Run the built JAR
FROM eclipse-temurin:22-jre-alpine

# Copy the built JAR to container
COPY --from=builder /app/target/*.jar app.jar

# Expose port
EXPOSE 8083

# Run the Spring Boot app
ENTRYPOINT ["java", "-jar", "app.jar"]
