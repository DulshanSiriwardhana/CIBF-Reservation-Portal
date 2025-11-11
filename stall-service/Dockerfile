# Step 1: Use an official JDK image
FROM eclipse-temurin:22-jdk-alpine

# Step 2: Set working directory
WORKDIR /app

# Step 3: Copy Maven build files
COPY pom.xml .
COPY src ./src

# Step 4: Build the project
RUN ./mvnw clean package -DskipTests

# Step 5: Copy the built JAR to container
COPY target/*.jar app.jar

# Step 6: Expose port
EXPOSE 8085

# Step 7: Run the Spring Boot app
ENTRYPOINT ["java", "-jar", "app.jar"]
