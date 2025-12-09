import { Bell } from 'lucide-react';
import './Notifications.css';

function Notifications() {
  const notifications = [
    {
      id: 1,
      type: 'like',
      user: '张三',
      avatar: 'https://i.pravatar.cc/48?img=10',
      content: '赞了你的推文',
      tweet: '今天天气真不错！',
      time: '2小时前'
    },
    {
      id: 2,
      type: 'follow',
      user: '李四',
      avatar: 'https://i.pravatar.cc/48?img=11',
      content: '关注了你',
      time: '3小时前'
    },
    {
      id: 3,
      type: 'retweet',
      user: '王五',
      avatar: 'https://i.pravatar.cc/48?img=12',
      content: '转发了你的推文',
      tweet: 'AI技术正在改变世界',
      time: '5小时前'
    },
    {
      id: 4,
      type: 'comment',
      user: '赵六',
      avatar: 'https://i.pravatar.cc/48?img=13',
      content: '评论了你的推文："非常赞同！"',
      tweet: '编程是一门艺术',
      time: '1天前'
    },
    {
      id: 5,
      type: 'like',
      user: '钱七',
      avatar: 'https://i.pravatar.cc/48?img=14',
      content: '赞了你的推文',
      tweet: '学习新技术很有趣',
      time: '1天前'
    }
  ];

  return (
    <div className="notifications-page">
      <div className="notifications-header">
        <h1>通知</h1>
      </div>

      <div className="notifications-tabs">
        <button className="notifications-tab active">全部</button>
        <button className="notifications-tab">提及</button>
      </div>

      <div className="notifications-list">
        {notifications.map((notification) => (
          <div key={notification.id} className="notification-item">
            <div className="notification-icon">
              {notification.type === 'like' && <span className="icon-like">❤️</span>}
              {notification.type === 'follow' && <span className="icon-follow">👤</span>}
              {notification.type === 'retweet' && <span className="icon-retweet">🔄</span>}
              {notification.type === 'comment' && <span className="icon-comment">💬</span>}
            </div>
            
            <div className="notification-content">
              <img src={notification.avatar} alt={notification.user} className="notification-avatar" />
              <div className="notification-text">
                <span className="notification-user">{notification.user}</span>
                <span className="notification-action">{notification.content}</span>
                {notification.tweet && (
                  <div className="notification-tweet">{notification.tweet}</div>
                )}
                <div className="notification-time">{notification.time}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Notifications;
