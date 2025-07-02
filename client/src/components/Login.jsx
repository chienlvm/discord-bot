import React from 'react';

const DISCORD_CLIENT_ID = import.meta.env.VITE_DISCORD_CLIENT_ID;
const REDIRECT_URI = import.meta.env.VITE_DISCORD_REDIRECT_URI;
const OAUTH_URL = `https://discord.com/oauth2/authorize?client_id=${DISCORD_CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=code&scope=identify%20guilds`;

function Login() {
  return (
    <div style={{ textAlign: 'center', marginTop: 100 }}>
      <h2>Đăng nhập bằng Discord để quản trị bot</h2>
      <a href={OAUTH_URL}>
        <button style={{ fontSize: 20, padding: '10px 30px', marginTop: 30 }}>Đăng nhập với Discord</button>
      </a>
    </div>
  );
}

export default Login; 