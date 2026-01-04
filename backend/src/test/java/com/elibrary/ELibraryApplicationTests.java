package com.elibrary;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.NONE)
@ActiveProfiles("test")
class ELibraryApplicationTests {

    @Test
    void contextLoads() {
        // Verifies that the application context loads successfully
    }
}
