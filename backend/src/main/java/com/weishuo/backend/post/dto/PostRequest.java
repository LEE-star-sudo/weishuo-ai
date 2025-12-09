package com.weishuo.backend.post.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class PostRequest {

    private Long userId;

    @Size(max = 50)
    private String username;

    @Size(max = 100)
    private String displayName;

    @Size(max = 255)
    private String avatarUrl;

    @NotBlank
    @Size(max = 280)
    private String content;
}
