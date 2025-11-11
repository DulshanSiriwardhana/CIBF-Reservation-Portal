package com.CIBF.genre_service;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.ApplicationListener;
import org.springframework.core.env.Environment;

import java.net.InetAddress;

@SpringBootApplication
public class GenreServiceApplication {

	public static void main(String[] args) {
		SpringApplication app = new SpringApplication(GenreServiceApplication.class);

        app.addListeners((ApplicationListener<ApplicationReadyEvent>) event -> {
            Environment env = event.getApplicationContext().getEnvironment();
            String port = env.getProperty("server.port", "8081");
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

}
