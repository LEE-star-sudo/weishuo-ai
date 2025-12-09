package com.weishuo.backend.follow;

import com.weishuo.backend.follow.dto.UserSummary;
import com.weishuo.backend.user.User;
import com.weishuo.backend.user.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class FollowService {
    
    @Autowired
    private FollowRepository followRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    // 关注用户
    @Transactional
    public boolean followUser(Long followerId, Long followingId) {
        // 不能关注自己
        if (followerId.equals(followingId)) {
            throw new IllegalArgumentException("不能关注自己");
        }
        
        // 检查是否已关注
        if (followRepository.existsByFollowerIdAndFollowingId(followerId, followingId)) {
            return false;
        }
        
        // 检查用户是否存在
        User follower = userRepository.findById(followerId)
            .orElseThrow(() -> new RuntimeException("关注者不存在"));
        User following = userRepository.findById(followingId)
            .orElseThrow(() -> new RuntimeException("被关注者不存在"));
        
        // 创建关注关系
        Follow follow = new Follow();
        follow.setFollower(follower);
        follow.setFollowing(following);
        followRepository.save(follow);
        
        return true;
    }
    
    // 取消关注
    @Transactional
    public boolean unfollowUser(Long followerId, Long followingId) {
        Follow follow = followRepository.findByFollowerIdAndFollowingId(followerId, followingId)
            .orElse(null);
        
        if (follow == null) {
            return false;
        }
        
        followRepository.delete(follow);
        return true;
    }
    
    // 检查是否已关注
    public boolean isFollowing(Long followerId, Long followingId) {
        return followRepository.existsByFollowerIdAndFollowingId(followerId, followingId);
    }
    
    // 获取关注列表
    public List<UserSummary> getFollowingList(Long userId, Long currentUserId) {
        List<Follow> follows = followRepository.findFollowingsByUserId(userId);
        
        return follows.stream()
            .map(follow -> {
                User user = follow.getFollowing();
                return toUserSummary(user, currentUserId);
            })
            .collect(Collectors.toList());
    }
    
    // 获取粉丝列表
    public List<UserSummary> getFollowersList(Long userId, Long currentUserId) {
        List<Follow> follows = followRepository.findFollowersByUserId(userId);
        
        return follows.stream()
            .map(follow -> {
                User user = follow.getFollower();
                return toUserSummary(user, currentUserId);
            })
            .collect(Collectors.toList());
    }
    
    // 获取关注数
    public long getFollowingCount(Long userId) {
        return followRepository.countByFollowerId(userId);
    }
    
    // 获取粉丝数
    public long getFollowersCount(Long userId) {
        return followRepository.countByFollowingId(userId);
    }
    
    // 转换为用户摘要
    private UserSummary toUserSummary(User user, Long currentUserId) {
        UserSummary summary = new UserSummary();
        summary.setId(user.getId());
        summary.setUsername(user.getUsername());
        summary.setDisplayName(user.getDisplayName());
        summary.setAvatarUrl(user.getAvatarUrl());
        summary.setFollowersCount(getFollowersCount(user.getId()));
        summary.setFollowingCount(getFollowingCount(user.getId()));
        
        // 检查当前用户是否关注了这个用户
        if (currentUserId != null) {
            summary.setIsFollowing(isFollowing(currentUserId, user.getId()));
        } else {
            summary.setIsFollowing(false);
        }
        
        return summary;
    }
}
