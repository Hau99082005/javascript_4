import styled from "@emotion/styled";
import { Box } from "@mui/material";
import { keyframes } from "@mui/system";

// Sóng chữ
const wave = keyframes`
  0%, 100% { transform: translateY(0) scale(1); }
  30% { transform: translateY(-6px) scale(1.05); }
  60% { transform: translateY(0) scale(1); }
`;

// Quét gradient
const scan = keyframes`
  0% { background-position: 0% 50%; }
  100% { background-position: 100% 50%; }
`;

// Hiệu ứng lấp lánh + rung cho ⚡
const spark = keyframes`
  0%, 100% { transform: rotate(0deg) scale(1); text-shadow: 0 0 6px #FFD700; }
  25% { transform: rotate(-6deg) scale(1.1); text-shadow: 0 0 12px #FFA500; }
  50% { transform: rotate(6deg) scale(1.05); text-shadow: 0 0 8px #FF8C00; }
  75% { transform: rotate(-3deg) scale(1.1); text-shadow: 0 0 10px #FFA500; }
`;

const StyledChar = styled("span")<{
  index: number;
}>(({ index }) => ({
  display: "inline-block",
  fontSize: "2.2rem",
  fontWeight: 800,
  letterSpacing: "2px",
  textTransform: "uppercase",
  background: "linear-gradient(90deg, #FF8C42, #D72638)",
  backgroundSize: "300% 300%",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  textShadow: "0 1px 4px rgba(215, 38, 56, 0.4)",
  animation: `${wave} 1.4s ease-in-out infinite ${index * 0.1}s, ${scan} 5s linear infinite`,
  transition: "transform 0.2s, text-shadow 0.3s",
  cursor: "pointer",
  ":hover": {
    background: "linear-gradient(90deg, #1976d2, #00bcd4)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    textShadow: "0 2px 6px #1976d2, 0 0 10px #00bcd4",
    transform: "scale(1.15)",
  },
}));

const SparkIcon = styled("span")({
  fontSize: "2.2rem",
  fontWeight: 900,
  color: "#FFA500",
  textShadow: "0 0 6px #FFD700",
  animation: `${spark} 2s infinite ease-in-out`,
  display: "inline-block",
});

export default function Technology() {
  const logoText = "Technology";
  return (
    <Box display="flex" alignItems="center" gap={1} mb={2}>
      <SparkIcon>⚡</SparkIcon>
      {logoText.split("").map((char, index) => (
        <StyledChar key={index} index={index}>
          {char}
        </StyledChar>
      ))}
    </Box>
  );
}
