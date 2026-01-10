package com.elibrary;

import org.junit.jupiter.api.Test;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;
import org.springframework.boot.autoconfigure.orm.jpa.HibernateJpaAutoConfiguration;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest(excludeClasses = {
        DataSourceAutoConfiguration.class,
        HibernateJpaAutoConfiguration.class
})
class ELibraryApplicationTests {

    @Test
    void contextLoads() {
        // Verifies that the application context loads successfully (without database)
    }
}
