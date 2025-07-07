"use client";
import React, { useEffect, useState } from "react";
import {
  Box, Button, TextField, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, IconButton, Dialog, DialogTitle, DialogContent,
  DialogActions, Snackbar, Alert, CircularProgress
} from "@mui/material";
import { Delete, Add } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { addCategory, fetchCategories, deleteCategory, updateCategory } from "@/reduxslice/categorySlice";
import { store } from "@/app/store";
import Switch from '@mui/material/Switch';

type RootState = ReturnType<typeof store.getState>;
type AppDispatch = typeof store.dispatch;

export default function AllCategory() {
  const dispatch = useDispatch<AppDispatch>();
  const { categories, loading, error } = useSelector((state: RootState) => state.categories);

  const [openAddModal, setOpenAddModal] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<{ _id: string; name: string } | null>(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleOpenAddModal = () => setOpenAddModal(true);
  const handleCloseAddModal = () => setOpenAddModal(false);

  const handleOpenDeleteModal = (category: { _id: string; name: string }) => {
    setSelectedCategory(category);
    setOpenDeleteModal(true);
  };
  const handleCloseDeleteModal = () => setOpenDeleteModal(false);

  const handleCloseSnackbar = () => setSnackbar({ ...snackbar, open: false });

  const handleAddCategory = () => {
    if (!newCategoryName.trim()) return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    dispatch(addCategory({ name: newCategoryName }) as any)
      .unwrap()
      .then(() => {
        setSnackbar({ open: true, message: "Thêm danh mục thành công!", severity: "success" });
        setNewCategoryName("");
        handleCloseAddModal();
      })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .catch((error: any) => {
        setSnackbar({ open: true, message: `Lỗi: ${error}`, severity: "error" });
      });
  };

  const handleDeleteCategory = () => {
    if (!selectedCategory) return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    dispatch(deleteCategory(selectedCategory._id) as any)
      .unwrap()
      .then(() => {
        setSnackbar({ open: true, message: "Xoá danh mục thành công!", severity: "success" });
        handleCloseDeleteModal();
      })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .catch((error: any) => {
        setSnackbar({ open: true, message: `Lỗi: ${error}`, severity: "error" });
      });
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleToggleStatus = (cat: any) => {
    // Nếu đã có API updateCategory thì gọi dispatch(updateCategory({...cat, status: !cat.status}))
    // Nếu chưa có thì chỉ cập nhật tạm thời trên UI (optimistic update)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    dispatch(updateCategory({ ...cat, status: !cat.status }) as any)
      .unwrap()
      .then(() => {
        setSnackbar({ open: true, message: 'Cập nhật trạng thái thành công!', severity: 'success' });
      })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .catch((error: any) => {
        setSnackbar({ open: true, message: `Lỗi: ${error}`, severity: 'error' });
      });
  };

  return (
    <Box sx={{
      p: { xs: 2, md: 5 },
      minHeight: '70vh',
      background: 'linear-gradient(135deg, #232526 0%, #414345 100%)',
      borderRadius: 5,
      boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
      backdropFilter: 'blur(8px)',
      border: '1px solid rgba(255,255,255,0.18)',
      maxWidth: 1100,
      mx: 'auto',
      mt: 6,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
        <Box sx={{
          width: 48, height: 48, mr: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'linear-gradient(135deg, #00c6ff 0%, #0072ff 100%)', borderRadius: '50%', boxShadow: '0 2px 8px #00c6ff44',
        }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M12 2L15 8H9L12 2ZM12 22C13.1046 22 14 21.1046 14 20H10C10 21.1046 10.8954 22 12 22ZM4.22 10.47L2.81 9.06C2.42 8.67 2.42 8.04 2.81 7.65C3.2 7.26 3.83 7.26 4.22 7.65L5.63 9.06C6.02 9.45 6.02 10.08 5.63 10.47C5.24 10.86 4.61 10.86 4.22 10.47ZM19.78 10.47C19.39 10.86 18.76 10.86 18.37 10.47C17.98 10.08 17.98 9.45 18.37 9.06L19.78 7.65C20.17 7.26 20.8 7.26 21.19 7.65C21.58 8.04 21.58 8.67 21.19 9.06L19.78 10.47ZM17.66 17.66C17.27 18.05 16.64 18.05 16.25 17.66C15.86 17.27 15.86 16.64 16.25 16.25L17.66 14.84C18.05 14.45 18.68 14.45 19.07 14.84C19.46 15.23 19.46 15.86 19.07 16.25L17.66 17.66ZM6.34 17.66L4.93 16.25C4.54 15.86 4.54 15.23 4.93 14.84C5.32 14.45 5.95 14.45 6.34 14.84L7.75 16.25C8.14 16.64 8.14 17.27 7.75 17.66C7.36 18.05 6.73 18.05 6.34 17.66Z" fill="#fff"/></svg>
        </Box>
        <Typography
          variant="h5"
          sx={{
            color: '#fff',
            fontWeight: 'bold',
            textAlign: 'center',
            textShadow: '1px 1px 8px #00c6ff88',
            letterSpacing: 2,
            fontFamily: 'Montserrat, Roboto, Arial',
          }}
        >
          Danh mục sản phẩm điện tử
        </Typography>
      </Box>
      <Button
        variant="contained"
        color="primary"
        startIcon={<Add />}
        onClick={handleOpenAddModal}
        sx={{
          mb: 2,
          fontWeight: 'bold',
          borderRadius: 3,
          background: 'linear-gradient(90deg, #00c6ff 0%, #0072ff 100%)',
          boxShadow: '0 2px 8px #00c6ff44',
          ':hover': { background: 'linear-gradient(90deg, #0072ff 0%, #00c6ff 100%)' },
        }}
      >
        + Thêm danh mục
      </Button>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper} sx={{
          borderRadius: 4,
          background: 'rgba(255,255,255,0.08)',
          boxShadow: '0 4px 24px 0 rgba(0,198,255,0.10)',
          backdropFilter: 'blur(4px)',
        }}>
          <Table>
            <TableHead>
              <TableRow sx={{ background: 'linear-gradient(90deg, #232526 0%, #00c6ff 100%)' }}>
                <TableCell sx={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>#</TableCell>
                <TableCell sx={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>Tên danh mục</TableCell>
                <TableCell sx={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>Trạng thái</TableCell>
                <TableCell align="right" sx={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>Thao tác</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {categories.map((cat, idx) => (
                <TableRow
                  key={cat._id}
                  sx={{
                    transition: '0.2s',
                    ':hover': { background: 'rgba(0,198,255,0.08)' },
                  }}
                >
                  <TableCell sx={{ color: '#fff', fontWeight: 500 }}>{idx + 1}</TableCell>
                  <TableCell sx={{ color: '#fff', fontWeight: 500 }}>{cat.name}</TableCell>
                  <TableCell>
                    <Switch
                      checked={cat.status !== false}
                      onChange={() => handleToggleStatus(cat)}
                      color="success"
                    />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton color="error" onClick={() => handleOpenDeleteModal(cat)}>
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {categories.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3} align="center" sx={{ color: '#fff' }}>
                    Không có danh mục nào.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Add Category Modal */}
      <Dialog open={openAddModal} onClose={handleCloseAddModal}>
        <DialogTitle>Thêm danh mục mới</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Tên danh mục"
            fullWidth
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddModal}>Huỷ</Button>
          <Button onClick={handleAddCategory} variant="contained" color="primary">
            Thêm
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Category Modal */}
      <Dialog open={openDeleteModal} onClose={handleCloseDeleteModal}>
        <DialogTitle>Xác nhận xoá</DialogTitle>
        <DialogContent>
          Bạn có chắc muốn xoá danh mục 
          {selectedCategory?.name}?
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteModal}>Huỷ</Button>
          <Button onClick={handleDeleteCategory} variant="contained" color="error">
            Xoá
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
      {/* Error message */}
      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}
    </Box>
  );
}