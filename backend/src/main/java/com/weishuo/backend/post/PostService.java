package com.weishuo.backend.post;

import com.weishuo.backend.post.dto.PostRequest;
import com.weishuo.backend.post.dto.PostResponse;
import java.util.List;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

@Service
@RequiredArgsConstructor
public class PostService {

    private final PostRepository postRepository;

    public PostResponse create(PostRequest request) {
        Post post = Post.builder()
                .userId(request.getUserId())
                .username(trimOrNull(request.getUsername()))
                .displayName(trimOrNull(request.getDisplayName()))
                .avatarUrl(trimOrNull(request.getAvatarUrl()))
                .content(request.getContent().trim())
                .likes(0)
                .comments(0)
                .reposts(0)
                .build();

        Post saved = postRepository.save(post);
        return toResponse(saved);
    }

    public List<PostResponse> listAll(Long userId, String username) {
        List<Post> posts;
        if (userId != null) {
            posts = postRepository.findByUserIdOrderByCreatedAtDesc(userId);
        } else if (StringUtils.hasText(username)) {
            posts = postRepository.findByUsernameOrderByCreatedAtDesc(username.trim());
        } else {
            posts = postRepository.findAllByOrderByCreatedAtDesc();
        }
        return posts.stream().map(this::toResponse).collect(Collectors.toList());
    }

    private PostResponse toResponse(Post post) {
        return PostResponse.builder()
                .id(post.getId())
                .userId(post.getUserId())
                .username(post.getUsername())
                .displayName(post.getDisplayName())
                .avatarUrl(post.getAvatarUrl())
                .content(post.getContent())
                .createdAt(post.getCreatedAt())
                .likes(post.getLikes())
                .comments(post.getComments())
                .reposts(post.getReposts())
                .build();
    }

    private String trimOrNull(String text) {
        if (text == null) {
            return null;
        }
        String trimmed = text.trim();
        return trimmed.isEmpty() ? null : trimmed;
    }
}
