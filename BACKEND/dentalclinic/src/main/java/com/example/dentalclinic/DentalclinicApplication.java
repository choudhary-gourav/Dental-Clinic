package com.example.dentalclinic;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class DentalclinicApplication {

	public static void main(String[] args) {
		// Load .env file programmatically if it exists
		java.nio.file.Path envPath = java.nio.file.Paths.get(".env");
		if (!java.nio.file.Files.exists(envPath)) {
			envPath = java.nio.file.Paths.get("BACKEND/dentalclinic/.env");
		}
		if (java.nio.file.Files.exists(envPath)) {
			try {
				java.util.List<String> lines = java.nio.file.Files.readAllLines(envPath);
				for (String line : lines) {
					line = line.trim();
					if (line.isEmpty() || line.startsWith("#")) {
						continue;
					}
					int index = line.indexOf('=');
					if (index > 0) {
						String key = line.substring(0, index).trim();
						String value = line.substring(index + 1).trim();
						// Remove surrounding quotes if present
						if (value.startsWith("\"") && value.endsWith("\"")) {
							value = value.substring(1, value.length() - 1);
						} else if (value.startsWith("'") && value.endsWith("'")) {
							value = value.substring(1, value.length() - 1);
						}
						System.setProperty(key, value);
					}
				}
			} catch (java.io.IOException e) {
				System.err.println("Could not load .env file: " + e.getMessage());
			}
		}

		SpringApplication.run(DentalclinicApplication.class, args);
	}

}
