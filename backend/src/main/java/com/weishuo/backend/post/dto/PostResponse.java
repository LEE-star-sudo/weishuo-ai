package com.weishuo.backend.post.dto;

import java.time.Instant;
import lombok.Builder;
import lombok.Value;

@Value
@Builder
public class PostResponse {
    Long id;
    Long userId;
    String username;
    String displayName;
    String avatarUrl;
    String content;
    Instant createdAt;
    int likes;
    int comments;
    int reposts;
}
