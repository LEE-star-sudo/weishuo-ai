package com.weishuo.backend.follow.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FollowRequest {
    private Long followingId;  // 要关注的用户ID
}
