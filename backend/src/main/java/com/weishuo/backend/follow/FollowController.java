package com.weishuo.backend.follow;

import com.weishuo.backend.follow.dto.FollowRequest;
import com.weishuo.backend.follow.dto.UserSummary;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/follow")
@CrossOrigin(origins = "*")
public class FollowController {
    
    @Autowired
    private FollowService followService;
    
    // 关注用户
    @PostMapping
    public ResponseEntity<?> followUser(
            @RequestParam Long followerId,
            @RequestBody FollowRequest request) {
        try {
            boolean success = followService.followUser(followerId, request.getFollowingId());
            
            Map<String, Object> response = new HashMap<>();
            if (success) {
                response.put("success", true);
                response.put("message", "关注成功");
                response.put("followersCount", followService.getFollowersCount(request.getFollowingId()));
                return ResponseEntity.ok(response);
            } else {
                response.put("success", false);
                response.put("message", "已经关注过该用户");
                return ResponseEntity.badRequest().body(response);
            }
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    // 取消关注
    @DeleteMapping
    public ResponseEntity<?> unfollowUser(
            @RequestParam Long followerId,
            @RequestParam Long followingId) {
        try {
            boolean success = followService.unfollowUser(followerId, followingId);
            
            Map<String, Object> response = new HashMap<>();
            if (success) {
                response.put("success", true);
                response.put("message", "取消关注成功");
                response.put("followersCount", followService.getFollowersCount(followingId));
                return ResponseEntity.ok(response);
            } else {
                response.put("success", false);
                response.put("message", "未关注该用户");
                return ResponseEntity.badRequest().body(response);
            }
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    // 检查是否关注
    @GetMapping("/check")
    public ResponseEntity<?> checkFollowing(
            @RequestParam Long followerId,
            @RequestParam Long followingId) {
        boolean isFollowing = followService.isFollowing(followerId, followingId);
        
        Map<String, Object> response = new HashMap<>();
        response.put("isFollowing", isFollowing);
        return ResponseEntity.ok(response);
    }
    
    // 获取关注列表
    @GetMapping("/following/{userId}")
    public ResponseEntity<List<UserSummary>> getFollowingList(
            @PathVariable Long userId,
            @RequestParam(required = false) Long currentUserId) {
        List<UserSummary> followingList = followService.getFollowingList(userId, currentUserId);
        return ResponseEntity.ok(followingList);
    }
    
    // 获取粉丝列表
    @GetMapping("/followers/{userId}")
    public ResponseEntity<List<UserSummary>> getFollowersList(
            @PathVariable Long userId,
            @RequestParam(required = false) Long currentUserId) {
        List<UserSummary> followersList = followService.getFollowersList(userId, currentUserId);
        return ResponseEntity.ok(followersList);
    }
    
    // 获取关注统计
    @GetMapping("/stats/{userId}")
    public ResponseEntity<?> getFollowStats(@PathVariable Long userId) {
        Map<String, Object> stats = new HashMap<>();
        stats.put("followersCount", followService.getFollowersCount(userId));
        stats.put("followingCount", followService.getFollowingCount(userId));
        return ResponseEntity.ok(stats);
    }
}
