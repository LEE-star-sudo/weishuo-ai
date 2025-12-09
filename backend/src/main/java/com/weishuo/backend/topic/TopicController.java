package com.weishuo.backend.topic;

import com.weishuo.backend.topic.dto.TopicResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/topics")
@RequiredArgsConstructor
public class TopicController {
    
    private final TopicService topicService;
    
    /**
     * 获取热门话题列表
     */
    @GetMapping("/hot")
    public ResponseEntity<List<TopicResponse>> getHotTopics() {
        return ResponseEntity.ok(topicService.getHotTopics());
    }
    
    /**
     * 按分类获取话题
     * @param category 分类: 热门、新闻、体育、娱乐、科技、财经
     */
    @GetMapping("/category/{category}")
    public ResponseEntity<List<TopicResponse>> getTopicsByCategory(@PathVariable String category) {
        if ("热门".equals(category)) {
            return ResponseEntity.ok(topicService.getHotTopics());
        }
        return ResponseEntity.ok(topicService.getTopicsByCategory(category));
    }
    
    /**
     * 搜索话题
     * @param keyword 搜索关键词
     */
    @GetMapping("/search")
    public ResponseEntity<List<TopicResponse>> searchTopics(@RequestParam(required = false) String keyword) {
        return ResponseEntity.ok(topicService.searchTopics(keyword));
    }
    
    /**
     * 初始化话题数据（开发用）
     */
    @PostMapping("/initialize")
    public ResponseEntity<String> initializeTopics() {
        topicService.initializeTopics();
        return ResponseEntity.ok("Topics initialized successfully");
    }
}
