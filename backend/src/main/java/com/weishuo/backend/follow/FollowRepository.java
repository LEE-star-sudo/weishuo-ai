package com.weishuo.backend.follow;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FollowRepository extends JpaRepository<Follow, Long> {
    
    // 检查是否已关注
    boolean existsByFollowerIdAndFollowingId(Long followerId, Long followingId);
    
    // 查找关注关系
    Optional<Follow> findByFollowerIdAndFollowingId(Long followerId, Long followingId);
    
    // 获取某用户的关注列表
    @Query("SELECT f FROM Follow f WHERE f.follower.id = :userId")
    List<Follow> findFollowingsByUserId(@Param("userId") Long userId);
    
    // 获取某用户的粉丝列表
    @Query("SELECT f FROM Follow f WHERE f.following.id = :userId")
    List<Follow> findFollowersByUserId(@Param("userId") Long userId);
    
    // 统计关注数
    long countByFollowerId(Long followerId);
    
    // 统计粉丝数
    long countByFollowingId(Long followingId);
}
