# Stage 1: Build the React frontend
FROM node:20-alpine AS frontend-build
WORKDIR /frontend
COPY FRONTEND/package*.json ./
RUN npm install
COPY FRONTEND/ ./
# Tell Vite to use relative paths for API calls since they share the same host
ENV VITE_API_URL=""
RUN npm run build

# Stage 2: Build the Spring Boot backend
FROM maven:3.9.6-eclipse-temurin-21 AS backend-build
WORKDIR /app
COPY BACKEND/dentalclinic/pom.xml ./
COPY BACKEND/dentalclinic/src ./src

# Copy the frontend build output into Spring Boot's static folder
COPY --from=frontend-build /frontend/dist ./src/main/resources/static

RUN mvn clean package -DskipTests

# Stage 3: Run the integrated App
FROM eclipse-temurin:21-jre-jammy
WORKDIR /app
COPY --from=backend-build /app/target/dentalclinic-*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
