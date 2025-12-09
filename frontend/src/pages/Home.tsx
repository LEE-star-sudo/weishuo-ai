import { useEffect, useMemo, useState } from 'react';
import { Home as HomeIcon, Search, Bell, Mail, Bookmark, User, Settings, MoreHorizontal, Heart, MessageCircle, Repeat2, Share } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Home.css';

interface FeedAuthor {
  name: string;
  handle: string;
  avatar: string;
  verified: boolean;
  badge: string;
}

interface FeedMedia {
  type: string;
  cover: string;
}

interface FeedStats {
  reposts: number;
  comments: number;
  likes: number;
}

interface NewsFeedItem {
  id: string;
  tag: string;
  author: FeedAuthor;
  content: string;
  media?: FeedMedia;
  stats: FeedStats;
  createdAt: string;
  source: string;
  link: string;
  title?: string;
}

function HomePage() {
  const API_BASE = 'http://localhost:8081';
  const [remoteItems, setRemoteItems] = useState<NewsFeedItem[]>([]);
  const [postItems, setPostItems] = useState<NewsFeedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('hot');
  const [composeText, setComposeText] = useState('');
  const [publishing, setPublishing] = useState(false);
  const navigate = useNavigate();

  const user = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem('user') || '{}');
    } catch (e) {
      return {};
    }
  }, []);

  const combinedItems = useMemo(() => [...postItems, ...remoteItems], [postItems, remoteItems]);

  useEffect(() => {
    // 检查登录状态
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    
    fetchNews(activeTab);
    fetchPosts();
  }, [activeTab, navigate]);

  const fetchNews = async (channel: string) => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE}/api/news/latest?channel=${channel}`);
      setRemoteItems(response.data);
    } catch (error) {
      console.error('获取新闻失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPosts = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/posts`);
      const mapped: NewsFeedItem[] = res.data.map((p: any) => ({
        id: `post-${p.id}`,
        tag: '#随便说说',
        author: {
          name: p.displayName || '匿名用户',
          handle: p.username ? `@${p.username}` : '@anonymous',
          avatar: p.avatarUrl || 'https://i.pravatar.cc/64?img=30',
          verified: true,
          badge: '动态'
        },
        content: p.content,
        stats: {
          reposts: p.reposts || 0,
          comments: p.comments || 0,
          likes: p.likes || 0
        },
        createdAt: p.createdAt || '刚刚',
        source: 'local',
        link: ''
      }));
      setPostItems(mapped);
    } catch (error) {
      console.error('获取动态失败:', error);
    }
  };

  const handlePublish = () => {
    if (!composeText.trim() || publishing) return;

    setPublishing(true);

    axios.post(`${API_BASE}/api/posts`, {
      content: composeText.trim(),
      userId: user.id,
      username: user.username,
      displayName: user.displayName,
      avatarUrl: user.avatarUrl
    })
      .then((res) => {
        const p = res.data;
        const mapped: NewsFeedItem = {
          id: `post-${p.id}`,
          tag: '#随便说说',
          author: {
            name: p.displayName || '我',
            handle: p.username ? `@${p.username}` : '@me',
            avatar: p.avatarUrl || user.avatarUrl || 'https://i.pravatar.cc/64?img=30',
            verified: true,
            badge: '动态'
          },
          content: p.content,
          stats: { reposts: p.reposts || 0, comments: p.comments || 0, likes: p.likes || 0 },
          createdAt: '刚刚',
          source: 'local',
          link: ''
        };
        setPostItems((prev) => [mapped, ...prev]);
        setComposeText('');
      })
      .catch((err) => {
        console.error('发布失败', err);
      })
      .finally(() => setPublishing(false));
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="home-content">
      <div className="header">
        <h1>首页</h1>
      </div>

      {/* 频道切换 */}
      <div className="tabs">
        <button 
          className={activeTab === 'hot' ? 'tab active' : 'tab'}
          onClick={() => setActiveTab('hot')}
        >
          热门
        </button>
        <button 
          className={activeTab === 'tech' ? 'tab active' : 'tab'}
          onClick={() => setActiveTab('tech')}
        >
          科技
        </button>
        <button 
          className={activeTab === 'society' ? 'tab active' : 'tab'}
          onClick={() => setActiveTab('society')}
        >
          社会
        </button>
      </div>

      <div className="composer">
        <img
          src={user.avatarUrl || 'https://i.pravatar.cc/48?img=30'}
          alt={user.displayName || '我'}
          className="composer-avatar"
        />
        <div className="composer-body">
          <textarea
            placeholder="分享此刻的新鲜事..."
            value={composeText}
            onChange={(e) => setComposeText(e.target.value)}
            maxLength={280}
          />
          <div className="composer-footer">
            <div className="composer-count">{composeText.length}/280</div>
            <button
              className="composer-publish"
              onClick={handlePublish}
              disabled={!composeText.trim()}
            >
              发布
            </button>
          </div>
        </div>
      </div>

      {/* 新闻推文列表 */}
      <div className="feed">
        {loading ? (
          <div className="loading">加载中...</div>
        ) : (
          combinedItems.map((item) => (
            <article key={item.id} className="tweet">
              <img src={item.author.avatar} alt={item.author.name} className="avatar" />
              <div className="tweet-content">
                <div className="tweet-header">
                  <div className="author-info">
                    <span className="author-name">{item.author.name}</span>
                    {item.author.verified && <span className="verified">✓</span>}
                    <span className="author-handle">{item.author.handle}</span>
                    <span className="badge">{item.author.badge}</span>
                    <span className="timestamp">· {item.createdAt}</span>
                  </div>
                  <button className="more-button">
                    <MoreHorizontal size={16} />
                  </button>
                </div>

                <div className="tweet-tag">{item.tag}</div>
                <div className="tweet-text">{item.content}</div>

                {item.media && (
                  <div className="tweet-media">
                    <img src={item.media.cover} alt="新闻图片" />
                  </div>
                )}

                {item.link && (
                  <a href={item.link} target="_blank" rel="noopener noreferrer" className="news-link">
                    查看原文 →
                  </a>
                )}

                <div className="tweet-actions">
                  <button className="action-button">
                    <MessageCircle size={18} />
                    <span>{item.stats.comments}</span>
                  </button>
                  <button className="action-button retweet">
                    <Repeat2 size={18} />
                    <span>{item.stats.reposts}</span>
                  </button>
                  <button className="action-button like">
                    <Heart size={18} />
                    <span>{item.stats.likes}</span>
                  </button>
                  <button className="action-button">
                    <Share size={18} />
                  </button>
                </div>
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  );
}

export default HomePage;
