"use client";
import * as React from 'react';
import { Box, Typography, Button, Card, CardContent, Fab, Modal, Fade, IconButton, Stack, Switch } from '@mui/material';
import { styled } from '@mui/system';
import { useState } from 'react';
import { Dashboard, Inventory, Add, Assessment, ShoppingCart, People, Settings, BarChart, Category, PhoneIphone, LaptopMac, Headphones, Tv, Watch, TabletMac, CameraAlt, Speaker, Memory, Storefront, Close, SmartToy } from '@mui/icons-material';
import Technology from '@/components/nav/Technology';
import AiAssistantBox from '@/components/ai/AiAssistantBox';
import { useRouter } from 'next/navigation';

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
];

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

export default function HomeClient() {
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const route = useRouter();
  const [isAnnual, setIsAnnual] = useState(false);

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
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 2 }}>
            <Typography variant='h3' sx={{ color: '#fff', textAlign: 'center', fontWeight: 'bold', textShadow: '2px 2px 5px rgba(0, 0, 0,0.5)', letterSpacing: 2, mb: 1 }}>
              <Technology/>
            </Typography>
          </Box>
          <Typography variant='h2' sx={{ fontWeight: 'bold', mb: 2, background: 'linear-gradient(90deg, #ff3c00, #ff9800)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', textShadow: '2px 2px 5px rgba(0, 0, 0, 0.5)', display: 'inline-block', fontSize: { xs: '2rem', md: '3rem' } }}>
            Chào mừng bạn đến với thế giới ĐIỆN TỬ
          </Typography>
          <Typography variant='h6' color="inherit" sx={{ mb: 3, lineHeight: 2, color: '#d1d1d1', textAlign: 'center', maxWidth: 600 }}>
            Quản lý sản phẩm, hàng tồn kho và đơn hàng của bạn một cách hiệu quả với bảng điều khiển trực quan của chúng tôi.
          </Typography>
          <Button onClick={() => route.push('/login')} variant="contained" sx={{ mb: 5, background: 'linear-gradient(90deg, #ff9800, #ff3c00)', color: '#fff', boxShadow: '0px 5px 10px rgba(66, 165,245, 0.3)', borderRadius: '10px', padding: '10px 30px', fontWeight: 'bolder', fontSize: '1.2rem', transition: 'transform 0.5s, box-shadow 0.5s', '&:hover': { transform: 'scale(1.05)', boxShadow: '0px 5px 10px rgba(66, 165,245,0.5)' } }}>
            MUA NGAY
          </Button>
          <Box sx={{ mb: 5 }}>
            <Typography variant='h5' sx={{ mb: 2, fontWeight: 'bold', letterSpacing: '5px', padding: '5px 10px', borderRadius: '5px', color: '#fff', display: 'inline-block', textShadow: '1px 5px 10px rgba(0,0,0,0.5)' }}>
              Chọn gói đăng ký của bạn
            </Typography>
            <Stack direction="row" alignItems="center" justifyContent="center" spacing={1}>
              <Box sx={{ display: 'inline-block', padding: '5px 10px', borderRadius: '5px', background: 'linear-gradient(100deg, #4caf50, #2e7d32)', color: '$fff', fontSize: '16px', fontWeight: 'bold', textAlign: 'center', textTransform: 'uppercase', boxShadow: '0 5px 10px rgba(0,0,0,0.25)', transition: 'background 0.5s ease', '&:hover': { background: 'linear-gradient(100deg, #66bb6a, #388e3c)', boxShadow: '0px 7px 14px rgba(0,0,0,0.25)' } }}>
                HÀNG THÁNG
              </Box>
              <Switch checked={isAnnual} onChange={() => setIsAnnual(!isAnnual)} inputProps={{'aria-label':'Chuyển đổi phương thức đăng ký gói'}}/>
              <Box sx={{ display: 'inline-block', padding: '5px 10px', borderRadius: '5px', background: 'linear-gradient(100deg, #4caf50, #2e7d32)', color: '#fff', fontSize: '18px', fontWeight: 'bold', textAlign: 'center', textTransform: 'uppercase', boxShadow: '0px 5px 10px rgba(0,0,0,0.25)', transition: 'background 0.5s ease', '&:hover': { background: 'linear-gradient(100deg, #66bb6a, #388e3c)', boxShadow: '0px 5px 10px rgba(0,0,0,0.25)' } }}>
                <Typography variant='body1'>HÀNG NĂM</Typography>
              </Box>
            </Stack>
            <Typography variant='h4' color='primary' sx={{ mt: 2, fontWeight: 'bold' }}>
              <Box sx={{ display: "inline-block", padding: "5px 10px", borderRadius: '10px', background: 'linear-gradient(90deg, #ff8a00, #e52e71)', color: '#fff', fontSize: '16px', fontWeight: 'bold', textAlign: 'center', boxShadow: '0px 5px 10px rgba(0, 0,0,0.25)', transition: 'background 0.5 ease, transform 0.3s ease', '&:hover': { background: 'linear-gradient(90deg, #e52e71, #ff8a00)', transform: 'scale(1)', boxShadow: '0px 5px 10px rgba(0,0,0,0.25)' } }}>
                <Typography variant='body1'>
                  {isAnnual ? "199.000 đ / năm" : "99.000 đ / tháng"}
                </Typography>
              </Box>
            </Typography>
          </Box>
          <Box sx={{ mb: 5, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography variant='h4' sx={{ color: '#fff', textAlign: 'center', fontWeight: 'bold', mb: 4, textShadow: '2px 2px 5px rgba(0, 0, 0, 0.5)' }}>
              Sản phẩm Điện tử
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(3, 1fr)', md: 'repeat(5, 1fr)' }, gap: 3, width: '100%', maxWidth: 1200 }}>
              {electronicPages.map((page, index) => (
                <Card key={index} sx={{ minWidth: 180, maxWidth: 220, mb: 3, minHeight: 120, boxShadow: 5, borderRadius: 3, background: 'linear-gradient(135deg, #232526 0%, #414345 100%)', color: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', transition: 'all 0.3s', '&:hover': { background: 'linear-gradient(135deg, #ff3c00 0%, #ff9800 100%)', color: '#fff', transform: 'scale(1.05)' } }}>
                  <CardContent sx={{ textAlign: 'center', p: 3 }}>
                    <Box sx={{ fontSize: 48, mb: 1 }}>{page.icon}</Box>
                    <Typography variant='h6' sx={{ fontWeight: 700, mb: 1 }}>{page.name}</Typography>
                    <Typography variant='body2'>Đi tới {page.name}</Typography>
                  </CardContent>
                </Card>
              ))}
            </Box>
          </Box>
          <Box sx={{ mb: 5, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography variant='h4' sx={{ color: '#fff', textAlign: 'center', fontWeight: 'bold', mb: 4, textShadow: '2px 2px 5px rgba(0, 0, 0, 0.5)' }}>
              Bảng điều khiển
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(3, 1fr)', md: 'repeat(5, 1fr)' }, gap: 3, width: '100%', maxWidth: 1200 }}>
              {pages.map((page, index) => (
                <Card key={index} sx={{ minWidth: 220, maxWidth: 260, mb: 3, minHeight: 120, boxShadow: 5, borderRadius: 3, background: 'linear-gradient(135deg, #232526 0%, #414345 100%)', color: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', transition: 'all 0.3s', '&:hover': { background: 'linear-gradient(135deg, #ff3c00 0%, #ff9800 100%)', color: '#fff', transform: 'scale(1.05)' } }}>
                  <CardContent sx={{ textAlign: 'center', p: 3 }}>
                    <Box sx={{ fontSize: 48, mb: 1 }}>{page.icon}</Box>
                    <Typography variant='h6' sx={{ fontWeight: 700, mb: 1 }}>{page.name}</Typography>
                    <Typography variant='body2'>Đi tới {page.name}</Typography>
                  </CardContent>
                </Card>
              ))}
            </Box>
          </Box>
        </ContentBox>
      </BackgroundBox>
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
      <Modal
        open={aiModalOpen}
        onClose={() => setAiModalOpen(false)}
        closeAfterTransition
        sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        <Fade in={aiModalOpen}>
          <Box sx={{ position: "relative" }}>
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
            <AiAssistantBox />
          </Box>
        </Fade>
      </Modal>
    </>
  );
} 