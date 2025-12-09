import { useMemo, useState } from 'react';
import { Bookmark, MessageCircle, Heart, Share2, Link } from 'lucide-react';
import './Bookmarks.css';

interface BookmarkItem {
  id: number;
  title: string;
  type: 'article' | 'video' | 'thread';
  label: string;
  author: string;
  time: string;
  excerpt: string;
  link: string;
  stats: {
    comments: string;
    likes: string;
    saves: string;
  };
}

function Bookmarks() {
  const [activeFilter, setActiveFilter] = useState<'all' | 'article' | 'video' | 'thread'>('all');

  const bookmarks: BookmarkItem[] = useMemo(
    () => [
      {
        id: 1,
        title: 'AI 驱动的新闻摘要：用更少时间读懂更多',
        type: 'article',
        label: '深度阅读',
        author: '麦麦Tech',
        time: '2 小时前',
        excerpt: '用 NLP 把长篇新闻压缩成 3 条关键要点，同时保留上下文和情绪色彩。',
        link: 'https://example.com/ai-news-summary',
        stats: { comments: '162', likes: '1.9K', saves: '450' }
      },
      {
        id: 2,
        title: '世界杯决赛加时绝杀，全场战术复盘',
        type: 'video',
        label: '赛事集锦',
        author: '球场显微镜',
        time: '昨天',
        excerpt: '4 分钟看完决赛攻防要点，包含跑位热区、关键传球与门将站位拆解。',
        link: 'https://example.com/worldcup-recap',
        stats: { comments: '98', likes: '1.1K', saves: '310' }
      },
      {
        id: 3,
        title: '如何设计不会打扰用户的通知系统',
        type: 'thread',
        label: '产品讨论',
        author: 'UX Coffee',
        time: '3 天前',
        excerpt: '频率、分级与用户控制权是通知体验的三要素。附上实际策略与埋点示例。',
        link: 'https://example.com/notification-design',
        stats: { comments: '240', likes: '2.7K', saves: '680' }
      },
      {
        id: 4,
        title: '本周值得读的 5 篇 Web3 长文',
        type: 'article',
        label: '收藏夹',
        author: '链上读书会',
        time: '1 周前',
        excerpt: '从协议升级到应用层突破，一次性收好本周最值得的长文集合。',
        link: 'https://example.com/web3-reading',
        stats: { comments: '56', likes: '870', saves: '190' }
      }
    ],
    []
  );

  const filtered = bookmarks.filter((item) => activeFilter === 'all' || item.type === activeFilter);

  return (
    <div className="bookmarks-page">
      <header className="bookmarks-header">
        <div>
          <p className="eyebrow">Saved</p>
          <h1>书签</h1>
          <p className="bookmark-subtitle">把重要的内容先存起来，随时回来继续读</p>
        </div>
        <div className="bookmark-pill">
          <Bookmark size={16} /> 已保存 {bookmarks.length}
        </div>
      </header>

      <div className="bookmark-actions">
        <div className="bookmark-filters">
          {[
            { key: 'all', label: '全部' },
            { key: 'article', label: '文章' },
            { key: 'video', label: '视频' },
            { key: 'thread', label: '长贴' }
          ].map((filter) => (
            <button
              key={filter.key}
              className={`bookmark-filter ${activeFilter === filter.key ? 'active' : ''}`}
              onClick={() => setActiveFilter(filter.key as typeof activeFilter)}
            >
              {filter.label}
            </button>
          ))}
        </div>
        <div className="bookmark-quick">
          <button className="chip ghost">按最新</button>
          <button className="chip ghost">按热度</button>
        </div>
      </div>

      <div className="bookmark-list">
        {filtered.map((item) => (
          <article key={item.id} className="bookmark-card">
            <div className="bookmark-card__head">
              <div className="bookmark-meta">
                <span className={`bookmark-type ${item.type}`}>{item.label}</span>
                <span className="dot">•</span>
                <span className="time">{item.time}</span>
              </div>
              <button className="save-btn">
                <Bookmark size={16} /> {item.stats.saves}
              </button>
            </div>

            <h3 className="bookmark-title">{item.title}</h3>
            <p className="bookmark-excerpt">{item.excerpt}</p>

            <div className="bookmark-card__foot">
              <div className="author">
                <div className="avatar-chip">{item.author.slice(0, 1)}</div>
                <div>
                  <div className="author-name">{item.author}</div>
                  <a className="link" href={item.link} target="_blank" rel="noreferrer">
                    <Link size={14} /> 查看原文
                  </a>
                </div>
              </div>
              <div className="stats">
                <span><MessageCircle size={16} /> {item.stats.comments}</span>
                <span><Heart size={16} /> {item.stats.likes}</span>
                <span><Share2 size={16} /> 分享</span>
              </div>
            </div>
          </article>
        ))}

        {filtered.length === 0 && (
          <div className="bookmark-empty">
            <Bookmark size={32} />
            <p>还没有书签，去时间线上先收藏几条吧</p>
            <button className="primary-btn">去发现</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Bookmarks;
