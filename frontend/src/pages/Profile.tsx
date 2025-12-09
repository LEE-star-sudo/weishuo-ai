import { useEffect, useState } from 'react';
import axios from 'axios';
import { CalendarDays, Link as LinkIcon, MapPin, Image as ImageIcon, Video, MessageCircle, Heart, Share2 } from 'lucide-react';
import './Profile.css';

function Profile() {
  const [profile, setProfile] = useState({
    name: '微说用户',
    handle: 'weishuo_user',
    bio: '热爱科技与生活，分享所见所感。保持好奇，保持谦逊。',
    location: '上海 · 中国',
    website: 'weishuo.app',
    joined: '2023年7月加入',
    followers: '12.5K',
    following: '580',
    stats: [
      { label: '推文', value: '1,238' },
      { label: '关注', value: '580' },
      { label: '粉丝', value: '12.5K' },
      { label: '点赞', value: '34.8K' }
    ]
  });

  const [showEditor, setShowEditor] = useState(false);
  const [form, setForm] = useState({
    name: profile.name,
    handle: profile.handle,
    bio: profile.bio,
    location: profile.location,
    website: profile.website
  });

  const openEditor = () => {
    setForm({
      name: profile.name,
      handle: profile.handle,
      bio: profile.bio,
      location: profile.location,
      website: profile.website
    });
    setShowEditor(true);
  };

  const saveProfile = () => {
    setProfile((prev) => ({
      ...prev,
      name: form.name,
      handle: form.handle,
      bio: form.bio,
      location: form.location,
      website: form.website
    }));
    setShowEditor(false);
  };

  const handleChange = (key: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const highlights = [
    { title: '周末的黄浦江日落', time: '3小时前', likes: '1.2K', comments: '180', shares: '92' },
    { title: '刚看完的 AI 论文，细节扎实', time: '昨天', likes: '980', comments: '120', shares: '66' }
  ];

  const media = [
    { src: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=600', alt: '咖啡馆' },
    { src: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=600', alt: '夜晚城市' },
    { src: 'https://images.unsplash.com/photo-1523475472560-d2df97ec485c?w=600', alt: '夕阳' },
    { src: 'https://images.unsplash.com/photo-1517816428104-797678c7cf0d?w=600', alt: '室内' }
  ];

  const [posts, setPosts] = useState<Array<{ id: string; content: string; createdAt: string }>>([]);
  const API_BASE = 'http://localhost:8081';

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const params: Record<string, string | number> = {};
    if (user.id) params.userId = user.id;
    else if (user.username) params.username = user.username;

    axios.get(`${API_BASE}/api/posts`, { params })
      .then((res) => {
        const mapped = res.data.map((p: any) => ({
          id: `post-${p.id}`,
          content: p.content,
          createdAt: p.createdAt || '刚刚'
        }));
        setPosts(mapped);
        setProfile((prev) => ({
          ...prev,
          name: user.displayName || prev.name,
          handle: user.username || prev.handle,
          followers: prev.followers,
          following: prev.following
        }));
      })
      .catch((err) => console.error('加载个人动态失败', err));
  }, []);

  return (
    <div className="profile-page">
      <div className="profile-header">
        <div className="cover" />
        <div className="profile-main">
          <div className="avatar-wrap">
            <img src="https://i.pravatar.cc/120?img=15" alt={profile.name} />
          </div>
          <button className="edit-btn" onClick={openEditor}>编辑资料</button>
        </div>
        <div className="identity">
          <h1>{profile.name}</h1>
          <p className="handle">@{profile.handle}</p>
          <p className="bio">{profile.bio}</p>
          <div className="meta">
            <span><MapPin size={16} /> {profile.location}</span>
            <span><LinkIcon size={16} /> {profile.website}</span>
            <span><CalendarDays size={16} /> {profile.joined}</span>
          </div>
          <div className="follow">
            <span><strong>{profile.following}</strong> 正在关注</span>
            <span><strong>{profile.followers}</strong> 关注者</span>
          </div>
          <div className="stat-grid">
            {profile.stats.map((s) => (
              <div key={s.label} className="stat-card">
                <div className="stat-value">{s.value}</div>
                <div className="stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="profile-content">
        <section className="block">
          <div className="block-title">高光</div>
          <div className="highlight-list">
            {highlights.map((h, idx) => (
              <div key={idx} className="highlight-card">
                <div className="highlight-title">{h.title}</div>
                <div className="highlight-meta">{h.time}</div>
                <div className="highlight-actions">
                  <span><MessageCircle size={16} /> {h.comments}</span>
                  <span><Heart size={16} /> {h.likes}</span>
                  <span><Share2 size={16} /> {h.shares}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="block">
          <div className="block-title with-icon"><ImageIcon size={16} /> 媒体</div>
          <div className="media-grid">
            {media.map((m, idx) => (
              <div key={idx} className="media-item">
                <img src={m.src} alt={m.alt} />
              </div>
            ))}
          </div>
        </section>

        <section className="block">
          <div className="block-title with-icon"><Video size={16} /> 最新动态</div>
          {posts.length === 0 ? (
            <div className="feed-placeholder">还没有发布内容，去首页试试发布吧</div>
          ) : (
            <div className="profile-posts">
              {posts.map((p) => (
                <div key={p.id} className="profile-post">
                  <div className="profile-post-meta">{p.createdAt}</div>
                  <div className="profile-post-content">{p.content}</div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {showEditor && (
        <div className="profile-editor-backdrop" onClick={() => setShowEditor(false)}>
          <div className="profile-editor" onClick={(e) => e.stopPropagation()}>
            <div className="editor-header">
              <div>编辑资料</div>
              <button className="close-btn" onClick={() => setShowEditor(false)}>×</button>
            </div>
            <div className="editor-body">
              <label>
                昵称
                <input value={form.name} onChange={(e) => handleChange('name', e.target.value)} maxLength={30} />
              </label>
              <label>
                用户名
                <input value={form.handle} onChange={(e) => handleChange('handle', e.target.value)} maxLength={30} />
              </label>
              <label>
                简介
                <textarea value={form.bio} onChange={(e) => handleChange('bio', e.target.value)} rows={3} maxLength={160} />
              </label>
              <label>
                位置
                <input value={form.location} onChange={(e) => handleChange('location', e.target.value)} maxLength={50} />
              </label>
              <label>
                网站
                <input value={form.website} onChange={(e) => handleChange('website', e.target.value)} maxLength={80} />
              </label>
            </div>
            <div className="editor-footer">
              <button className="ghost-btn" onClick={() => setShowEditor(false)}>取消</button>
              <button className="save-btn" onClick={saveProfile}>保存</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;
