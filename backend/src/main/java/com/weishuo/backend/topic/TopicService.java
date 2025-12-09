package com.weishuo.backend.topic;

import com.weishuo.backend.topic.dto.TopicResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Random;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TopicService {
    
    private final TopicRepository topicRepository;
    
    /**
     * 获取热门话题列表
     */
    public List<TopicResponse> getHotTopics() {
        return topicRepository.findHotTopics().stream()
                .limit(10)
                .map(this::toResponse)
                .collect(Collectors.toList());
    }
    
    /**
     * 按分类获取话题
     */
    public List<TopicResponse> getTopicsByCategory(String category) {
        return topicRepository.findByCategoryOrderByPostCountDescCommentCountDesc(category).stream()
                .limit(20)
                .map(this::toResponse)
                .collect(Collectors.toList());
    }
    
    /**
     * 搜索话题
     */
    public List<TopicResponse> searchTopics(String keyword) {
        if (keyword == null || keyword.trim().isEmpty()) {
            return getHotTopics();
        }
        return topicRepository.searchByKeyword(keyword).stream()
                .limit(50)
                .map(this::toResponse)
                .collect(Collectors.toList());
    }
    
    /**
     * 初始化热门话题数据（仅用于开发/测试）
     */
    @Transactional
    public void initializeTopics() {
        if (topicRepository.count() > 0) {
            return;  // 已有数据，不重复初始化
        }
        
        Random random = new Random();
        
        // 科技话题
        createTopic("AI技术革命", "科技", random);
        createTopic("量子计算突破", "科技", random);
        createTopic("元宇宙发展", "科技", random);
        createTopic("5G应用场景", "科技", random);
        
        // 新闻话题
        createTopic("气候峰会召开", "新闻", random);
        createTopic("经济政策调整", "新闻", random);
        createTopic("国际关系动态", "新闻", random);
        
        // 体育话题
        createTopic("世界杯决赛", "体育", random);
        createTopic("NBA总决赛", "体育", random);
        createTopic("奥运会筹备", "体育", random);
        
        // 娱乐话题
        createTopic("电影首映礼", "娱乐", random);
        createTopic("音乐颁奖典礼", "娱乐", random);
        createTopic("明星慈善活动", "娱乐", random);
        
        // 财经话题
        createTopic("股市创新高", "财经", random);
        createTopic("加密货币趋势", "财经", random);
        createTopic("房地产市场", "财经", random);
    }
    
    private void createTopic(String title, String category, Random random) {
        Topic topic = new Topic();
        topic.setTitle(title);
        topic.setCategory(category);
        topic.setPostCount(random.nextInt(200) + 50);  // 50-250K
        topic.setCommentCount(random.nextInt(5) + 1);   // 1-5K
        topic.setLikeCount(random.nextInt(40) + 10);   // 10-50K
        topic.setIsHot(random.nextBoolean());
        topicRepository.save(topic);
    }
    
    private TopicResponse toResponse(Topic topic) {
        return new TopicResponse(
                topic.getId(),
                topic.getTitle(),
                topic.getCategory(),
                topic.getPostCount(),
                topic.getCommentCount(),
                topic.getLikeCount(),
                topic.getIsHot()
        );
    }
}
