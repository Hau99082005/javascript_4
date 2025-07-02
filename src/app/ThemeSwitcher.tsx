"use client";
import React from "react";
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import NightlightIcon from '@mui/icons-material/Nightlight';
import ColorLensIcon from '@mui/icons-material/ColorLens';

export default function ThemeSwitcher({ onChange }: { onChange: (theme: string) => void }) {
  return (
    <div style={{ position: "fixed", top: 16, right: 16, zIndex: 100, display: 'flex', gap: 8 }}>
      <button onClick={() => onChange("theme-light")}
        style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: 6, padding: '6px 12px', cursor: 'pointer' }}
        title="Giao diện sáng"
      >
        <WbSunnyIcon fontSize="small" /> Light
      </button>
      <button onClick={() => onChange("theme-dark")}
        style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: 6, padding: '6px 12px', cursor: 'pointer' }}
        title="Giao diện tối"
      >
        <NightlightIcon fontSize="small" /> Dark
      </button>
      <button onClick={() => onChange("theme-custom")}
        style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'var(--secondary)', color: '#fff', border: 'none', borderRadius: 6, padding: '6px 12px', cursor: 'pointer' }}
        title="Giao diện tuỳ chỉnh"
      >
        <ColorLensIcon fontSize="small" /> Custom
      </button>
    </div>
  );
} 