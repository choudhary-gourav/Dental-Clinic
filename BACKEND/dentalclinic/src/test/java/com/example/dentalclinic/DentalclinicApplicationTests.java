package com.example.dentalclinic;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.DatabaseMetaData;
import java.sql.ResultSet;

@SpringBootTest
class DentalclinicApplicationTests {

	@Autowired
	private DataSource dataSource;

	@Test
	void contextLoads() throws Exception {
		try (Connection conn = dataSource.getConnection()) {
			DatabaseMetaData metaData = conn.getMetaData();
			try (ResultSet rs = metaData.getColumns(null, null, "users", null)) {
				System.out.println("--- DB INSPECTOR --- COLUMNS IN 'users' TABLE:");
				while (rs.next()) {
					String columnName = rs.getString("COLUMN_NAME");
					String columnType = rs.getString("TYPE_NAME");
					System.out.println("COLUMN: " + columnName + " (" + columnType + ")");
				}
				System.out.println("--- DB INSPECTOR --- END");
			}
		}
	}

}

