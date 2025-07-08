"use client";
import * as React from "react";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import { useRouter } from "next/navigation";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";
import Avatar from "@mui/material/Avatar";
import Collapse from "@mui/material/Collapse";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import Technology from "@/components/nav/Technology";
import { Category } from "@mui/icons-material";

const drawerWidth = 300;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const openedMixin = (theme: any) => ({
    width: drawerWidth,
    transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: "hidden",
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const closedMixin = (theme: any) => ({
    transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: "hidden",
    width: `calc(${theme.spacing(8)} + 1px)`,
    [theme.breakpoints.up("sm")]: {
        width: `calc(${theme.spacing(10)} + 10px)`,
    },
});

const DrawerHeader = styled("div")(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: theme.spacing(0, 1),
    minHeight: 56,
    marginTop: 64,
}));

const AppBar = styled(MuiAppBar)(({ theme }) => ({
    zIndex: theme.zIndex.drawer + 1,
    background: "#1a1a1a",
    boxShadow: "none",
}));

const Drawer = styled(MuiDrawer, {
    shouldForwardProp: (prop) => prop !== "open",
// eslint-disable-next-line @typescript-eslint/no-explicit-any
})(({ theme, open }: any) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: "nowrap",
    boxSizing: "border-box",
    background: "#23272f",
    color: "#fff",
    ...(open && {
        ...openedMixin(theme),
        "& .MuiDrawer-paper": openedMixin(theme),
    }),
    ...(!open && {
        ...closedMixin(theme),
        "& .MuiDrawer-paper": closedMixin(theme),
    }),
}));

export default function User({ children }: { children?: React.ReactNode }) {
    const theme = useTheme();
    const [open, setOpen] = React.useState(true);
    const router = useRouter();
    const [menuOpen, setMenuOpen] = React.useState(false);
    const [isCollapse, setIsCollapse] = React.useState(false);

    const handleDrawerOpen = () => {
        setOpen(true);
    };
    const handleDrawerClose = () => {
        setOpen(false);
    };
    const handleMenuClick = () => {
        setMenuOpen((prev) => !prev);
    };
    const handleCollapse=()=> {
        setIsCollapse(!isCollapse);
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleNavigation=(path: any)=> {
        router.push(`/dashboard/admin/${path}`)
    }
    return (
        <Box sx={{ display: "flex", minHeight: "100vh", background: "#f5f6fa" }}>
            <CssBaseline />
            <AppBar position="fixed">
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={handleDrawerOpen}
                        edge="start"
                        sx={{
                            marginRight: 2,
                            ...(open && { display: "none" }),
                        }}>
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 700 }}>
                        User Dashboard
                    </Typography>
                </Toolbar>
            </AppBar>
            <Drawer variant="permanent" open={open}
                PaperProps={{ className: 'hidden-scrollbar', sx: { background: "#23272f", color: "#fff" } }}>
                <DrawerHeader>
                  <Box sx={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center", py: 2 }}>       
                    {/* Avatar người dùng */}
                    <Avatar sx={{ width: 56, height: 56, mb: 1, bgcolor: "#1976d2", fontWeight: 700 }}>N</Avatar>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, color: "#fff", mb: 1 }}>
                      Người dùng
                    </Typography>
                  </Box>
                  <IconButton onClick={handleDrawerClose}>
                    {theme.direction === "rtl" ? (
                      <ChevronRightIcon sx={{ color: 'white' }} />
                    ) : (
                      <ChevronLeftIcon sx={{ color: "white" }} />
                    )}
                  </IconButton>
                </DrawerHeader>
                <Divider sx={{ bgcolor: "#444" }} />
                <List>
                    <ListItem disablePadding sx={{ display: "block" }}>
                        <ListItemButton
                            onClick={() => router.push(`/dashboard/user`)}
                            sx={{
                                minHeight: 48,
                                justifyContent: open ? "initial" : "center",
                                px: 2.5,
                                borderRadius: 2,
                                my: 1,
                                '&:hover': { background: '#1976d2', color: '#fff' },
                            }}>
                            <ListItemIcon
                                sx={{
                                    minWidth: 0,
                                    mr: open ? 3 : "auto",
                                    justifyContent: "center",
                                    color: '#fff',
                                }}>
                                <InboxIcon />
                            </ListItemIcon>
                            <ListItemText primary="Tổng quan" sx={{ opacity: open ? 1 : 0 }} />
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding sx={{ display: "block" }}>
                        <ListItemButton
                            onClick={handleMenuClick}
                            sx={{
                                minHeight: 48,
                                justifyContent: open ? "initial" : "center",
                                px: 2.5,
                                borderRadius: 2,
                                my: 1,
                                '&:hover': { background: '#1976d2', color: '#fff' },
                            }}>
                            <ListItemIcon
                                sx={{
                                    minWidth: 0,
                                    mr: open ? 3 : "auto",
                                    justifyContent: "center",
                                    color: '#fff',
                                }}>
                                <MailIcon />
                            </ListItemIcon>
                            <ListItemText primary="Menu phụ" sx={{ opacity: open ? 1 : 0 }} />
                            {menuOpen ? <ExpandLess /> : <ExpandMore />}
                        </ListItemButton>
                        <Collapse in={menuOpen} timeout="auto" unmountOnExit>
                            <List component="div" disablePadding sx={{ border: '1px solid #1976d2', background: '#232f3e', borderRadius: 2, mx: 2, my: 1 }}>
                                <ListItemButton sx={{ pl: 4, borderRadius: 2, '&:hover': { background: '#1976d2', color: '#fff' } }}>
                                    <ListItemIcon sx={{ color: '#fff' }}>
                                        <MailIcon />
                                    </ListItemIcon>
                                    <ListItemText primary="Mục con" />
                                </ListItemButton>
                            </List>
                        </Collapse>
                    </ListItem>
                    {/* start category */}
                   <ListItem disablePadding 
                   sx={{ display: "block"}} onClick={handleCollapse}>
                    <ListItemButton
                    sx={{
                        minHeight: 50,
                        justifyContent: open ? "initial" : "center",
                        px: 3,
                    }}>
                    <ListItemIcon
                    sx={{minWidth: 0,
                        mr: open ? 3 : "auto",
                        justifyContent: "center",
                    }}>
                    <Category sx={{ color: "white"}}/>
                    </ListItemIcon>
                    <ListItemText primary="Quản Lý Danh Mục" sx={{opacity: 1}}>
                     {isCollapse ? <ExpandLess/> : <ExpandMore/>}
                    </ListItemText>
                    {/* end category */}
                    </ListItemButton>
                   </ListItem>
                   <Collapse in={isCollapse} timeout="auto" unmountOnExit>
                   {["all-category"].map((text) => (
                    <ListItem key={text} disablePadding sx={{display: "block"}}>
                    <ListItemButton
                    onClick={() => handleNavigation(text)}
                    sx={{
                        minHeight: 50,
                        justifyContent: open ? "initial" : "center",
                        px: 3,
                        marginLeft: "30px",
                        color: "white",
                        borderBottom: "1px solid white",
                    }}>
                     <ListItemText
                     primary={text.replace(/-/g," ")}
                     sx={{ opacity: open ? 1 : 0}}>
                     </ListItemText>
                    </ListItemButton>
                    </ListItem>
                   ))}
                   </Collapse>
                </List>
            </Drawer>
           <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8 }}>
           <Technology />  
          {children}
        </Box>
        </Box>
    );
}