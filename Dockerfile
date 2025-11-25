# Giai đoạn 1: Build code (Dùng Maven để đóng gói)
FROM maven:3.9.6-eclipse-temurin-17 AS build
WORKDIR /app
COPY . .
RUN mvn clean package -DskipTests

# Giai đoạn 2: Chạy code (Dùng JDK nhẹ để chạy)
FROM eclipse-temurin:17-jdk-alpine
WORKDIR /app
# Lấy file .jar từ giai đoạn 1 ném sang đây
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]