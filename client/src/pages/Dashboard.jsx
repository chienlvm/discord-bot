import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const [guilds, setGuilds] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchGuilds() {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('/api/user/guilds', {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log("res.data", res.data);
        setGuilds(res.data);
      } catch {
        setGuilds([]);
      }
      setLoading(false);
    }
    fetchGuilds();
  }, []);

  if (loading) return <div>Đang tải danh sách server...</div>;
  if (!guilds.length) return <div>Bạn không quản lý server nào.</div>;

  return (
    <div style={{ maxWidth: 700, margin: '40px auto' }}>
      <h2>Chọn server để quản trị</h2>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {guilds.map(guild => (
          <li key={guild.id} style={{ margin: '18px 0', padding: 16, background: '#f5f5f5', borderRadius: 8, display: 'flex', alignItems: 'center', cursor: 'pointer' }}
              onClick={() => navigate(`/guild/${guild.id}`)}>
            <img src={guild.icon ? `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png` : '/discord-icon.png'} alt="icon" style={{ width: 48, height: 48, borderRadius: 8, marginRight: 18 }} />
            <span style={{ fontSize: 20 }}>{guild.name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Dashboard; 