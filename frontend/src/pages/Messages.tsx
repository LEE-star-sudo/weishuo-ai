import { useEffect, useMemo, useRef, useState } from 'react';
import { Send } from 'lucide-react';
import './Messages.css';

function Messages() {
  const initialConversations = [
    {
      id: 1,
      user: '张三',
      avatar: 'https://i.pravatar.cc/64?img=20',
      lastMessage: '好的，明天见！',
      time: '10分钟前',
      unread: 2,
      messages: [
        { id: '1', from: 'them', text: '今天下午的会准时吗？', time: '09:45' },
        { id: '2', from: 'me', text: '准时，别忘了带资料。', time: '09:46' },
        { id: '3', from: 'them', text: '好的，明天见！', time: '09:50' }
      ]
    },
    {
      id: 2,
      user: '李四',
      avatar: 'https://i.pravatar.cc/64?img=21',
      lastMessage: '那个文件发给我了吗？',
      time: '1小时前',
      unread: 0,
      messages: [
        { id: '1', from: 'them', text: '上周的设计稿可以发我吗？', time: '08:10' },
        { id: '2', from: 'me', text: '刚发你邮箱了，查收一下。', time: '08:12' },
        { id: '3', from: 'them', text: '收到了，谢谢！', time: '08:13' }
      ]
    },
    {
      id: 3,
      user: '王五',
      avatar: 'https://i.pravatar.cc/64?img=22',
      lastMessage: '谢谢你的帮助',
      time: '2小时前',
      unread: 0,
      messages: [
        { id: '1', from: 'them', text: '代码里的接口我有点疑问', time: '07:00' },
        { id: '2', from: 'me', text: '我给你注释好了，你再看看。', time: '07:05' },
        { id: '3', from: 'them', text: '看到了，十分感谢！', time: '07:08' }
      ]
    },
    {
      id: 4,
      user: '赵六',
      avatar: 'https://i.pravatar.cc/64?img=23',
      lastMessage: '周末一起吃饭吧',
      time: '昨天',
      unread: 1,
      messages: [
        { id: '1', from: 'them', text: '周末有空吗？', time: '昨天 15:00' },
        { id: '2', from: 'me', text: '有空，一起吃饭？', time: '昨天 15:02' },
        { id: '3', from: 'them', text: '好啊，我订位置。', time: '昨天 15:05' }
      ]
    },
    {
      id: 5,
      user: '钱七',
      avatar: 'https://i.pravatar.cc/64?img=24',
      lastMessage: '收到，我知道了',
      time: '2天前',
      unread: 0,
      messages: [
        { id: '1', from: 'them', text: '发票记得周五前报销', time: '周二 10:00' },
        { id: '2', from: 'me', text: '好的，明天处理。', time: '周二 10:05' },
        { id: '3', from: 'them', text: '收到，我知道了', time: '周二 10:06' }
      ]
    }
  ];

  const [conversations, setConversations] = useState(initialConversations);
  const [selectedId, setSelectedId] = useState<number | null>(1);
  const [messageInput, setMessageInput] = useState('');
  const chatBodyRef = useRef<HTMLDivElement | null>(null);

  const selectedConversation = useMemo(
    () => conversations.find((c) => c.id === selectedId) ?? null,
    [selectedId, conversations]
  );

  const handleSend = () => {
    if (!selectedId || !messageInput.trim()) return;

    const newMessage = {
      id: Date.now().toString(),
      from: 'me' as const,
      text: messageInput.trim(),
      time: '刚刚'
    };

    setConversations((prev) =>
      prev.map((c) =>
        c.id === selectedId
          ? {
              ...c,
              messages: [...c.messages, newMessage],
              lastMessage: newMessage.text,
              time: '刚刚',
              unread: 0
            }
          : c
      )
    );

    setMessageInput('');
  };

  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [selectedConversation?.messages]);

  return (
    <div className="messages-page">
      <div className="messages-header">
        <h1>私信</h1>
        <button className="new-message-btn">
          <Send size={20} />
        </button>
      </div>

      <div className="side-panel">
        <div className="messages-search">
          <input type="text" placeholder="搜索私信" />
        </div>

        <div className="conversations-list">
          {conversations.map((conversation) => (
            <div
              key={conversation.id}
              className={`conversation-item ${conversation.id === selectedId ? 'active' : ''}`}
              onClick={() => setSelectedId(conversation.id)}
            >
              <img src={conversation.avatar} alt={conversation.user} className="conversation-avatar" />
              <div className="conversation-content">
                <div className="conversation-header">
                  <span className="conversation-user">{conversation.user}</span>
                  <span className="conversation-time">{conversation.time}</span>
                </div>
                <div className="conversation-message">
                  {conversation.lastMessage}
                  {conversation.unread > 0 && (
                    <span className="unread-badge">{conversation.unread}</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedConversation ? (
        <div className="chat-pane">
          <div className="chat-header">
            <div className="chat-user">
              <img src={selectedConversation.avatar} alt={selectedConversation.user} />
              <div>
                <div className="chat-name">{selectedConversation.user}</div>
                <div className="chat-status">正在对话 · {selectedConversation.time}</div>
              </div>
            </div>
            <button className="new-message-btn">
              <Send size={18} />
            </button>
          </div>

          <div className="chat-body" ref={chatBodyRef}>
            {selectedConversation.messages.map((msg) => (
              <div key={msg.id} className={`chat-message ${msg.from === 'me' ? 'outgoing' : 'incoming'}`}>
                <div className="message-bubble">{msg.text}</div>
                <span className="message-time">{msg.time}</span>
              </div>
            ))}
          </div>

          <div className="chat-input">
            <input
              type="text"
              placeholder="回复消息..."
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleSend();
                }
              }}
            />
            <button className="send-btn" onClick={handleSend}>
              <Send size={18} />
            </button>
          </div>
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-icon">💬</div>
          <h2>选择一条私信</h2>
          <p>从现有对话中选择，或开始新对话</p>
        </div>
      )}
    </div>
  );
}

export default Messages;
