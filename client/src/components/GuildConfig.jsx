import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function GuildConfig() {
  const { guildId } = useParams();
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchConfig() {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`/api/config/${guildId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setConfig(res.data);
      } catch (err) {
        setError('Không lấy được config.');
      }
      setLoading(false);
    }
    fetchConfig();
  }, [guildId]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.startsWith('modules.')) {
      setConfig({ ...config, modules: { ...config.modules, [name.split('.')[1]]: checked } });
    } else if (name.startsWith('roleRewards.')) {
      setConfig({ ...config, roleRewards: { ...config.roleRewards, [name.split('.')[1]]: value } });
    } else {
      setConfig({ ...config, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`/api/config/${guildId}`, config, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Đã lưu cấu hình!');
    } catch {
      setError('Lưu thất bại.');
    }
    setSaving(false);
  };

  if (loading) return <div>Đang tải config...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;
  if (!config) return null;

  return (
    <div style={{ maxWidth: 600, margin: '40px auto' }}>
      <h2>Cấu hình server</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 18 }}>
          <label>Twitter feed (@username): </label>
          <input name="twitterFeed" value={config.twitterFeed || ''} onChange={handleChange} style={{ width: 250 }} />
        </div>
        <div style={{ marginBottom: 18 }}>
          <label>Channel feed (ID): </label>
          <input name="feedChannel" value={config.feedChannel || ''} onChange={handleChange} style={{ width: 250 }} />
        </div>
        <div style={{ marginBottom: 18 }}>
          <label>Role reward (level → roleId):</label>
          {[5, 10, 20].map(lv => (
            <div key={lv} style={{ marginLeft: 20 }}>
              Level {lv}: <input name={`roleRewards.${lv}`} value={config.roleRewards?.[lv] || ''} onChange={handleChange} style={{ width: 180 }} />
            </div>
          ))}
        </div>
        <div style={{ marginBottom: 18 }}>
          <label>Bật/tắt module:</label>
          {['antiSpam', 'antiLink', 'autoWarn', 'autoMute'].map(mod => (
            <div key={mod} style={{ marginLeft: 20 }}>
              <input type="checkbox" name={`modules.${mod}`} checked={!!config.modules?.[mod]} onChange={handleChange} /> {mod}
            </div>
          ))}
        </div>
        <button type="submit" disabled={saving} style={{ fontSize: 18, padding: '8px 30px' }}>Lưu</button>
      </form>
    </div>
  );
}

export default GuildConfig; 