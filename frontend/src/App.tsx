import { useMemo, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Home, Search, Bell, Mail, Bookmark, User, Settings, LogOut } from 'lucide-react';
import HomePage from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Explore from './pages/Explore';
import Notifications from './pages/Notifications';
import Messages from './pages/Messages';
import Profile from './pages/Profile';
import Bookmarks from './pages/Bookmarks';
import './App.css';

function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const [suggestions, setSuggestions] = useState([
    { id: 1, name: '科技新闻', handle: '@technews', avatar: 'https://i.pravatar.cc/48?img=1', followed: false },
    { id: 2, name: '每日快讯', handle: '@dailynews', avatar: 'https://i.pravatar.cc/48?img=2', followed: false }
  ]);

  const [trending, setTrending] = useState([
    { id: 1, category: '科技 · 实时', title: '人工智能技术突破', tweets: 12500 },
    { id: 2, category: '新闻 · 热门', title: '全球气候峰会', tweets: 8300 },
    { id: 3, category: '体育 · 直播', title: '世界杯决赛', tweets: 25100 }
  ]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="app">
      {/* 侧边栏 */}
      <aside className="sidebar">
        <div className="logo">微说</div>
        <nav className="nav">
          <button 
            className={`nav-item ${isActive('/') ? 'active' : ''}`}
            onClick={() => navigate('/')}
          >
            <Home size={24} />
            <span>首页</span>
          </button>
          <button 
            className={`nav-item ${isActive('/explore') ? 'active' : ''}`}
            onClick={() => navigate('/explore')}
          >
            <Search size={24} />
            <span>探索</span>
          </button>
          <button 
            className={`nav-item ${isActive('/notifications') ? 'active' : ''}`}
            onClick={() => navigate('/notifications')}
          >
            <Bell size={24} />
            <span>通知</span>
          </button>
          <button 
            className={`nav-item ${isActive('/messages') ? 'active' : ''}`}
            onClick={() => navigate('/messages')}
          >
            <Mail size={24} />
            <span>私信</span>
          </button>
          <button 
            className={`nav-item ${isActive('/bookmarks') ? 'active' : ''}`}
            onClick={() => navigate('/bookmarks')}
          >
            <Bookmark size={24} />
            <span>书签</span>
          </button>
          <button
            className={`nav-item ${isActive('/profile') ? 'active' : ''}`}
            onClick={() => navigate('/profile')}
          >
            <User size={24} />
            <span>个人资料</span>
          </button>
          <button className="nav-item" onClick={handleLogout}>
            <LogOut size={24} />
            <span>退出登录</span>
          </button>
        </nav>
        <button className="tweet-button">发布</button>
        {user.displayName && (
          <div className="user-info">
            <div className="user-avatar">
              {user.avatarUrl ? (
                <img src={user.avatarUrl} alt={user.displayName} />
              ) : (
                <div className="avatar-placeholder">{user.displayName[0]}</div>
              )}
            </div>
            <div className="user-details">
              <div className="user-name">{user.displayName}</div>
              <div className="user-handle">@{user.username}</div>
            </div>
          </div>
        )}
      </aside>

      {/* 主要内容区 */}
      <main className="main-content">
        {children}
      </main>

      {/* 右侧栏 */}
      <aside className="right-sidebar">
        <div className="search-box">
          <Search size={20} />
          <input type="text" placeholder="搜索微说" />
        </div>

        <div className="trending-widget">
          <h2>正在发生</h2>
          {trending.map((t) => (
            <button
              key={t.id}
              className="trending-item interactive"
              onClick={() =>
                setTrending((prev) =>
                  prev.map((p) => (p.id === t.id ? { ...p, tweets: p.tweets + 1 } : p))
                )
              }
            >
              <div className="trending-category">{t.category}</div>
              <div className="trending-title">{t.title}</div>
              <div className="trending-tweets">{(t.tweets / 1000).toFixed(1)}K 推文</div>
            </button>
          ))}
        </div>

        <div className="suggestions-widget">
          <h2>推荐关注</h2>
          {suggestions.map((s) => (
            <div key={s.id} className="suggestion-item">
              <img src={s.avatar} alt={s.name} className="suggestion-avatar" />
              <div className="suggestion-info">
                <div className="suggestion-name">{s.name}</div>
                <div className="suggestion-handle">{s.handle}</div>
              </div>
              <button
                className={`follow-button ${s.followed ? 'following' : ''}`}
                onClick={() =>
                  setSuggestions((prev) =>
                    prev.map((p) => (p.id === s.id ? { ...p, followed: !p.followed } : p))
                  )
                }
              >
                {s.followed ? '已关注' : '关注'}
              </button>
            </div>
          ))}
        </div>
      </aside>
    </div>
  );
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem('token');
  return token ? <>{children}</> : <Navigate to="/login" />;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        <Route path="/" element={
          <ProtectedRoute>
            <Layout>
              <HomePage />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/explore" element={
          <ProtectedRoute>
            <Layout>
              <Explore />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/notifications" element={
          <ProtectedRoute>
            <Layout>
              <Notifications />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/messages" element={
          <ProtectedRoute>
            <Layout>
              <Messages />
            </Layout>
          </ProtectedRoute>
        } />

        <Route path="/bookmarks" element={
          <ProtectedRoute>
            <Layout>
              <Bookmarks />
            </Layout>
          </ProtectedRoute>
        } />

        <Route path="/profile" element={
          <ProtectedRoute>
            <Layout>
              <Profile />
            </Layout>
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;
