"use client";
import { Container,TextField, Button,Typography,Box,IconButton, Grid,
    InputAdornment
} from "@mui/material";
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { useState } from "react";
import { signIn } from "next-auth/react";
import styles from "../page.module.css";
import GoogleIcon from '@mui/icons-material/Google';
import FacebookIcon from '@mui/icons-material/Facebook';

export default function Page() {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [showPassword, setshowPassword] = useState<boolean>(false);
    const [error, setError] = useState<string>("");
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "success",
    })

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleSubmit = async (e: any) => {
    e.preventDefault();
    if(!email || !password) {
        setError("vui lòng điền vào cả hai trường!");
        return;
    }
    try {
     const result = await signIn(
        "credentials", {
            redirect: false,
            email, password
        }
     )
     console.log("response",result);
     if(result && result.error) {
        setSnackbar({
            open: true,
            message: result?.error || "Đăng Nhập Thất Bại!",
            severity: "error"
        })
     }else {
        setSnackbar({
            open: true,
            message: "Đăng Nhập Thành Công!",
            severity: "success"
        })
     }

    }catch(error) {
        console.log(error);
        setSnackbar({
            open:true,
            message: "đã xảy ra lỗi, vui lòng thử lại",
            severity: "error",
        })
    }
    }
    const togglePasswordVisibility = () => {
      setshowPassword((prev: boolean) => !prev);
    }
    return (
    <>
    <Container maxWidth="xl">
     <Grid 
     container
     spacing={2}
     alignItems={"center"}
     justifyContent={"center"}
     sx={{ minHeight: "100vh" }}>
     <Grid sx={{ width: '100%', maxWidth: 600}}>
     <Box
     component={"form"} 
     display={"flex"}
     flexDirection={"column"}
     alignItems={"center"}
     sx={{p : 3}}
     onSubmit={handleSubmit}
     className={styles.container}>
    <Typography
    variant="h4"
    gutterBottom
    sx={{ fontFamily: "Lato", fontSize: 25, fontWeight: "bolder"}}>
    Đăng Nhập
    </Typography>
                  {/* Email */}
            <TextField
              label="Email của bạn"
              variant="outlined"
              margin="normal"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              InputLabelProps={{}}
              InputProps={{
                style: {
                  color: "black",
                  borderColor: "cyan",
                },
              }}
              sx={{
                fontFamily: "Lato",
                input: { color: "black" },
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: "cyan",
                  },
                  '&:hover fieldset': {
                    borderColor: "red",
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: "cyan",
                  },
                },
                '& label': {
                  color: 'var(--foreground)',
                },
              }}
              error={!!error}
            />

            {/* Mật khẩu */}
            <TextField
              label="Mật khẩu của bạn"
              type={showPassword ? 'text':'password'}
              variant="outlined"
              margin="normal"
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputLabelProps={{}}
              InputProps={{
                style: {
                  color: "black",
                  borderColor: "cyan",
                },
                endAdornment:(
                  <InputAdornment position="end">
                  <IconButton 
                  onClick={togglePasswordVisibility}
                  sx={{ color: 'var(--foreground)' }}>
                   {showPassword ? <VisibilityIcon/>:<VisibilityOffIcon/>}
                  </IconButton>
                  </InputAdornment>
                )
              }}
              sx={{
                fontFamily: "Lato",
                input: { color: "black" },
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: "cyan",
                  },
                  '&:hover fieldset': {
                    borderColor: "red",
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: "cyan",
                  },
                },
                '& label': {
                  color: 'var(--foreground)',
                },
              }}
              error={!!error}
            />
            {error && (
              <Typography color="error" sx={{ mt: 1, width: '100%', textAlign: 'left', fontSize: 14 }}>
                {error}
              </Typography>
            )}
             <Button
            type="submit"
            variant="contained"
            sx={{
              backgroundColor:"red",
              '&:hover':{
                backgroundColor:"red",
              },
              mt:2,
              width:'100%',
            }}
            style={{fontFamily: "Lato", fontSize: "20px", fontWeight: "bolder"}}
            >Đăng Nhập</Button>
           <div className="flex gap-2">
             {/* Nút đăng nhập Google và Facebook */}
            <Button
              variant="contained"
              sx={{
                backgroundColor: "#fff",
                color: "#222",
                border: "1px solid #4285F4",
                mt: 2,
                width: '100%',
                fontWeight: 700,
                textTransform: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 1.5,
                minHeight: 48,
              }}
            >
              <GoogleIcon sx={{ color: 'red', fontSize: 32 }} />
            </Button>
            <Button
              variant="contained"
              sx={{
                backgroundColor: "#1877f3",
                color: "#fff",
                mt: 2,
                width: '100%',
                fontWeight: 700,
                textTransform: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 1.5,
                minHeight: 48,
                '&:hover': {
                  backgroundColor: '#145db2',
                },
              }}
            >
              <FacebookIcon sx={{ color: '#fff', fontSize: 32 }} />
            </Button>
           </div>
     </Box>
     </Grid>
     </Grid>
    </Container>
    <Snackbar
      open={snackbar.open}
      autoHideDuration={4000}
      onClose={() => setSnackbar({ ...snackbar, open: false })}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
    >
      <Alert
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        severity={snackbar.severity as 'success' | 'error' | 'info' | 'warning'}
        sx={{ width: '100%' }}
      >
        {snackbar.message}
      </Alert>
    </Snackbar>
    </>
    );
}