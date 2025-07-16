import React from 'react';
import EmailIcon from '@mui/icons-material/Email';
import FavoriteIcon from '@mui/icons-material/Favorite';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer style={{
      width: '100%',
      background: 'linear-gradient(90deg, #d70018 0%, #ff9800 100%)',
      color: '#fff',
      textAlign: 'center',
      padding: '32px 0 18px 0',
      marginTop: 48,
      fontWeight: 500,
      fontSize: 17,
      letterSpacing: 0.5,
      boxShadow: '0 -2px 16px rgba(215,0,24,0.10)',
      position: 'relative',
      zIndex: 10
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 16px' }}>
        <div style={{ marginBottom: 10, fontWeight: 700, fontSize: 18, letterSpacing: 1 }}>
          © {new Date().getFullYear()} TECHNOLOGY Shop. All rights reserved.
        </div>
        <div style={{ fontSize: 15, marginBottom: 8, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <EmailIcon style={{ verticalAlign: 'middle', color: '#fff', fontSize: 20, marginRight: 4 }} />
          <span>Liên hệ: </span>
          <Link href="mailto:hau99082005@gmail.com" style={{ color: '#fff', fontWeight: 700, textDecoration: 'none', fontSize: 15, letterSpacing: 0.5 }}>
            hau99082005@gmail.com
          </Link>
        </div>
        <div style={{ fontSize: 14, opacity: 0.92, marginBottom: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 6 }}>
          <FavoriteIcon style={{ color: '#fff', fontSize: 18, marginRight: 2 }} />
          Thiết kế cảm hứng từ <span style={{ fontWeight: 700, color: '#ffd600', marginLeft: 2 }}>Lê Văn Hậu</span>
        </div>
      </div>
    </footer>
  );
} 