package com.CIBF.genre_service;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.ApplicationListener;
import org.springframework.core.env.Environment;
import org.springframework.context.annotation.Bean;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.net.InetAddress;

@SpringBootApplication
public class GenreServiceApplication {

	public static void main(String[] args) {
		SpringApplication app = new SpringApplication(GenreServiceApplication.class);

        app.addListeners((ApplicationListener<ApplicationReadyEvent>) event -> {
            Environment env = event.getApplicationContext().getEnvironment();
            String port = env.getProperty("server.port", "8082");
            try {
                String hostAddress = InetAddress.getLocalHost().getHostAddress();
                System.out.println("======================================");
                System.out.println("Genre Service started successfully!");
                System.out.println("Access URLs:");
                System.out.println("Local: http://localhost:" + port);
                System.out.println("External: http://" + hostAddress + ":" + port);
                System.out.println("======================================");
            } catch (Exception e) {
                e.printStackTrace();
            }
        });

        app.run(args);
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
