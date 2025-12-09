package com.weishuo.backend.follow.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserSummary {
    private Long id;
    private String username;
    private String displayName;
    private String avatarUrl;
    private Long followersCount;
    private Long followingCount;
    private Boolean isFollowing;  // 当前用户是否关注了这个用户
}
