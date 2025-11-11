package com.cibf.stallservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@SpringBootApplication
public class StallServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(StallServiceApplication.class, args);
		System.out.println("\n========================================");
		System.out.println("Stall Service Started Successfully!");
		System.out.println("Port: 8082");
		System.out.println("Swagger UI: http://localhost:8082/swagger-ui.html");
		System.out.println("Health: http://localhost:8082/actuator/health");
		System.out.println("========================================\n");
	}
	@Bean
	public WebMvcConfigurer corsConfigurer() {
		return new WebMvcConfigurer() {
			@Override
			public void addCorsMappings(CorsRegistry registry) {
				registry.addMapping("/api/**")
						.allowedOrigins(
								"http://localhost:3000",
								"http://localhost:8080",
								"http://localhost:8082"
						)
						.allowCredentials(true)
						.allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
						.allowedHeaders("*");
			}
		};
	}
}
