package com.elibrary.dto;

import lombok.*;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserDTO {
    private Long id;
    private String name;
    private String email;
    private String password;

    private String phone;
    private String address;
    private LocalDate membershipDate;
    private Boolean active;
    private Integer activeLoans;
}
