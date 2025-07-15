"use client";
import * as React from 'react';
import { Box, Fab, Modal, Fade, IconButton } from '@mui/material';
import { useState } from 'react';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PeopleIcon from '@mui/icons-material/People';
import PhoneIphoneIcon from '@mui/icons-material/PhoneIphone';
import LaptopMacIcon from '@mui/icons-material/LaptopMac';
import HeadphonesIcon from '@mui/icons-material/Headphones';
import TvIcon from '@mui/icons-material/Tv';
import WatchIcon from '@mui/icons-material/Watch';
import TabletMacIcon from '@mui/icons-material/TabletMac';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import SpeakerIcon from '@mui/icons-material/Speaker';
import MemoryIcon from '@mui/icons-material/Memory';
import StorefrontIcon from '@mui/icons-material/Storefront';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import Technology from '@/components/nav/Technology';
import AiAssistantBox from '@/components/ai/AiAssistantBox';
import { useRouter } from 'next/navigation';
import styles from './HomeClient.module.css';
import MenuIcon from '@mui/icons-material/Menu';


const electronicPages = [
  { name: 'Điện thoại', icon: <PhoneIphoneIcon fontSize="large" />, path: '/products/phones' },
  { name: 'Laptop', icon: <LaptopMacIcon fontSize="large" />, path: '/products/laptops' },
  { name: 'Phụ kiện', icon: <HeadphonesIcon fontSize="large" />, path: '/products/accessories' },
  { name: 'Tivi', icon: <TvIcon fontSize="large" />, path: '/products/tv' },
  { name: 'Đồng hồ', icon: <WatchIcon fontSize="large" />, path: '/products/watches' },
  { name: 'Tablet', icon: <TabletMacIcon fontSize="large" />, path: '/products/tablets' },
  { name: 'Camera', icon: <CameraAltIcon fontSize="large" />, path: '/products/cameras' },
  { name: 'Loa', icon: <SpeakerIcon fontSize="large" />, path: '/products/speakers' },
  { name: 'Linh kiện', icon: <MemoryIcon fontSize="large" />, path: '/products/components' },
  { name: 'Cửa hàng', icon: <StorefrontIcon fontSize="large" />, path: '/stores' },
];

export default function HomeClient() {
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const route = useRouter();
   

  return (
    <Box sx={{ background: '#f5f7fa', minHeight: '100vh', width: '100%' }}>
      {/* Header FPTShop style */}
      <div className={styles.header}>
        <div className={styles.logoBox}>
          <Technology/>
        </div>
        {/* Hamburger menu cho mobile - luôn hiển thị trên mobile */}
        <button className={styles.hamburger + (mobileNavOpen ? ' ' + styles.hamburgerActive : '')} onClick={() => setMobileNavOpen(true)} aria-label="Mở menu">
          <MenuIcon className={styles.hamburgerIcon} />
        </button>
        <nav className={styles.nav}>
          <div className={styles.navItem}>Danh mục</div>
          <div className={styles.navItem}>Khuyến mãi</div>
          <div className={styles.navItem}>Sản phẩm</div>
          <div className={styles.navItem}>Tin tức</div>
        </nav>
        <div className={styles.rightBox}>
          <div className={styles.searchBar}>
            <SearchIcon style={{ color: '#d70018', fontSize: 24, marginRight: 8 }} />
            <input className={styles.searchInput} placeholder="Nhập tên điện thoại, máy tính, phụ kiện... cần tìm" />
          </div>
          <PeopleIcon className={styles.cartIcon} />
          <ShoppingCartIcon className={styles.cartIcon} />
        </div>
      </div>
      {/* Mobile nav overlay */}
      {mobileNavOpen && (
        <div className={styles.mobileNavOverlay} onClick={() => setMobileNavOpen(false)}>
          <div className={styles.mobileNavMenu} onClick={e => e.stopPropagation()}>
            <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:24}}>
              <Technology />
              <button className={styles.closeMenuBtn} onClick={() => setMobileNavOpen(false)} aria-label="Đóng menu">
                <CloseIcon fontSize="inherit" />
              </button>
            </div>
            <div className={styles.mobileNavItem}>Danh mục</div>
            <div className={styles.mobileNavItem}>Khuyến mãi</div>
            <div className={styles.mobileNavItem}>Sản phẩm</div>
            <div className={styles.mobileNavItem}>Tin tức</div>
          </div>
        </div>
      )}
      {/* Banner lớn */}
      <div className={styles.banner}>
        <div className={styles.bannerText}>
          <div className={styles.bannerTitle}>Đón đầu 5G<br />Lên Đời Galaxy <span style={{ color: '#1976d2', background: '#e3f0ff', borderRadius: 6, padding: '2px 10px', fontWeight: 800, fontSize: '1.2em' }}>Mới</span></div>
          <div className={styles.bannerDesc}>Ưu đãi cực sốc, đổi máy mới, trả góp 0%!</div>
          <button onClick={() => route.push('/login')} className={styles.bannerButton}>MUA NGAY</button>
        </div>
      </div>
      {/* Khối quảng cáo/ưu đãi */}
      <div className={styles.promoGrid}>
        <div className={styles.promoCard}>
          <div className={styles.promoTitle}>Trợ giá đến 3 triệu</div>
          <div className={styles.promoDesc}>Chỉ từ <span style={{ color: '#d70018', fontWeight: 700, fontSize: '1.3em' }}>2.99 triệu</span> + Dùng trước trả sau 0%</div>
        </div>
        <div className={styles.promoCard}>
          <div className={styles.promoTitle}>Quà tặng bạn</div>
          <div className={styles.promoDesc}>Nhận ngay khi mua Galaxy Z Fold7 | Z Flip7</div>
        </div>
        <div className={styles.promoCard}>
          <div className={styles.promoTitle}>Tuần lễ laptop Asus</div>
          <div className={styles.promoDesc}>Giá chỉ từ <span style={{ color: '#d70018', fontWeight: 700, fontSize: '1.3em' }}>9.99 triệu</span> - Giảm thêm đến 5 triệu cho HSSV</div>
        </div>
      </div>
      {/* Danh mục sản phẩm nổi bật */}
      <div className={styles.categoryGrid}>
        {electronicPages.map((page, index) => (
          <div className={styles.categoryCard} key={index}>
            <div style={{ fontSize: 48, marginBottom: 8 }}>{page.icon}</div>
            <div style={{ fontWeight: 700, marginBottom: 4 }}>{page.name}</div>
            <div style={{ color: '#d70018', fontWeight: 500, fontSize: 14 }}>Đi tới {page.name}</div>
          </div>
        ))}
      </div>
      {/* Nút trợ lý AI giữ nguyên */}
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
        <SmartToyIcon fontSize="large" sx={{ color: 'white' }} />
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
              <CloseIcon />
            </IconButton>
            <AiAssistantBox />
          </Box>
        </Fade>
      </Modal>
    </Box>
  );
} 