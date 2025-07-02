"use client";

import { Container,TextField, Button, Link,Typography,Box,Snackbar,Alert,IconButton, Grid,
    InputAdornment
} from "@mui/material";
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { useState } from "react";
import type { AlertColor } from "@mui/material";

export default function Page() {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] =  useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [openSnackBar, setOpenSnackBar] = useState(false);

    const [snackbarMessage, setSnackBarMessage] = useState('');
    const [snackbarSeverity, setSnackBarSeverity] = useState<AlertColor>('success');

 const handleRegister = async (e: { preventDefault: () => void }) => {
  e.preventDefault();
  if (!name || !phone || !password || !email) {
    setSnackBarMessage("Tất cả các trường đều phải yêu cầu");
    setSnackBarSeverity("error");
    setOpenSnackBar(true);
    return;
  }

  console.log({ name, email, phone, password });
  try {
    const response = await fetch(`${process.env.API}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        phone,
        email,
        password,
      }),
    }); 

    if (response.ok) {
      setSnackBarMessage("Đăng Ký Thành Công!");
      setSnackBarSeverity("success");
    } else {
      const data = await response.json();
      setSnackBarMessage(data.err || "Đăng Ký Thất Bại!");
      setSnackBarSeverity("error");
    }
    setOpenSnackBar(true); 
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err:any) {
    setSnackBarMessage("Có lỗi xảy ra, vui lòng thử lại");
    setSnackBarSeverity("error");
    setOpenSnackBar(true);
    console.log(err);
  }
};
  

    const togglePasswordVisibility = () => {
      setShowPassword((prev)=> !prev)
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const handleCloseSnackbar = (_event?: React.SyntheticEvent | Event, _reason?: string) => {
      setOpenSnackBar(false);
    }
    return(
      <>
    <Container maxWidth="xl">
      <Grid
        container
        spacing={2}
        alignItems="center"
        justifyContent="center"
        sx={{ minHeight: "100vh" }}
      >
        <Grid sx={{ width: '100%', maxWidth: 600 }}>
          <Box
            component="form"
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            sx={{ p: 3 }}
            onSubmit={handleRegister}
          >
            <Typography
              variant="h4"
              gutterBottom
              sx={{ fontFamily: "Lato", fontSize: 25, fontWeight: "bolder" }}
            >
              Đăng Ký
            </Typography>

            {/* Họ Tên */}
            <TextField
              label="Họ Tên"
              variant="outlined"
              margin="normal"
              fullWidth
              value={name}
              onChange={(e) => setName(e.target.value)}
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
            />

            {/* Số điện thoại */}
            <TextField
              label="Số điện thoại"
              variant="outlined"
              margin="normal"
              fullWidth
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
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
            />

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
            />
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
            >Đăng Ký</Button>
            <Link href="/login"
            variant='body2'
            sx={{
              mt:2
            }} style={{textDecoration: "none", color: 'var(--foreground)'}}>Bạn đã có tài khoản? Đăng Nhập</Link>
          </Box>
        </Grid>
        <Grid sx={{ width: '100%', maxWidth: 600, display: { xs: 'none', md: 'block' } }}>
          <Box sx={{
            width: "100%",
            height: "100vh",
            display: { xs: 'none', md: 'block' }
          }}>
            <Box
              component="img"
              src="/images/img3.webp"
              alt="register image"
              sx={{
                width: "100%",
                height: "100%",
                objectFit: "cover"
              }}
            />
          </Box>
        </Grid>
      </Grid>
      <Snackbar open={openSnackBar}
      autoHideDuration={6000}
      onClose={handleCloseSnackbar}>
        <Alert
        onClose={handleCloseSnackbar}
        severity={snackbarSeverity}
        sx={{width: "100%"}}
        >
        {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
      </>
    );
}