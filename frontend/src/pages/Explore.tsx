import { Search, Flame, MessageCircle, Heart } from 'lucide-react';
import './Explore.css';

function Explore() {
  const trendingTopics = [
    { category: '科技', title: 'AI技术革命', tweets: '125K', comments: '4.2K', likes: '32K' },
    { category: '新闻', title: '气候峰会召开', tweets: '83K', comments: '2.1K', likes: '21K' },
    { category: '体育', title: '世界杯决赛', tweets: '251K', comments: '6.8K', likes: '49K' },
    { category: '娱乐', title: '电影首映礼', tweets: '67K', comments: '1.4K', likes: '12K' },
    { category: '财经', title: '股市创新高', tweets: '92K', comments: '2.9K', likes: '18K' },
    { category: '科技', title: '量子计算突破', tweets: '45K', comments: '1.1K', likes: '9K' },
    { category: '社会', title: '教育改革方案', tweets: '38K', comments: '970', likes: '7K' },
    { category: '健康', title: '新药物研发', tweets: '29K', comments: '860', likes: '5K' }
  ];

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
        <input type="text" placeholder="搜索微说、话题或用户" />
        <div className="pill"># 热门趋势</div>
      </div>

      <div className="explore-tabs">
        <button className="explore-tab active">热门</button>
        <button className="explore-tab">新闻</button>
        <button className="explore-tab">体育</button>
        <button className="explore-tab">娱乐</button>
        <button className="explore-tab">科技</button>
      </div>

      <div className="trending-list">
        {trendingTopics.map((topic, index) => (
          <div key={index} className="trending-card">
            <div className="trending-rank">#{index + 1}</div>
            <div className="trending-content">
              <div className="trending-category">{topic.category} · 热门</div>
              <div className="trending-topic">{topic.title}</div>
              <div className="trending-meta">
                <span className="chip">{topic.tweets} 推文</span>
                <span className="meta"><MessageCircle size={14} /> {topic.comments}</span>
                <span className="meta"><Heart size={14} /> {topic.likes}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Explore;
