import { useState, useEffect } from 'react';
import { Search, Flame, MessageCircle, Heart, TrendingUp } from 'lucide-react';
import axios from 'axios';
import './Explore.css';

interface Topic {
  id: number;
  title: string;
  category: string;
  postCount: number;
  commentCount: number;
  likeCount: number;
  isHot: boolean;
}

function Explore() {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [activeTab, setActiveTab] = useState('热门');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const tabs = ['热门', '新闻', '体育', '娱乐', '科技', '财经'];

  useEffect(() => {
    loadTopics();
  }, [activeTab]);

  const loadTopics = async () => {
    try {
      const endpoint = activeTab === '热门' 
        ? '/api/topics/hot'
        : `/api/topics/category/${activeTab}`;
      const response = await axios.get(`http://localhost:8081${endpoint}`);
      setTopics(response.data);
    } catch (error) {
      console.error('Failed to load topics:', error);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      loadTopics();
      return;
    }
    
    setIsSearching(true);
    try {
      const response = await axios.get(`http://localhost:8081/api/topics/search`, {
        params: { keyword: searchQuery }
      });
      setTopics(response.data);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const formatCount = (count: number) => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  return (
    <div className="explore-page">
      <div className="explore-header">
        <div>
          <p className="eyebrow">Discover</p>
          <h1>探索</h1>
        </div>
        <div className="pill live-pill">
          <Flame size={14} /> 实时热榜
        </div>
      </div>

      <div className="explore-search">
        <Search size={18} />
        <input 
          type="text" 
          placeholder="搜索微说、话题或用户" 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <button 
          className="pill search-button" 
          onClick={handleSearch}
          disabled={isSearching}
        >
          {isSearching ? '搜索中...' : '# 标签搜索'}
        </button>
      </div>

      <div className="explore-tabs">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`explore-tab ${activeTab === tab ? 'active' : ''}`}
            onClick={() => {
              setActiveTab(tab);
              setSearchQuery('');
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="trending-list">
        {topics.length === 0 ? (
          <div className="no-results">
            <Search size={48} />
            <p>没有找到相关话题</p>
          </div>
        ) : (
          topics.map((topic, index) => (
            <div key={topic.id} className="trending-card">
              <div className="trending-rank">#{index + 1}</div>
              <div className="trending-content">
                <div className="trending-category">{topic.category} · {topic.isHot ? '热门' : ''}</div>
                <div className="trending-topic">{topic.title}</div>
                <div className="trending-meta">
                  <span className="chip"><TrendingUp size={14} /> {formatCount(topic.postCount)} 推文</span>
                  <span className="meta"><MessageCircle size={14} /> {formatCount(topic.commentCount * 1000)}</span>
                  <span className="meta"><Heart size={14} /> {formatCount(topic.likeCount * 1000)}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Explore;
