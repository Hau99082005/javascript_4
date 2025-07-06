import React, { useState } from 'react';
import { Box, Card, CardContent, Avatar, Typography, TextField, IconButton, InputAdornment, Button, CircularProgress, Fade } from '@mui/material';
import SmartToy from '@mui/icons-material/SmartToy';
import SendIcon from '@mui/icons-material/Send';
import { runAi } from '@/ai/ai';

export default function AiAssistantBox() {
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setResponse("");
    try {
      const aiResponse = await runAi(query + " Hãy trả lời bằng tiếng Việt.");
      setResponse(aiResponse);
    } catch {
      setResponse("Có lỗi xảy ra khi gọi AI. Vui lòng thử lại!");
    } finally {
      setLoading(false);
      setQuery("");
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="60vh"
      sx={{
        background: "rgba(255,255,255,0.05)",
        backdropFilter: "blur(6px)",
      }}
    >
      <Card
        sx={{
          minWidth: { xs: "95vw", sm: 420 },
          maxWidth: 500,
          borderRadius: 5,
          boxShadow: 8,
          p: 2,
          background: "rgba(255,255,255,0.15)",
          backdropFilter: "blur(12px)",
        }}
      >
        <CardContent>
          <Box display="flex" flexDirection="column" alignItems="center" mb={2}>
            <Avatar sx={{ 
              bgcolor: "transparent", 
              width: 56, 
              height: 56, 
              mb: 1,
              background: 'linear-gradient(135deg, #ff3c00 0%, #ff9800 100%)',
            }}>
              <SmartToy fontSize="large" sx={{ color: 'white' }} />
            </Avatar>
            <Typography variant="h5" fontWeight="bold" color="text.primary" gutterBottom
            style={{ color: 'white', fontFamily: 'Lato', fontSize: '30px', fontWeight: 'bolder'}}>
              Trợ lý AI
            </Typography>
            <Typography variant="body2" color="text.secondary" textAlign="center" mb={2}
             style={{ color: 'white', fontFamily: 'Lato', fontSize: '18px', fontWeight: 'lighter'}}>
              Đặt câu hỏi về sản phẩm, dịch vụ, hoặc bất cứ điều gì bạn muốn!
            </Typography>
          </Box>
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Nhập câu hỏi của bạn..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              disabled={loading}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3,
                  bgcolor: "rgba(255,255,255,0.9)",
                  '&:hover': {
                    bgcolor: "rgba(255,255,255,1)",
                  },
                  '&.Mui-focused': {
                    bgcolor: "rgba(255,255,255,1)",
                  },
                },
                '& .MuiInputBase-input': {
                  color: '#333',
                  fontSize: '16px',
                },
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton 
                      type="submit" 
                      disabled={loading || !query.trim()}
                      sx={{
                        color: loading ? "rgba(0,0,0,0.3)" : "#ff3c00",
                        '&:hover': {
                          bgcolor: 'rgba(255,60,0,0.1)',
                        }
                      }}
                    >
                      <SendIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{
                mt: 2,
                borderRadius: 3,
                background: "linear-gradient(90deg, #ff3c00, #ff9800)",
                color: "#fff",
                fontWeight: "bold",
                fontSize: "1.1rem",
                boxShadow: 3,
                "&:hover": { 
                  background: "linear-gradient(90deg, #d32f2f, #ff3c00)",
                  transform: 'translateY(-2px)',
                  boxShadow: 6,
                },
                transition: 'all 0.3s ease',
              }}
              disabled={loading || !query.trim()}
              endIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
            >
              {loading ? "Đang xử lý..." : "Gửi câu hỏi cho AI"}
            </Button>
          </form>
          <Fade in={!!response}>
            <Box mt={3} p={2} borderRadius={3} bgcolor="rgba(255,255,255,0.1)" minHeight={60}>
              <Typography variant="subtitle1" color="white" fontWeight="bold" mb={1}>
                Phản hồi của AI:
              </Typography>
              <Typography variant="body1" color="white" sx={{ whiteSpace: "pre-wrap" }}>
                {response}
              </Typography>
            </Box>
          </Fade>
        </CardContent>
      </Card>
    </Box>
  );
} 