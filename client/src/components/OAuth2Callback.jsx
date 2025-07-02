import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function OAuth2Callback() {
  const navigate = useNavigate();

  useEffect(() => {
    const url = new URL(window.location.href);
    const code = url.searchParams.get('code');
    console.log("code", code);
    if (!code) {
      navigate('/login');
      return;
    }
    async function exchangeCode() {
      try {
        const res = await axios.post('/api/auth/discord', { code });
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        navigate('/dashboard');
      } catch {
        alert('Đăng nhập thất bại!');
        navigate('/login');
      }
    }
    exchangeCode();
  }, [navigate]);

  return <div>Đang xác thực với Discord...</div>;
}

export default OAuth2Callback; 