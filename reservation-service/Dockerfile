# ---------- Stage 1: Build with Maven wrapper ----------
FROM eclipse-temurin:22-jdk-alpine AS builder

WORKDIR /app

# Tools needed for mvnw
RUN apk add --no-cache bash git

# Copy Maven project from "complete"
COPY complete/pom.xml ./
COPY complete/mvnw ./
COPY complete/.mvn ./.mvn
COPY complete/src ./src

# Fix mvnw permissions + Windows line endings
RUN chmod +x mvnw \
    && sed -i 's/\r$//' mvnw

# Build jar (skip tests)
RUN ./mvnw package -DskipTests


# ---------- Stage 2: Run the app ----------
FROM eclipse-temurin:22-jre-alpine

WORKDIR /app

# Copy the built jar from Maven target/
COPY --from=builder /app/target/*.jar app.jar

# Expose reservation-service port
EXPOSE 5003

# Run Spring Boot
ENTRYPOINT ["java", "-jar", "app.jar"]
