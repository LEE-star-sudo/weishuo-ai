package com.weishuo.backend.topic;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TopicRepository extends JpaRepository<Topic, Long> {
    
    // 按分类查询热门话题
    List<Topic> findByCategoryOrderByPostCountDescCommentCountDesc(String category);
    
    // 查询所有热门话题
    List<Topic> findByIsHotTrueOrderByPostCountDescCommentCountDesc();
    
    // 搜索话题（标题包含关键词）
    @Query("SELECT t FROM Topic t WHERE LOWER(t.title) LIKE LOWER(CONCAT('%', :keyword, '%')) ORDER BY t.postCount DESC")
    List<Topic> searchByKeyword(@Param("keyword") String keyword);
    
    // 获取热门话题（按综合热度排序）
    @Query("SELECT t FROM Topic t ORDER BY (t.postCount * 2 + t.commentCount + t.likeCount / 10) DESC")
    List<Topic> findHotTopics();
}
