import React from 'react';

function Navbar() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };
  return (
    <nav style={{ background: '#5865F2', color: 'white', padding: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div style={{ fontWeight: 'bold', fontSize: 22 }}>Discord Bot Admin</div>
      <div>
        {user.username && <span style={{ marginRight: 20 }}>👤 {user.username}</span>}
        <button onClick={handleLogout} style={{ background: 'white', color: '#5865F2', border: 'none', padding: '6px 18px', borderRadius: 5, fontWeight: 'bold' }}>Logout</button>
      </div>
    </nav>
  );
}

export default Navbar; 