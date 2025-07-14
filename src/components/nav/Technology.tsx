import styled from "@emotion/styled";
import { Box } from "@mui/material";
import { keyframes } from "@mui/system";

// Gradient động cho chữ
const scan = keyframes`
  0% { background-position: 0% 50%; }
  100% { background-position: 100% 50%; }
`;

const wave = keyframes`
  0%, 100% { transform: translateY(0) scale(1); }
  30% { transform: translateY(-6px) scale(1.05); }
  60% { transform: translateY(0) scale(1); }
`;

const techFloat = keyframes`
  0% { left: 0%; transform: translateY(0) scale(1) rotate(0deg);}
  25% { left: 25%; transform: translateY(-10px) scale(1.1) rotate(90deg);}
  50% { left: 50%; transform: translateY(0) scale(1) rotate(180deg);}
  75% { left: 75%; transform: translateY(-10px) scale(1.1) rotate(270deg);}
  100% { left: 100%; transform: translateY(0) scale(1) rotate(360deg);}
`;

const pulseGlow = keyframes`
  0%, 100% { filter: drop-shadow(0 0 8px #00eaff) drop-shadow(0 0 12px #fff700); }
  50% { filter: drop-shadow(0 0 20px #ff9800) drop-shadow(0 0 25px #00eaff); }
`;

const StyledChar = styled("span")<{ index: number }>(({ index }) => ({
  display: "inline-block",
  fontSize: "2.2rem",
  fontWeight: 900,
  letterSpacing: "2px",
  textTransform: "uppercase",
  background: "linear-gradient(270deg, #00eaff, #fff700, #ff9800, #fff, #00eaff)",
  backgroundSize: "400% 400%",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  textShadow: "0 2px 8px rgba(0,0,0,0.10)",
  animation: `${wave} 1.4s ease-in-out infinite ${index * 0.1}s, ${scan} 6s linear infinite`,
  transition: "transform 0.2s, text-shadow 0.3s",
  cursor: "pointer",
  ":hover": {
    background: "linear-gradient(90deg, #1976d2, #00bcd4, #fff700)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    textShadow: "0 2px 6px #1976d2, 0 0 10px #00bcd4",
    transform: "scale(1.15)",
  },
}));

const TechFloat = styled("span")({
  position: "absolute",
  top: "0.2rem",
  left: 0,
  fontSize: "2.5rem",
  zIndex: 2,
  animation: `${techFloat} 5s linear infinite, ${pulseGlow} 3s ease-in-out infinite`,
  pointerEvents: "none",
});

// SVG biểu tượng công nghệ hiện đại
const TechSVG = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
    <defs>
      {/* Gradient xanh công nghệ */}
      <linearGradient id="techBlue" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#00eaff" />
        <stop offset="50%" stopColor="#1976d2" />
        <stop offset="100%" stopColor="#0d47a1" />
      </linearGradient>
      
      {/* Gradient vàng năng lượng */}
      <linearGradient id="techGold" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#fff700" />
        <stop offset="50%" stopColor="#ff9800" />
        <stop offset="100%" stopColor="#e65100" />
      </linearGradient>
      
      {/* Gradient tím futuristic */}
      <linearGradient id="techPurple" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#9c27b0" />
        <stop offset="50%" stopColor="#673ab7" />
        <stop offset="100%" stopColor="#3f51b5" />
      </linearGradient>
      
      {/* Bộ lọc ánh sáng */}
      <filter id="glow">
        <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
        <feMerge> 
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>
    
    <g filter="url(#glow)">
      {/* Chip trung tâm */}
      <rect x="14" y="14" width="12" height="12" rx="2" fill="url(#techBlue)" stroke="#00eaff" strokeWidth="1"/>
      
      {/* Mạch điện tử trên chip */}
      <rect x="16" y="16" width="2" height="2" fill="#fff700"/>
      <rect x="19" y="16" width="2" height="2" fill="#fff700"/>
      <rect x="22" y="16" width="2" height="2" fill="#fff700"/>
      <rect x="16" y="19" width="2" height="2" fill="#fff700"/>
      <rect x="19" y="19" width="2" height="2" fill="#fff700"/>
      <rect x="22" y="19" width="2" height="2" fill="#fff700"/>
      <rect x="16" y="22" width="2" height="2" fill="#fff700"/>
      <rect x="19" y="22" width="2" height="2" fill="#fff700"/>
      <rect x="22" y="22" width="2" height="2" fill="#fff700"/>
      
      {/* Các chân chip */}
      <rect x="10" y="17" width="4" height="1" fill="url(#techGold)"/>
      <rect x="10" y="20" width="4" height="1" fill="url(#techGold)"/>
      <rect x="10" y="23" width="4" height="1" fill="url(#techGold)"/>
      <rect x="26" y="17" width="4" height="1" fill="url(#techGold)"/>
      <rect x="26" y="20" width="4" height="1" fill="url(#techGold)"/>
      <rect x="26" y="23" width="4" height="1" fill="url(#techGold)"/>
      <rect x="17" y="10" width="1" height="4" fill="url(#techGold)"/>
      <rect x="20" y="10" width="1" height="4" fill="url(#techGold)"/>
      <rect x="23" y="10" width="1" height="4" fill="url(#techGold)"/>
      <rect x="17" y="26" width="1" height="4" fill="url(#techGold)"/>
      <rect x="20" y="26" width="1" height="4" fill="url(#techGold)"/>
      <rect x="23" y="26" width="1" height="4" fill="url(#techGold)"/>
      
      {/* Mạch điện tử xung quanh */}
      <path d="M10 17 L6 17 L6 13 L10 13" stroke="url(#techBlue)" strokeWidth="1.5" fill="none"/>
      <path d="M10 20 L4 20 L4 16 L8 16" stroke="url(#techBlue)" strokeWidth="1.5" fill="none"/>
      <path d="M10 23 L2 23 L2 19 L6 19" stroke="url(#techBlue)" strokeWidth="1.5" fill="none"/>
      
      <path d="M30 17 L34 17 L34 13 L30 13" stroke="url(#techBlue)" strokeWidth="1.5" fill="none"/>
      <path d="M30 20 L36 20 L36 16 L32 16" stroke="url(#techBlue)" strokeWidth="1.5" fill="none"/>
      <path d="M30 23 L38 23 L38 19 L34 19" stroke="url(#techBlue)" strokeWidth="1.5" fill="none"/>
      
      {/* Các node kết nối */}
      <circle cx="6" cy="13" r="1.5" fill="url(#techPurple)"/>
      <circle cx="4" cy="16" r="1.5" fill="url(#techPurple)"/>
      <circle cx="2" cy="19" r="1.5" fill="url(#techPurple)"/>
      <circle cx="34" cy="13" r="1.5" fill="url(#techPurple)"/>
      <circle cx="36" cy="16" r="1.5" fill="url(#techPurple)"/>
      <circle cx="38" cy="19" r="1.5" fill="url(#techPurple)"/>
      
      {/* Sóng wifi/signal */}
      <path d="M20 8 Q16 6 12 8" stroke="#00eaff" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      <path d="M20 6 Q14 3 8 6" stroke="#00eaff" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      <path d="M20 4 Q12 0 4 4" stroke="#00eaff" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      
      <path d="M20 32 Q24 34 28 32" stroke="#00eaff" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      <path d="M20 34 Q26 37 32 34" stroke="#00eaff" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      <path d="M20 36 Q28 40 36 36" stroke="#00eaff" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      
      {/* Các điểm năng lượng */}
      <circle cx="8" cy="8" r="1" fill="#fff700"/>
      <circle cx="12" cy="6" r="1" fill="#fff700"/>
      <circle cx="16" cy="4" r="1" fill="#fff700"/>
      <circle cx="32" cy="32" r="1" fill="#fff700"/>
      <circle cx="28" cy="34" r="1" fill="#fff700"/>
      <circle cx="24" cy="36" r="1" fill="#fff700"/>
      
      {/* Hiệu ứng ánh sáng xung quanh */}
      <circle cx="20" cy="20" r="15" fill="none" stroke="#00eaff" strokeWidth="0.3" opacity="0.3"/>
      <circle cx="20" cy="20" r="18" fill="none" stroke="#fff700" strokeWidth="0.3" opacity="0.2"/>
      <circle cx="20" cy="20" r="21" fill="none" stroke="#ff9800" strokeWidth="0.3" opacity="0.1"/>
      
      {/* Dấu hiệu công nghệ */}
      <text x="20" y="22" textAnchor="middle" fill="#ffffff" fontSize="6" fontWeight="bold">T</text>
    </g>
  </svg>
);

export default function Technology() {
  const logoText = "TECHNOLOGY";
  return (
    <Box position="relative" display="flex" alignItems="center" gap={1} mb={2} style={{height: "3.5rem"}}>
      <TechFloat>
        <TechSVG />
      </TechFloat>
      <span>
        {logoText.split("").map((char, index) => (
          <StyledChar key={index} index={index}>
            {char}
          </StyledChar>
        ))}
      </span>
    </Box>
  );
}