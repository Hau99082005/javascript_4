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
import Transection from "./dashboard/Transection";

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

    const handleDrawerOpen = () => {
        setOpen(true);
    };
    const handleDrawerClose = () => {
        setOpen(false);
    };
    const handleMenuClick = () => {
        setMenuOpen((prev) => !prev);
    };
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
                    <IconButton onClick={handleDrawerClose}>
                        {theme.direction === "rtl" ? (
                            <ChevronRightIcon sx={{ color: 'white' }} />
                        ) : (
                            <ChevronLeftIcon sx={{ color: "white" }} />
                        )}
                    </IconButton>
                </DrawerHeader>
                <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", py: 2 }}>
                    <Avatar sx={{ width: 64, height: 64, mb: 1, bgcolor: "#1976d2" }}>N</Avatar>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, color: "#fff" }}>Người dùng</Typography>
                </Box>
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
                            <List component="div" disablePadding>
                                <ListItemButton sx={{ pl: 4, borderRadius: 2, '&:hover': { background: '#1976d2', color: '#fff' } }}>
                                    <ListItemIcon sx={{ color: '#fff' }}>
                                        <MailIcon />
                                    </ListItemIcon>
                                    <ListItemText primary="Mục con" />
                                </ListItemButton>
                            </List>
                        </Collapse>
                    </ListItem>
                </List>
            </Drawer>
            <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8 }}>
                <Transection/>
                {children}
            </Box>
        </Box>
    );
}