package com.weishuo.backend.topic;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Entity
@Table(name = "topics")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Topic {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, length = 100)
    private String title;
    
    @Column(nullable = false, length = 50)
    private String category;  // 分类: 科技、新闻、体育、娱乐、财经
    
    @Column(name = "post_count", nullable = false)
    private Integer postCount = 0;  // 推文数
    
    @Column(name = "comment_count", nullable = false)
    private Integer commentCount = 0;  // 评论数
    
    @Column(name = "like_count", nullable = false)
    private Integer likeCount = 0;  // 点赞数
    
    @Column(name = "is_hot", nullable = false)
    private Boolean isHot = false;  // 是否热门
    
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;
    
    @Column(name = "updated_at")
    private Instant updatedAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = Instant.now();
        updatedAt = Instant.now();
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = Instant.now();
    }
}
