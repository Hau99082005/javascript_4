'use client';
import * as React from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { Box, Typography, Button, Card, CardContent, TextField, CircularProgress, Fade, Avatar, InputAdornment, IconButton, Fab, Modal, Stack, Switch } from '@mui/material';
import { styled } from '@mui/system';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { Dashboard, Inventory, Add,
  Assessment, ShoppingCart, People, Settings, BarChart,
  Category, PhoneIphone, LaptopMac, Headphones, Tv, Watch, TabletMac, CameraAlt, Speaker, Memory, Storefront, Close, SmartToy } from '@mui/icons-material';
import Technology from '@/components/nav/Technology';
import { runAi } from "@/ai/ai";
import SendIcon from '@mui/icons-material/Send';

const pages = [
    {name: 'Dashboard', icon: <Dashboard/>, path: '/dashboard'},
    {name: 'Products', icon: <Inventory/>, path: '/products'},
    {name: 'categories', icon: <Category/>, path: '/category'},
    {name: 'Add Products', icon: <Add/>, path: '/add-products'},
    {name: 'Inventory', icon: <Inventory/>, path: '/inventory'},
    {name: 'Orders', icon: <ShoppingCart/>, path: '/orders'},
    {name: 'Reports', icon: <Assessment/>, path: '/reports'},
    {name: 'Customers', icon: <People/>, path: '/customers'},
    {name: 'Settings', icon: <Settings/>, path: '/settings'},
    {name: 'Analytics', icon: <BarChart/>, path: '/analytics'},
  ]
  
  const BackgroundBox = styled(Box)({
    backgroundImage: 'url("/images/banner.webp")',
    backgroundSize: 'cover',
    backgroundPosition: 'center center',
    backgroundRepeat: 'no-repeat',
    position: 'relative',
    padding: '10px 15px',
    textAlign: 'center',
    color: '#fff',
    overflow: 'hidden',
    minHeight: '100vh',
    width: '100%',
  });

  const Overlay = styled(Box)({
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(120deg, rgba(0,0,0,0.7) 60%, rgba(0,0,0,0.2) 100%)',
    backdropFilter: 'blur(2px)',
    zIndex: 1,
  });

  const ContentBox = styled(Box)({
    position: 'relative',
    zIndex: 2,
  });

const electronicPages = [
  { name: 'Điện thoại', icon: <PhoneIphone fontSize="large" />, path: '/products/phones' },
  { name: 'Laptop', icon: <LaptopMac fontSize="large" />, path: '/products/laptops' },
  { name: 'Phụ kiện', icon: <Headphones fontSize="large" />, path: '/products/accessories' },
  { name: 'Tivi', icon: <Tv fontSize="large" />, path: '/products/tv' },
  { name: 'Đồng hồ', icon: <Watch fontSize="large" />, path: '/products/watches' },
  { name: 'Tablet', icon: <TabletMac fontSize="large" />, path: '/products/tablets' },
  { name: 'Camera', icon: <CameraAlt fontSize="large" />, path: '/products/cameras' },
  { name: 'Loa', icon: <Speaker fontSize="large" />, path: '/products/speakers' },
  { name: 'Linh kiện', icon: <Memory fontSize="large" />, path: '/products/components' },
  { name: 'Cửa hàng', icon: <Storefront fontSize="large" />, path: '/stores' },
];

const themes = {
  light: {
    bg: 'url("/images/banner.webp")',
    overlay: 'rgba(255,255,255,0.7)',
    color: '#222',
    card: '#fff',
    accent: '#ff3c00',
    button: 'linear-gradient(90deg, #ff9800, #ff3c00)',
    buttonText: '#fff',
  },
  dark: {
    bg: 'url("/images/banner.webp")',
    overlay: 'rgba(0,0,0,0.7)',
    color: '#fff',
    card: '#181818',
    accent: '#ff3c00',
    button: 'linear-gradient(90deg, #23272f, #ff3c00)',
    buttonText: '#fff',
  },
  fpt: {
    bg: 'url("/images/banner.webp")',
    overlay: 'rgba(0,0,0,0.7)',
    color: '#fff',
    card: '#1a1a1a',
    accent: '#ff3c00',
    button: 'linear-gradient(90deg, #ff3c00, #ff9800)',
    buttonText: '#fff',
  },
};

export default function Home() {
  const searchParams = useSearchParams();
  const route = useRouter();
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [aiModalOpen, setAiModalOpen] = React.useState(false);
  const currentTheme = themes['fpt'];
  const [isAnnual, setIsAnnual] = useState(false);

  React.useEffect(() => {
    if (searchParams.get('error') === 'unauthorized') {
      setSnackbarOpen(true);
    }
  }, [searchParams]);

  return (
    <>
      <BackgroundBox minHeight="100vh" width="100%" display="flex" alignItems="center" justifyContent="center">
        <Overlay />
        <ContentBox sx={{
          width: '100%',
          maxWidth: 1100,
          px: { xs: 2, md: 6 },
          py: { xs: 4, md: 8 },
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <motion.div initial={{ opacity: 0, y: -50}}
            animate={{ opacity: 1, y: 0}} transition={{duration: 1}}>
            <Box sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              mb: 2,
            }}>
              <Typography variant='h3' sx={{
                color: '#fff',
                textAlign: 'center',
                fontWeight: 'bold',
                textShadow: '2px 2px 5px rgba(0, 0, 0,0.5)',
                letterSpacing: 2,
                mb: 1,
              }}>
                <Technology/>
              </Typography>
            </Box>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: -20}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 1}}>
            <Typography variant='h2' 
              sx={{ fontWeight: 'bold', mb: 2, 
                background: 'linear-gradient(90deg, #ff3c00, #ff9800)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textShadow: '2px 2px 5px rgba(0, 0, 0, 0.5)',
                display: 'inline-block',
                fontSize: { xs: '2rem', md: '3rem' },
              }}>
              Chào mừng bạn đến với thế giới ĐIỆN TỬ
            </Typography>
          </motion.div>
          <motion.div initial={{ opacity: 1}} animate={{ opacity: 1}}
            transition={{delay: 0.5, duration: 1}}>
            <Typography variant='h6' color="inherit" sx={{
              mb: 3, lineHeight: 2, color: '#d1d1d1',
              textAlign: 'center',
              maxWidth: 600,
            }}>
              Quản lý sản phẩm, hàng tồn kho và đơn hàng của bạn một cách hiệu quả với bảng điều khiển trực quan của chúng tôi.
            </Typography>
          </motion.div>
          <motion.div initial={{ opacity: 0, scale: 0.9}}
            animate={{ opacity: 1, scale: 1}} transition={{ delay: 1, duration: 0.5}}>
            <Button variant="contained" onClick={()=>route.push('/login')}
              sx={{mb: 5, 
                background: currentTheme.button,
                color: currentTheme.buttonText,
                boxShadow: '0px 5px 10px rgba(66, 165,245, 0.3)',
                borderRadius: '10px',
                padding: '10px 30px',
                fontWeight: 'bolder',
                fontSize: '1.2rem',
                transition: 'transform 0.5s, box-shadow 0.5s',
                '&:hover': {
                  transform: 'scale(1.05)',
                  boxShadow: '0px 5px 10px rgba(66, 165,245,0.5)',
                },
              }}>
              Mua Ngay
            </Button>
          </motion.div>
          <Box sx={{ mb: 5}}>
           <motion.div initial={{ opacity: 0, y: 10}}
           animate={{ opacity: 1, y: 0}} transition={{ duration: 0.8}}>
           <Typography variant='h5' sx={{ mb: 2, fontWeight: 'bold', letterSpacing: '5px',
            padding: '5px 10px', borderRadius: '5px', color: '#fff', display: 'inline-block',
            textShadow: '1px 5px 10px rgba(0,0,0,0.5)',
           }}>
           Chọn gói đăng ký của bạn
           </Typography>
           </motion.div>
           <Stack direction="row" alignItems="center"
           justifyContent="center" spacing={1}>
           <motion.div initial={{opacity: 0, scale: 0.8}}
           animate={{ opacity: 1, scale: 1}} transition={{ duration: 0.8}}>
            <Box sx={{ display: 'inline-block', padding: '5px 10px', borderRadius: '5px',
              background: 'linear-gradient(100deg, #4caf50, #2e7d32)', color: '$fff', fontSize: '16px',
              fontWeight: 'bold', textAlign: 'center', textTransform: 'uppercase', boxShadow: '0 5px 10px rgba(0,0,0,0.25)',
              transition: 'background 0.5s ease', 
              '&:hover': {
                background: 'linear-gradient(100deg, #66bb6a, #388e3c)',
                boxShadow: '0px 7px 14px rgba(0,0,0,0.25)',
              }
            }}>
            Hàng Tháng 
            </Box>
           </motion.div>
           <Switch
           checked={isAnnual} onChange={() =>setIsAnnual(!isAnnual)}
           inputProps={{'aria-label':'Chuyển đổi phương thức đăng ký gói'}}/>
           <motion.div initial={{ opacity: 0, scale: 0.9}}
           animate={{ opacity: 1, scale: 1}} transition={{ duration: 0.8}}>
           <Box sx={{ display: 'inline-block', padding: '5px 10px',  borderRadius: '5px', 
            background: 'linear-gradient(100deg, #4caf50, #2e7d32)', color: '#fff', fontSize: '18px',
            fontWeight: 'bold', textAlign: 'center', textTransform: 'uppercase',
            boxShadow: '0px 5px 10px rgba(0,0,0,0.25)', transition: 'background 0.5s ease',
            '&:hover': {
              background: 'linear-gradient(100deg, #66bb6a, #388e3c)',
              boxShadow: '0px 5px 10px rgba(0,0,0,0.25)',
            }
           }}>
          <Typography variant='body1'>
           Hàng Năm
          </Typography>
           </Box>
           </motion.div>
           </Stack>
           <Typography variant='h4' color='primary' sx={{ mt: 2, fontWeight: 'bold'}}>
             <motion.div initial={{ opacity: 0, scale: 0.8}} 
             animate={{ opacity: 1, scale: 1}} transition={{duration: 0.8}}>
             <Box sx={{ display: "inline-block", padding: "5px 10px",
              borderRadius: '10px', background: 'linear-gradient(90deg, #ff8a00, #e52e71)',
              color: '#fff', fontSize: '16px',fontWeight: 'bold', textAlign: 'center',
              boxShadow: '0px 5px 10px rgba(0, 0,0,0.25)',  transition: 'background 0.5 ease, transform 0.3s ease',
              '&:hover': {
                background: 'linear-gradient(90deg, #e52e71, #ff8a00)',
                transform: 'scale(1)',
                boxShadow: '0px 5px 10px rgba(0,0,0,0.25)',
              }
             }}>
             <Typography variant='body1'>
             {isAnnual ? "199.000 đ / năm": "99.000 đ / tháng"}
             </Typography>
             </Box>
             </motion.div>
           </Typography>
          </Box>
          <Box sx={{ mb: 5, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            <motion.div initial={{ opacity: 0, y: 10}}
              animate={{ opacity: 1, y: 0}}
              transition={{duration: 0.5}}>
              <Typography variant='h4' sx={{
                color: '#fff',
                textAlign: 'center',
                fontWeight: 'bold',
                mb: 4,
                textShadow: '2px 2px 5px rgba(0, 0, 0, 0.5)',
              }}>
                Sản phẩm Điện tử
              </Typography>
            </motion.div>
            <Box sx={{
              display: 'grid',
              gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(3, 1fr)', md: 'repeat(5, 1fr)' },
              gap: 3,
              width: '100%',
              maxWidth: 1200,
            }}>
              {electronicPages.map((page, index) => (
                <motion.div key={index} initial={{ opacity: 0, scale: 0.8}}
                  animate={{ opacity: 1, scale: 1}}
                  transition={{ delay: index * 0.1, duration: 0.5}}>
                  <Card
                    sx={{
                      minWidth: 180,
                      maxWidth: 220,
                      mb: 3,
                      minHeight: 120,
                      boxShadow: 5,
                      borderRadius: 3,
                      background: 'linear-gradient(135deg, #232526 0%, #414345 100%)',
                      color: '#fff',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.3s',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #ff3c00 0%, #ff9800 100%)',
                        color: '#fff',
                        transform: 'scale(1.05)',
                      },
                    }}
                    onClick={() => route.push(page.path)}
                  >
                    <CardContent sx={{ textAlign: 'center', p: 3 }}>
                      <Box sx={{ fontSize: 48, mb: 1 }}>{page.icon}</Box>
                      <Typography variant='h6' sx={{ fontWeight: 700, mb: 1 }}>{page.name}</Typography>
                      <Typography variant='body2'>Đi tới {page.name}</Typography>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </Box>
          </Box>
          <Box sx={{ mb: 5, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            <motion.div initial={{ opacity: 0, y: 10}}
              animate={{ opacity: 1, y: 0}}
              transition={{duration: 0.5}}>
              <Typography variant='h4' sx={{
                color: '#fff',
                textAlign: 'center',
                fontWeight: 'bold',
                mb: 4,
                textShadow: '2px 2px 5px rgba(0, 0, 0, 0.5)',
              }}>
                Bảng điều khiển
              </Typography>
            </motion.div>
            <Box sx={{
              display: 'grid',
              gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(3, 1fr)', md: 'repeat(5, 1fr)' },
              gap: 3,
              width: '100%',
              maxWidth: 1200,
            }}>
              {pages.map((page, index) => (
                <motion.div key={index} initial={{ opacity: 0, scale: 0.8}}
                  animate={{ opacity: 1, scale: 1}}
                  transition={{ delay: index * 0.1, duration: 0.5}}>
                  <Card
                    key={index}
                    sx={{
                      minWidth: 220,
                      maxWidth: 260,
                      mb: 3,
                      minHeight: 120,
                      boxShadow: 5,
                      borderRadius: 3,
                      background: 'linear-gradient(135deg, #232526 0%, #414345 100%)',
                      color: '#fff',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.3s',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #ff3c00 0%, #ff9800 100%)',
                        color: '#fff',
                        transform: 'scale(1.05)',
                      },
                    }}
                    onClick={() => route.push(page.path)}
                  >
                    <CardContent sx={{ textAlign: 'center', p: 3 }}>
                      <Box sx={{ fontSize: 48, mb: 1 }}>{page.icon}</Box>
                      <Typography variant='h6' sx={{ fontWeight: 700, mb: 1 }}>{page.name}</Typography>
                      <Typography variant='body2'>Đi tới {page.name}</Typography>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </Box>
          </Box>
          <Snackbar open={snackbarOpen} autoHideDuration={4000} onClose={() => setSnackbarOpen(false)}>
            <Alert severity="error" onClose={() => setSnackbarOpen(false)}>
              Bạn không có quyền truy cập!
            </Alert>
          </Snackbar>
        </ContentBox>
      </BackgroundBox>

      {/* Nút AI nổi ở góc phải dưới */}
      <Fab
        color="error"
        aria-label="Trợ lý AI"
        sx={{
          position: "fixed",
          bottom: 32,
          right: 32,
          zIndex: 1300,
          boxShadow: 6,
          background: 'linear-gradient(135deg, #ff3c00 0%, #ff9800 100%)',
          '&:hover': {
            background: 'linear-gradient(135deg, #d32f2f 0%, #ff3c00 100%)',
            transform: 'scale(1.1)',
          },
          transition: 'all 0.3s ease',
        }}
        onClick={() => setAiModalOpen(true)}
      >
        <SmartToy fontSize="large" sx={{ color: 'white' }} />
      </Fab>

      {/* Modal chứa giao diện trợ lý AI */}
      <Modal
        open={aiModalOpen}
        onClose={() => setAiModalOpen(false)}
        closeAfterTransition
        sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        <Fade in={aiModalOpen}>
          <Box sx={{ position: "relative" }}>
            {/* Nút đóng */}
            <IconButton
              onClick={() => setAiModalOpen(false)}
              sx={{
                position: "absolute",
                top: 8,
                right: 8,
                zIndex: 10,
                bgcolor: "rgba(255,255,255,0.7)",
                "&:hover": { bgcolor: "rgba(255,255,255,1)" }
              }}
            >
              <Close />
            </IconButton>
            {/* Card trợ lý AI */}
            <AiAssistantBox />
          </Box>
        </Fade>
      </Modal>
    </>
  );
}

export function AiAssistantBox() {
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setResponse("");
    try {
      const aiResponse = await runAi(query);
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
