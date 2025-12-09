package com.weishuo.backend.topic.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TopicResponse {
    private Long id;
    private String title;
    private String category;
    private Integer postCount;
    private Integer commentCount;
    private Integer likeCount;
    private Boolean isHot;
}
