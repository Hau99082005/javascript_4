"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { Dashboard, Inventory, Add, ListAlt, ShoppingCart, Assessment, People, Settings, BarChart, Category, LocalOffer, Star, TrendingUp } from "@mui/icons-material";
import { styled } from '@mui/system';
import { motion } from "framer-motion";
import Typography from "@mui/material/Typography";
// Dùng GridLegacy thay vì Grid để tránh lỗi prop 'item' với MUI v7
import { GridLegacy as Grid } from "@mui/material";
import { Card, Box } from "@mui/material";
import CardActionArea from "@mui/material/CardActionArea";
import ImageIcon from '@mui/icons-material/Image';

const pages = [
  { name: 'Dashboard', icon: <Dashboard fontSize="large" />, path: '/dashboard' },
  {name: 'Categories', icon: <Category fontSize="large"/>, path: '/dashboard/admin/all-category'},
  { name: 'Products', icon: <Inventory fontSize="large" />, path: '/products' },
  { name: 'Add Product', icon: <Add fontSize="large" />, path: '/add-product' },
  {name: 'Banner', icon: <ImageIcon fontSize="large"/>, path: '/banner'},
  { name: 'Inventory', icon: <ListAlt fontSize="large" />, path: '/inventory' },
  { name: 'Orders', icon: <ShoppingCart fontSize="large" />, path: '/orders' },
  { name: 'Reports', icon: <Assessment fontSize="large" />, path: '/reports' },
  { name: 'Customers', icon: <People fontSize="large" />, path: '/customers' },
  { name: 'Settings', icon: <Settings fontSize="large" />, path: '/settings' },
  { name: 'Analytics', icon: <BarChart fontSize="large" />, path: '/analytics' },
 
];

const categories = [
  { name: 'Categories', icon: <Category fontSize="large" />, color: '#ff9800' },
  { name: 'Offers', icon: <LocalOffer fontSize="large" />, color: '#4caf50' },
  { name: 'Featured', icon: <Star fontSize="large" />, color: '#fbc02d' },
  { name: 'Trending', icon: <TrendingUp fontSize="large" />, color: '#1976d2' },
];

const BannerBox = styled(Box)({
  position: 'relative',
  width: '100%',
  minHeight: '220px',
  backgroundImage: 'url("/images/img3.webp")',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  borderRadius: '18px',
  overflow: 'hidden',
  marginBottom: '2rem',
});
const BannerOverlay = styled(Box)({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: 'rgba(0,0,0,0.45)',
  zIndex: 1,
});
const BannerContent = styled(Box)({
  position: 'relative',
  zIndex: 2,
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#fff',
  padding: '2rem',
});

const BackgroundBox = styled(Box)({
  backgroundImage: 'url("/images/img3.webp")',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
  position: 'relative',
  padding: '4rem 2rem',
  minHeight: '100vh',
  color: '#fff',
  overflow: 'hidden',
});
const Overlay = styled(Box)({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0,0,0,0.6)',
  zIndex: 1,
});
const ContentBox = styled(Box)({
  position: 'relative',
  zIndex: 2,
});

export default function Analitic() {
  const router = useRouter();
  return (
    <BackgroundBox>
      <Overlay />
      <ContentBox>
        {/* Banner section */}
        <BannerBox>
          <BannerOverlay />
          <BannerContent>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 1, color: '#fff', letterSpacing: 1 }}>
              Welcome to Your Dashboard
            </Typography>
            <Typography variant="subtitle1" sx={{ color: '#fff', opacity: 0.85 }}>
              Manage your products, orders, analytics and more in one place.
            </Typography>
          </BannerContent>
        </BannerBox>
        {/* Quick Access section */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 'bold',
              mb: 4,
              background: 'linear-gradient(90deg, #ff8a00, #f55742)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textAlign: 'center',
            }}
          >
            Dashboard Quick Access
          </Typography>
          <Grid container spacing={4} justifyContent="center">
            {pages.map((page, index) => (
              <Grid item key={index} xs={12} sm={6} md={4} lg={3}>
                <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: index * 0.1, duration: 0.5 }}>
                  <Card
                    sx={{
                      minHeight: 200,
                      boxShadow: 5,
                      borderRadius: 2,
                      backgroundColor: '#23272f',
                      color: '#fff',
                      transition: 'transform 0.3s, background-color 0.3s',
                      '&:hover': {
                        transform: 'scale(1.05)',
                        backgroundColor: '#ff8a00',
                        color: '#fff',
                      },
                    }}
                  >
                    <CardActionArea sx={{ textAlign: "center", p: 3 }} onClick={() => router.push(page.path)}>
                      <Box sx={{ fontSize: 40, mb: 1, color: 'inherit', display: 'flex', justifyContent: 'center' }}>{page.icon}</Box>
                      <Typography variant="h5" component="div" sx={{ color: 'inherit', fontWeight: 600 }}>
                        {page.name}
                      </Typography>
                      <Typography variant="body2" color="inherit">
                        {`Go to ${page.path} section`}
                      </Typography>
                    </CardActionArea>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </motion.div>
        {/* Categories section */}
        <Box sx={{ mt: 6 }}>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 2, color: '#ff8a00', textAlign: 'center', letterSpacing: 1 }}>
            Categories
          </Typography>
          <Grid container spacing={3} justifyContent="center">
            {categories.map((cat, idx) => (
              
              <Grid item key={idx} xs={12} sm={6} md={3} lg={2}>
                <Card sx={{
                  background: cat.color,
                  color: '#fff',
                  borderRadius: 2,
                  boxShadow: 3,
                  textAlign: 'center',
                  p: 2,
                  '&:hover': {
                    boxShadow: 8,
                    transform: 'scale(1.07)',
                  },
                }}>
                  <Box sx={{ fontSize: 36, mb: 1, display: 'flex', justifyContent: 'center' }}>{cat.icon}</Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>{cat.name}</Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </ContentBox>
    </BackgroundBox>
  );
} 