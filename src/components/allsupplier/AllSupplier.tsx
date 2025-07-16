/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import { 
  Alert, 
  CircularProgress, 
  Paper, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Modal, 
  Snackbar, 
  MenuItem,
  TablePagination,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  IconButton,
  Box,
  Table
} from "@mui/material";
import { Add, Delete, Edit, Search } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { addSupplier, fetchSuppliers, Supplier, deleteSupplier } from "@/reduxslice/supplierSlice";
import { AppDispatch } from "@/app/store";
import FallbackImage from "./FallbackImage";

interface SnackbarState {
  open: boolean;
  message: string;
  severity: 'success' | 'error' | 'info' | 'warning';
}

interface FormState {
  name: string;
  email: string;
  phone: string;
  address: string;
  status: boolean;
  logoUrl: string;
  note: string;
  logoData: string; // Thêm logoData để lưu base64 của ảnh
}

interface RootState {
  suppliers: {
    suppliers: Supplier[];
    loading: boolean;
    error: string | null;
  };
}

// Styled components
const modalStyle = {
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 500,
  maxWidth: '90vw',
  maxHeight: '90vh',
  bgcolor: 'background.paper',
  borderRadius: '15px',
  boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
  p: 4,
  overflow: 'auto',
};

const modalBackdropStyle = {
  backdropFilter: 'blur(8px)',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
};

const muiInputStyle = {
  '& .MuiOutlinedInput-root': {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    '& fieldset': {
      borderColor: 'rgba(255, 107, 53, 0.3)',
    },
    '&:hover fieldset': {
      borderColor: 'rgba(255, 107, 53, 0.5)',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#ff6b35',
    },
  },
  '& .MuiInputBase-input': {
    color: 'white',
  },
  '& .MuiInputLabel-root': {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  '& .MuiInputLabel-root.Mui-focused': {
    color: '#ff6b35',
  },
};

export default function AllSupplier() {
  const dispatch = useDispatch<AppDispatch>();
  const { suppliers, loading, error } = useSelector((state: RootState) => state.suppliers);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [supplierToDelete, setSupplierToDelete] = useState<Supplier | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [snackbar, setSnackbar] = useState<SnackbarState>({
    open: false,
    message: "",
    severity: 'success',
  });
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    phone: "",
    address: "",
    status: true,
    logoUrl: "",
    note: "",
    logoData: "", // Khởi tạo logoData
  });
  const [logoPreview, setLogoPreview] = useState<string>("");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    dispatch(fetchSuppliers());
  }, [dispatch]);

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleCloseAddModal = () => {
    setOpenAddModal(false);
    setForm({
      name: "",
      email: "",
      phone: "",
      address: "",
      status: true,
      logoUrl: "",
      note: "",
      logoData: "", // reset logoData
    });
    setLogoPreview("");
    setUploading(false);
  };

  const handleOpenAddModal = () => {
    setOpenAddModal(true);
  };

  const handleFormChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    if (name === "status") {
      setForm((prevForm) => ({ ...prevForm, status: value === "active" }));
    } else {
      setForm((prevForm) => ({ ...prevForm, [name]: value }));
    }
  };

  const validateForm = () => {
    if (!form.name || !form.email || !form.phone || !form.address) {
      setSnackbar({ open: true, message: "Vui lòng điền đầy đủ thông tin!", severity: "warning" });
      return false;
    }
    if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(form.email)) {
      setSnackbar({ open: true, message: "Email không hợp lệ!", severity: "warning" });
      return false;
    }
    if (uploading) {
      setSnackbar({ open: true, message: "Vui lòng chờ upload ảnh xong!", severity: "warning" });
      return false;
    }
    return true;
  };

  const handleAddSupplier = async () => {
    if (!validateForm()) return;
    const supplierPayload = {
      name: form.name,
      email: form.email,
      phone: form.phone,
      address: form.address,
      status: !!form.status,
      logoData: form.logoData,
      note: form.note,
    };
    console.log(supplierPayload.logoData)
    try {
      await dispatch(addSupplier(supplierPayload)).unwrap();
      setSnackbar({ open: true, message: "Đã thêm nhà cung cấp thành công!", severity: "success" });
      handleCloseAddModal();
      dispatch(fetchSuppliers());
    } catch (error: any) {
      let msg = error?.err || error?.message || error;
      if (msg?.includes("Email đã tồn tại")) {
        msg = "Email đã tồn tại trong hệ thống!";
      }
      setSnackbar({ open: true, message: `Lỗi: ${msg}`, severity: "error" });
      console.log("Lỗi khi thêm nhà cung cấp ", error);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleCloseDeleteModal = () => {
    setOpenDeleteModal(false);
    setSupplierToDelete(null);
  };

  const handleOpenEditModal = (supplier: Supplier) => {
    console.log("Edit supplier:", supplier);
  };

  const handleOpenDeleteModal = (supplier: Supplier) => {
    setOpenDeleteModal(true);
    setSupplierToDelete(supplier);
  };

  const handleDeleteSupplier = async () => {
    if (supplierToDelete && supplierToDelete._id) {
      try {
        await dispatch(deleteSupplier(supplierToDelete._id)).unwrap();
        setSnackbar({ open: true, message: "Đã xóa nhà cung cấp thành công!", severity: "success" });
        dispatch(fetchSuppliers());
      } catch (error: any) {
        setSnackbar({ open: true, message: "Lỗi khi xóa nhà cung cấp!", severity: "error" });
        console.log(error);
      }
      handleCloseDeleteModal();
    }
  };

  const filteredSuppliers = suppliers?.filter((supplier: Supplier) =>
    supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.address.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const handleLogoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLogoPreview(URL.createObjectURL(file));
    setUploading(true);
    // Chuyển file sang base64 và lưu vào logoData
    const reader = new FileReader();
    reader.onloadend = () => {
      setForm((prev) => ({ ...prev, logoData: reader.result as string, logoUrl: "" }));
      setUploading(false);
    };
    reader.readAsDataURL(file);
  };

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      p: 3
    }}>
      {/* Header */}
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        mb: 3,
        color: 'white'
      }}>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 2,
          flexDirection: 'column'
        }}>
          <Box sx={{ 
            width: 60, 
            height: 60, 
            background: 'linear-gradient(45deg, #ff6b35, #f7931e)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '24px',
            fontWeight: 'bold'
          }}>
            📋
          </Box>
          <Typography variant="h6" sx={{ 
            fontWeight: 'bold', 
            textAlign: 'center',
            color: 'white'
          }}>
            Quản Lý Đơn vị cho Nhà Cung Cấp
          </Typography>
        </Box>
      </Box>

      {/* Main Content */}
      <Box sx={{ 
        background: 'rgba(255, 255, 255, 0.1)', 
        backdropFilter: 'blur(10px)',
        borderRadius: '20px',
        p: 3,
        border: '1px solid rgba(255, 255, 255, 0.2)'
      }}>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 2, 
          mb: 3,
          color: 'white'
        }}>
          <Box sx={{ 
            width: 40, 
            height: 40, 
            background: 'linear-gradient(45deg, #ff6b35, #f7931e)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '18px'
          }}>
            🏢
          </Box>
          <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'white' }}>
            Nhà Cung Cấp
          </Typography>
        </Box>

        {/* Search and Add Button */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          mb: 3,
          gap: 2
        }}>
          <TextField
            placeholder="Tìm kiếm nhà cung cấp..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{
              flexGrow: 1,
              maxWidth: '400px',
              '& .MuiOutlinedInput-root': {
                background: 'rgba(255, 255, 255, 0.9)',
                borderRadius: '25px',
                '& fieldset': {
                  borderColor: 'transparent',
                },
                '&:hover fieldset': {
                  borderColor: 'rgba(255, 107, 53, 0.5)',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#ff6b35',
                },
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search sx={{ color: '#666' }} />
                </InputAdornment>
              ),
            }}
          />
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleOpenAddModal}
            sx={{
              background: 'linear-gradient(45deg, #ff6b35, #f7931e)',
              borderRadius: '25px',
              px: 3,
              py: 1.5,
              fontWeight: 'bold',
              textTransform: 'none',
              '&:hover': {
                background: 'linear-gradient(45deg, #e55a2b, #e8851a)',
              },
            }}
          >
            Thêm nhà cung cấp
          </Button>
        </Box>

        {/* Table */}
        <TableContainer 
          component={Paper} 
          sx={{ 
            borderRadius: '15px',
            overflow: 'hidden',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
          }}
        >
          <Table>
            <TableHead>
              <TableRow sx={{ 
                background: 'linear-gradient(45deg, #ff6b35, #f7931e)',
              }}>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>STT</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Tên nhà cung cấp</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Email</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Số điện thoại</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Địa chỉ</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Trạng thái</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Logo</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Ghi chú</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Thao tác</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={9}>
                    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", py: 4 }}>
                      <CircularProgress sx={{ color: '#ff6b35' }} />
                      <Typography sx={{ ml: 2, color: '#666' }}>Đang tải...</Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              ) : error ? (
                <TableRow>
                  <TableCell 
                    colSpan={9}
                    sx={{ 
                      color: "red", 
                      fontWeight: "bold", 
                      fontSize: "16px", 
                      textAlign: 'center',
                      py: 4
                    }}
                  >
                    Lỗi: {error}
                  </TableCell>
                </TableRow>
              ) : filteredSuppliers && filteredSuppliers.length > 0 ? (
                filteredSuppliers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((supplier: Supplier, idx: number) => (
                  <TableRow 
                    key={supplier._id || idx}
                    sx={{ 
                      '&:nth-of-type(odd)': { 
                        backgroundColor: 'rgba(255, 107, 53, 0.05)' 
                      },
                      '&:hover': {
                        backgroundColor: 'rgba(255, 107, 53, 0.1)',
                        cursor: 'pointer'
                      }
                    }}
                  >
                    <TableCell sx={{ 
                      color: '#ff6b35', 
                      fontWeight: 'bold',
                      fontSize: '16px'
                    }}>
                      {page * rowsPerPage + idx + 1}
                    </TableCell>
                    <TableCell sx={{ fontWeight: '500' }}>{supplier.name}</TableCell>
                    <TableCell>{supplier.email}</TableCell>
                    <TableCell>{supplier.phone}</TableCell>
                    <TableCell>{supplier.address}</TableCell>
                    <TableCell>
                      <Box sx={{
                        display: 'inline-block',
                        px: 2,
                        py: 0.5,
                        borderRadius: '20px',
                        backgroundColor: supplier.status ? '#4caf50' : '#f44336',
                        color: 'white',
                        fontSize: '12px',
                        fontWeight: 'bold'
                      }}>
                        {supplier.status ? "Hoạt động" : "Không hoạt động"}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <FallbackImage
                        src={supplier.logoData ? supplier.logoData : "/images/fallback-logo.png"}
                        alt="Logo"
                        width={40}
                        height={40}
                        style={{
                          width: 40,
                          height: 40,
                          objectFit: 'cover',
                          borderRadius: '8px'
                        }}
                      />
                    </TableCell>
                    <TableCell>{supplier.note}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <IconButton 
                          onClick={() => handleOpenEditModal(supplier)}
                          sx={{ 
                            color: '#ff6b35',
                            '&:hover': { backgroundColor: 'rgba(255, 107, 53, 0.1)' }
                          }}
                        >
                          <Edit />
                        </IconButton>
                        <IconButton 
                          onClick={() => handleOpenDeleteModal(supplier)}
                          sx={{ 
                            color: '#f44336',
                            '&:hover': { backgroundColor: 'rgba(244, 67, 54, 0.1)' }
                          }}
                        >
                          <Delete />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={9} sx={{ textAlign: 'center', py: 4 }}>
                    <Typography variant="body1" color="text.secondary">
                      Không tìm thấy nhà cung cấp nào
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          
          <TablePagination
            component="div"
            count={filteredSuppliers?.length || 0}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 25]}
            labelRowsPerPage="Số hàng mỗi trang:"
            labelDisplayedRows={({ from, to, count }) => `${from}-${to} của ${count}`}
            sx={{
              background: 'rgba(255, 107, 53, 0.05)',
              '& .MuiTablePagination-select': {
                borderRadius: '8px',
              }
            }}
          />
        </TableContainer>
      </Box>

      {/* Add Supplier Dialog */}
      <Dialog 
        open={openAddModal} 
        onClose={handleCloseAddModal}
        PaperProps={{
          sx: {
            background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
            color: 'white',
            borderRadius: 3,
            border: '1px solid rgba(255, 107, 53, 0.3)',
            minWidth: 400,
            maxWidth: '90vw',
          }
        }}
      >
        <DialogTitle sx={{
          color: '#ff6b35',
          fontWeight: 'bold',
          fontSize: 20,
          borderBottom: '1px solid rgba(255, 107, 53, 0.2)',
        }}>
          Thêm nhà cung cấp mới
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <TextField
            autoFocus
            margin="dense"
            label="Tên nhà cung cấp"
            fullWidth
            value={form.name}
            name="name"
            onChange={handleFormChange}
            sx={muiInputStyle}
          />
          <TextField
            margin="dense"
            label="Email"
            fullWidth
            value={form.email}
            name="email"
            onChange={handleFormChange}
            sx={muiInputStyle}
          />
          <TextField
            margin="dense"
            label="Số điện thoại"
            fullWidth
            value={form.phone}
            name="phone"
            onChange={handleFormChange}
            sx={muiInputStyle}
          />
          <TextField
            margin="dense"
            label="Địa chỉ"
            fullWidth
            value={form.address}
            name="address"
            onChange={handleFormChange}
            sx={muiInputStyle}
          />
          <TextField
            margin="dense"
            label="Ghi chú"
            fullWidth
            value={form.note}
            name="note"
            onChange={handleFormChange}
            multiline
            rows={2}
            sx={muiInputStyle}
          />
          <Box sx={{ mt: 2, mb: 2 }}>
            <Typography variant="subtitle2" sx={{ color: 'white', mb: 1 }}>
              Logo nhà cung cấp
            </Typography>
            <Button
              variant="contained"
              component="label"
              sx={{
                background: 'linear-gradient(45deg, #ff6b35 0%, #f7931e 100%)',
                color: 'white',
                fontWeight: 'bold',
                mb: 1,
              }}
              disabled={uploading}
            >
              {uploading ? "Đang tải..." : "Tải ảnh lên"}
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={handleLogoChange}
              />
            </Button>
            {logoPreview || form.logoData ? (
              <Box sx={{ mt: 1 }}>
                <FallbackImage 
                  width={80} 
                  height={80}
                  src={logoPreview || form.logoData}
                  alt="Logo preview"
                  style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 8, border: '1px solid #eee' }}
                />
              </Box>
            ) : null}
          </Box>
          <TextField
            margin="dense"
            label="Trạng thái"
            fullWidth
            select
            value={form.status ? "active" : "inactive"}
            name="status"
            onChange={handleFormChange}
            sx={muiInputStyle}
          >
            <MenuItem value="active">Hoạt động</MenuItem>
            <MenuItem value="inactive">Không hoạt động</MenuItem>
          </TextField>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button 
            onClick={handleCloseAddModal}
            sx={{
              color: 'rgba(255, 255, 255, 0.7)',
              '&:hover': {
                background: 'rgba(255, 255, 255, 0.1)',
              },
            }}
          >
            Hủy
          </Button>
          <Button 
            onClick={handleAddSupplier} 
            variant="contained"
            sx={{
              background: 'linear-gradient(45deg, #ff6b35 0%, #f7931e 100%)',
              '&:hover': {
                background: 'linear-gradient(45deg, #f7931e 0%, #ff6b35 100%)',
              },
            }}
            disabled={uploading}
          >
            Thêm
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Modal 
        open={openDeleteModal}
        onClose={handleCloseDeleteModal}
        aria-labelledby="delete-supplier-modal" 
        aria-describedby="delete-supplier-modal-description"
        sx={modalBackdropStyle}
      >
        <Box sx={modalStyle}>
          <Typography id="delete-supplier-modal" variant="h6" component="h2" sx={{
            color: '#f44336',
            fontWeight: 'bold',
            mb: 2
          }}>
            Xác nhận xóa
          </Typography>
          <Typography id="delete-supplier-modal-description" sx={{ mb: 3 }}>
            Bạn có chắc chắn muốn xóa nhà cung cấp <strong>{supplierToDelete?.name}</strong> không?
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
            <Button 
              variant="outlined"
              onClick={handleCloseDeleteModal}
              sx={{
                borderColor: '#666',
                color: '#666',
                '&:hover': {
                  borderColor: '#333',
                  backgroundColor: 'rgba(102, 102, 102, 0.1)'
                }
              }}
            >
              Hủy
            </Button>
            <Button 
              variant="contained" 
              onClick={handleDeleteSupplier}
              sx={{
                backgroundColor: '#f44336',
                '&:hover': {
                  backgroundColor: '#d32f2f',
                },
              }}
            >
              Xóa
            </Button>
          </Box>
        </Box>
      </Modal>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}