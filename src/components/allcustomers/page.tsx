"use client";
import React, { useEffect, useState } from "react";
import {
  Box, Button, TextField, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, IconButton, Dialog, DialogTitle, DialogContent,
  DialogActions, Snackbar, Alert, CircularProgress,
  TablePagination,
  InputAdornment
} from "@mui/material";
import { Delete, Add, Edit, Search, Person } from "@mui/icons-material";
import Technology from "../nav/Technology";
import { addCustomer, fetchCustomers, deleteCustomer } from "@/reduxslice/customerSlice";
import { useDispatch, useSelector } from "react-redux";
// Nếu không có @/store, tạm thời dùng any cho RootState
// import type { RootState } from "@/store";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type RootState = any;
import type { Customer } from "@/reduxslice/customerSlice";

export default function AllCustomers() {
  // Nếu không có AppDispatch, tạm thời dùng any cho dispatch
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const dispatch: any = useDispatch();
  const { customers, loading, error } = useSelector((state: RootState) => state.customers);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [newCustomerImagePreview, setNewCustomerImagePreview] = useState<string | null>(null);
  const [editCustomerImagePreview, setEditCustomerImagePreview] = useState<string | null>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [filter, setFilter] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });
  // Form states
  const [newCustomer, setNewCustomer] = useState<Omit<Customer, "_id">>({
    name: "",
    email: "",
    phone: "",
    address: "",
    image: "",
  });
  const [editCustomer, setEditCustomer] = useState<Omit<Customer, "_id">>({
    name: "",
    email: "",
    phone: "",
    address: "",
    image: "",
  });
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  useEffect(() => {
    dispatch(fetchCustomers());
  }, [dispatch]);

  const handleOpenAddModal = () => setOpenAddModal(true);
  const handleCloseAddModal = () => {
    setOpenAddModal(false);
    setNewCustomer({ name: "", email: "", phone: "", address: "", image: "" });
    setNewCustomerImagePreview(null);
  };

  const handleOpenEditModal = (customer: Customer) => {
    setSelectedCustomer(customer);
    setEditCustomer({
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      address: customer.address,
      image: customer.image || "",
    });
    setEditCustomerImagePreview(customer.image || null);
    setOpenEditModal(true);
  };
  const handleCloseEditModal = () => setOpenEditModal(false);

  const handleOpenDeleteModal = (customer: Customer) => {
    setSelectedCustomer(customer);
    setOpenDeleteModal(true);
  };
  const handleCloseDeleteModal = () => setOpenDeleteModal(false);

  const handleCloseSnackbar = () => setSnackbar({ ...snackbar, open: false });

  const handleAddCustomer = () => {
    dispatch(addCustomer(newCustomer))
      .unwrap()
      .then(() => {
        handleCloseAddModal();
        setSnackbar({ open: true, message: "Thêm khách hàng thành công!", severity: "success" });
      })
      .catch((error: unknown) => {
        setSnackbar({ open: true, message: `Lỗi ${error instanceof Error ? error.message : String(error)}`, severity: "error" });
      });
  };

  const handleEditCustomer = async () => {
    if (!selectedCustomer || !editCustomer.name.trim() || !editCustomer.email.trim()) {
      setSnackbar({ open: true, message: "Vui lòng nhập đầy đủ thông tin!", severity: "error" });
      return;
    }
    try {
      const response = await fetch(`/api/customers/${selectedCustomer._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editCustomer),
      });
      if (response.ok) {
        setSnackbar({ open: true, message: "Cập nhật khách hàng thành công!", severity: "success" });
        handleCloseEditModal();
        dispatch(fetchCustomers());
      } else {
        const errorData = await response.json();
        setSnackbar({ open: true, message: `Lỗi: ${errorData.message}`, severity: "error" });
      }
    } catch (error: unknown) {
      setSnackbar({ open: true, message: `Lỗi kết nối: ${error instanceof Error ? error.message : String(error)}`, severity: "error" });
    }
  };

  const handleDeleteCustomer = () => {
    if (!selectedCustomer) return;
    dispatch(deleteCustomer(selectedCustomer._id))
      .unwrap()
      .then(() => {
        handleCloseDeleteModal();
        setSnackbar({ open: true, message: "Xoá khách hàng khỏi danh sách thành công!", severity: "success" });
      })
      .catch((error: unknown) => {
        setSnackbar({ open: true, message: `Lỗi ${error instanceof Error ? error.message : String(error)}`, severity: "error" });
      });
  };

  const filteredCustomers = customers.filter((customer: Customer) =>
    customer.name.toLowerCase().includes(filter.toLowerCase()) ||
    customer.email.toLowerCase().includes(filter.toLowerCase())
  );

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilter(e.target.value);
  };

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/upload`;
  let CLOUDINARY_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
  if (!CLOUDINARY_PRESET) {
    CLOUDINARY_PRESET = 'ml_default'; // Thay bằng tên preset unsigned thực tế của bạn nếu khác
  }
  console.log('CLOUDINARY_PRESET used:', CLOUDINARY_PRESET);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
    setter: React.Dispatch<React.SetStateAction<Omit<Customer, "_id">>>,
    previewSetter: React.Dispatch<React.SetStateAction<string | null>>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsUploadingImage(true);
      const fileUrl = URL.createObjectURL(file);
      previewSetter(fileUrl);

      let CLOUDINARY_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
      if (!CLOUDINARY_PRESET) {
        CLOUDINARY_PRESET = 'ml_default'; // Đổi thành tên preset unsigned thực tế nếu khác
      }

      // Cảnh báo nếu preset chưa đúng
      if (!CLOUDINARY_PRESET || CLOUDINARY_PRESET === 'ml_default') {
        alert(
          "⚠️ Bạn chưa cấu hình đúng Cloudinary upload preset hoặc preset 'ml_default' chưa tồn tại trên Cloudinary.\n" +
          "Vui lòng vào Cloudinary Dashboard > Settings > Upload > Upload presets để tạo preset unsigned tên 'ml_default' (hoặc tên bạn muốn)!"
        );
      }

      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", CLOUDINARY_PRESET!);
      console.log('Upload preset sent:', CLOUDINARY_PRESET);

      try {
        const response = await fetch(CLOUDINARY_UPLOAD_URL, {
          method: "POST",
          body: formData,
        });
        const data = await response.json();
        console.log('Cloudinary response:', data);
        if (data.secure_url) {
          setter((prev) => ({ ...prev, image: data.secure_url }));
          setSnackbar({ open: true, message: "Upload ảnh thành công!", severity: "success" });
        } else {
          setSnackbar({ open: true, message: data.error?.message || "Lỗi upload ảnh!", severity: "error" });
        }
      } catch (error) {
        setSnackbar({ open: true, message: `Lỗi: ${error instanceof Error ? error.message : String(error)}`, severity: "error" });
      } finally {
        setIsUploadingImage(false);
      }
    }
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f4c75 100%)',
      p: 3,
    }}>
      {/* Header */}
      <Box
        sx={{
          textAlign: "center",
          mb: 4,
          pt: 2,
        }}
      >
        {/* Logo hoặc chữ TECHNOLOGY */}
        <Box sx={{ display: "inline-block", mb: 1 }}>
          <Technology />
        </Box>
        {/* Dòng mô tả bên dưới */}
        <Typography
          variant="h6"
          sx={{
            color: "rgba(255, 255, 255, 0.85)",
            fontWeight: 400,
          }}
        >
          Quản lý thông tin khách hàng hiệu quả
        </Typography>
      </Box>
      {/* Main Content Container */}
      <Box sx={{
        maxWidth: 1200,
        mx: 'auto',
        background: 'rgba(255, 255, 255, 0.05)',
        borderRadius: 3,
        p: 4,
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 107, 53, 0.2)',
        boxShadow: '0 8px 32px rgba(255, 107, 53, 0.1)',
      }}>
        {/* Title Section */}
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mb: 4,
        }}>
          <Box sx={{
            width: 50,
            height: 50,
            borderRadius: '50%',
            background: 'linear-gradient(45deg, #ff6b35 0%, #f7931e 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mr: 2,
            boxShadow: '0 4px 15px rgba(255, 107, 53, 0.4)',
          }}>
            <Person sx={{ color: 'white', fontSize: 28 }} />
          </Box>
          <Typography
            variant="h4"
            sx={{
              color: '#ff6b35',
              fontWeight: 'bold',
              textShadow: '1px 1px 2px rgba(255, 107, 53, 0.3)',
        }}
      >
            Quản lý khách hàng
      </Typography>
        </Box>
        {/* Search and Add Button */}
        <Box sx={{
          display: 'flex',
          gap: 2,
          mb: 3,
          flexDirection: { xs: 'column', md: 'row' },
        }}>
          <TextField
            fullWidth
            placeholder="Tìm kiếm khách hàng..."
            value={filter}
            onChange={handleFilterChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search sx={{ color: '#ff6b35' }} />
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                borderRadius: 2,
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
                '&::placeholder': {
                  color: 'rgba(255, 255, 255, 0.6)',
                },
              },
            }}
          />
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleOpenAddModal}
            sx={{
              minWidth: 200,
              height: 56,
              background: 'linear-gradient(45deg, #ff6b35 0%, #f7931e 100%)',
              borderRadius: 2,
              fontWeight: 'bold',
              fontSize: 16,
              boxShadow: '0 4px 15px rgba(255, 107, 53, 0.4)',
              textTransform: 'none',
              '&:hover': {
                background: 'linear-gradient(45deg, #f7931e 0%, #ff6b35 100%)',
                boxShadow: '0 6px 20px rgba(255, 107, 53, 0.6)',
              },
            }}
          >
            Thêm khách hàng
          </Button>
        </Box>
        {/* Loading */}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress sx={{ color: '#ff6b35' }} size={60} />
          </Box>
        ) : (
          <>
            {/* Table */}
            <TableContainer component={Paper} sx={{
              borderRadius: 2,
              background: 'rgba(255, 255, 255, 0.08)',
              backdropFilter: 'blur(5px)',
              border: '1px solid rgba(255, 107, 53, 0.2)',
              overflow: 'hidden',
            }}>
        <Table>
          <TableHead>
                  <TableRow sx={{
                    background: 'linear-gradient(90deg, #ff6b35 0%, #f7931e 100%)',
                  }}>
                    <TableCell sx={{
                      color: 'white',
                      fontWeight: 'bold',
                      fontSize: 16,
                      py: 2,
                    }}>
                      STT
                    </TableCell>
                    <TableCell sx={{
                      color: 'white',
                      fontWeight: 'bold',
                      fontSize: 16,
                      py: 2,
                    }}>
                      Tên khách hàng
                    </TableCell>
                    <TableCell sx={{
                      color: 'white',
                      fontWeight: 'bold',
                      fontSize: 16,
                      py: 2,
                    }}>
                      Email
                    </TableCell>
                    <TableCell sx={{
                      color: 'white',
                      fontWeight: 'bold',
                      fontSize: 16,
                      py: 2,
                    }}>
                      Số điện thoại
                    </TableCell>
                    <TableCell sx={{
                      color: 'white',
                      fontWeight: 'bold',
                      fontSize: 16,
                      py: 2,
                    }}>
                      Hình ảnh
                    </TableCell>
                    <TableCell sx={{
                      color: 'white',
                      fontWeight: 'bold',
                      fontSize: 16,
                      py: 2,
                    }}>
                      Địa chỉ
                    </TableCell>
                    <TableCell align="right" sx={{
                      color: 'white',
                      fontWeight: 'bold',
                      fontSize: 16,
                      py: 2,
                    }}>
                      Thao tác
                    </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
                  {filteredCustomers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((customer: Customer, idx: number) => (
                    <TableRow
                      key={customer._id}
                      sx={{
                        background: idx % 2 === 0 ? 'rgba(255, 255, 255, 0.03)' : 'rgba(255, 107, 53, 0.05)',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          background: 'rgba(255, 107, 53, 0.1)',
                          transform: 'translateY(-1px)',
                        },
                      }}
                    >
                      <TableCell sx={{
                        color: '#ff6b35',
                        fontWeight: 600,
                        fontSize: 16,
                        py: 2,
                      }}>
                        {page * rowsPerPage + idx + 1}
                      </TableCell>
                      <TableCell sx={{
                        color: 'white',
                        fontSize: 16,
                        py: 2,
                      }}>
                        {customer.name}
                      </TableCell>
                      <TableCell sx={{
                        color: 'white',
                        fontSize: 16,
                        py: 2,
                      }}>
                        {customer.email}
                      </TableCell>
                      <TableCell sx={{
                        color: 'white',
                        fontSize: 16,
                        py: 2,
                      }}>
                        {customer.phone}
                      </TableCell>
                      <TableCell sx={{ py: 2 }}>
                        {customer.image ? (
                          <Box
                            component="img"
                            src={customer.image}
                            alt={customer.name}
                            sx={{
                              width: 50,
                              height: 50,
                              borderRadius: 1,
                              objectFit: 'cover',
                            }}
                          />
                        ) : (
                          <Box
                            sx={{
                              width: 50,
                              height: 50,
                              borderRadius: 1,
                              background: 'rgba(255, 107, 53, 0.2)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <Person sx={{ color: 'rgba(255, 255, 255, 0.5)' }} />
                          </Box>
                        )}
                      </TableCell>
                      <TableCell sx={{
                        color: 'white',
                        fontSize: 16,
                        py: 2,
                        maxWidth: 200,
                      }}>
                        {customer.address}
                      </TableCell>
                      <TableCell align="right" sx={{ py: 2 }}>
                        <IconButton
                          onClick={() => handleOpenEditModal(customer)}
                          sx={{
                            color: '#ff6b35',
                            mr: 1,
                            '&:hover': {
                              background: 'rgba(255, 107, 53, 0.1)',
                            },
                          }}
                        >
                          <Edit />
                        </IconButton>
                        <IconButton
                          onClick={() => handleOpenDeleteModal(customer)}
                          sx={{
                            color: '#ff4757',
                            '&:hover': {
                              background: 'rgba(255, 71, 87, 0.1)',
                            },
                          }}
                        >
                          <Delete />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredCustomers.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} align="center" sx={{
                        color: 'rgba(255, 255, 255, 0.6)',
                        py: 4,
                        fontSize: 16,
                      }}>
                        Không có khách hàng nào.
                      </TableCell>
                    </TableRow>
                  )}
          </TableBody>
        </Table>
      </TableContainer>
            {/* Pagination */}
            <Box sx={{
              display: 'flex',
              justifyContent: 'center',
              mt: 3,
            }}>
              <TablePagination
                component="div"
                count={filteredCustomers.length}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                rowsPerPageOptions={[5, 10, 25]}
                sx={{
                  color: 'white',
                  '& .MuiTablePagination-selectIcon': {
                    color: '#ff6b35',
                  },
                  '& .MuiTablePagination-actions button': {
                    color: '#ff6b35',
                  },
                }}
              />
            </Box>
          </>
        )}
      </Box>
      {/* Add Customer Modal */}
      <Dialog 
        open={openAddModal} 
        onClose={handleCloseAddModal}
        PaperProps={{
          sx: {
            background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
            color: 'white',
            borderRadius: 3,
            border: '1px solid rgba(255, 107, 53, 0.3)',
            maxWidth: 600,
            width: '90%',
          }
        }}
      >
        <DialogTitle sx={{
          color: '#ff6b35',
          fontWeight: 'bold',
          fontSize: 20,
          borderBottom: '1px solid rgba(255, 107, 53, 0.2)',
        }}>
          Thêm khách hàng mới
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <TextField
            autoFocus
            margin="dense"
            label="Name"
            fullWidth
            value={newCustomer.name}
            onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
            sx={{
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
            }}
          />
          <TextField
            margin="dense"
            label="Email"
            type="email"
            fullWidth
            value={newCustomer.email}
            onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
            sx={{
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
            }}
          />
          <TextField
            margin="dense"
            label="Phone"
            fullWidth
            value={newCustomer.phone}
            onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
            sx={{
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
            }}
          />
          <TextField
            margin="dense"
            label="Address"
            fullWidth
            multiline
            rows={3}
            value={newCustomer.address}
            onChange={(e) => setNewCustomer({ ...newCustomer, address: e.target.value })}
            sx={{
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
            }}
          />
          <Button
            variant="contained"
            component="label"
            sx={{ 
              mt: 2, 
              background: 'linear-gradient(45deg, #ff6b35 0%, #f7931e 100%)',
              '&:hover': {
                background: 'linear-gradient(45deg, #f7931e 0%, #ff6b35 100%)',
              },
              position: 'relative',
            }}
          >
            Tải ảnh
            <input 
              type="file" 
              hidden 
              accept="image/*" 
              onChange={e => { void handleFileChange(e, setNewCustomer, setNewCustomerImagePreview); }}
            />
            {isUploadingImage && (
              <CircularProgress size={20} sx={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', color: 'white' }} />
            )}
          </Button>
          {newCustomerImagePreview && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 1 }}>
                Ảnh đã chọn:
              </Typography>
              <Box
                component="img"
                src={newCustomerImagePreview}
                alt="Preview"
                sx={{
                  width: 100,
                  height: 100,
                  borderRadius: 1,
                  objectFit: 'cover',
                }}
              />
            </Box>
          )}
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
            onClick={handleAddCustomer} 
            variant="contained"
            disabled={!newCustomer.image || isUploadingImage}
            sx={{
              background: 'linear-gradient(45deg, #ff6b35 0%, #f7931e 100%)',
              '&:hover': {
                background: 'linear-gradient(45deg, #f7931e 0%, #ff6b35 100%)',
              },
            }}
          >
            Thêm
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Customer Modal */}
      <Dialog 
        open={openEditModal} 
        onClose={handleCloseEditModal}
        PaperProps={{
          sx: {
            background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
            color: 'white',
            borderRadius: 3,
            border: '1px solid rgba(255, 107, 53, 0.3)',
            maxWidth: 600,
            width: '90%',
          }
        }}
      >
        <DialogTitle sx={{
          color: '#ff6b35',
          fontWeight: 'bold',
          fontSize: 20,
          borderBottom: '1px solid rgba(255, 107, 53, 0.2)',
        }}>
          Sửa thông tin khách hàng
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <TextField
            autoFocus
            margin="dense"
            label="Tên khách hàng"
            fullWidth
            value={editCustomer.name}
            onChange={(e) => setEditCustomer({ ...editCustomer, name: e.target.value })}
            sx={{
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
            }}
          />
          <TextField
            margin="dense"
            label="Email"
            type="email"
            fullWidth
            value={editCustomer.email}
            onChange={(e) => setEditCustomer({ ...editCustomer, email: e.target.value })}
            sx={{
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
            }}
          />
          <TextField
            margin="dense"
            label="Số điện thoại"
            fullWidth
            value={editCustomer.phone}
            onChange={(e) => setEditCustomer({ ...editCustomer, phone: e.target.value })}
            sx={{
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
            }}
          />
          <TextField
            margin="dense"
            label="Địa chỉ"
            fullWidth
            multiline
            rows={3}
            value={editCustomer.address}
            onChange={(e) => setEditCustomer({ ...editCustomer, address: e.target.value })}
            sx={{
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
            }}
          />
          <Button
            variant="contained"
            component="label"
            sx={{ 
              mt: 2, 
              background: 'linear-gradient(45deg, #ff6b35 0%, #f7931e 100%)',
              '&:hover': {
                background: 'linear-gradient(45deg, #f7931e 0%, #ff6b35 100%)',
              },
            }}
          >
            Tải ảnh mới
            <input 
              type="file" 
              hidden 
              accept="image/*" 
              onChange={e => { void handleFileChange(e, setEditCustomer, setEditCustomerImagePreview); }}
            />
          </Button>
          {editCustomerImagePreview && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 1 }}>
                Ảnh hiện tại:
          </Typography>
              <Box
                component="img"
                src={editCustomerImagePreview}
                alt="Preview"
                sx={{
                  width: 100,
                  height: 100,
                  borderRadius: 1,
                  objectFit: 'cover',
                }}
              />
        </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button 
            onClick={handleCloseEditModal}
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
            onClick={handleEditCustomer} 
            variant="contained"
            sx={{
              background: 'linear-gradient(45deg, #ff6b35 0%, #f7931e 100%)',
              '&:hover': {
                background: 'linear-gradient(45deg, #f7931e 0%, #ff6b35 100%)',
              },
            }}
          >
            Lưu
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Customer Modal */}
      <Dialog 
        open={openDeleteModal} 
        onClose={handleCloseDeleteModal}
        PaperProps={{
          sx: {
            background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
            color: 'white',
            borderRadius: 3,
            border: '1px solid rgba(255, 107, 53, 0.3)',
          }
        }}
      >
        <DialogTitle sx={{
          color: '#ff4757',
          fontWeight: 'bold',
          fontSize: 20,
          borderBottom: '1px solid rgba(255, 71, 87, 0.2)',
        }}>
          Xác nhận xóa
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <Typography sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
            Bạn có chắc muốn xóa khách hàng {selectedCustomer?.name}?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button 
            onClick={handleCloseDeleteModal}
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
            onClick={handleDeleteCustomer} 
            variant="contained"
            sx={{
              background: 'linear-gradient(45deg, #ff4757 0%, #ff3742 100%)',
              '&:hover': {
                background: 'linear-gradient(45deg, #ff3742 0%, #ff4757 100%)',
              },
            }}
          >
            Xóa
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
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity} 
          sx={{ 
            width: "100%",
            background: snackbar.severity === 'success' 
              ? 'linear-gradient(45deg, #4caf50 0%, #45a049 100%)'
              : 'linear-gradient(45deg, #f44336 0%, #d32f2f 100%)',
            color: 'white',
            '& .MuiAlert-icon': {
              color: 'white',
            },
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* Error message */}
      {error && (
        <Alert 
          severity="error" 
          sx={{ 
            mt: 2,
            background: 'linear-gradient(45deg, #f44336 0%, #d32f2f 100%)',
            color: 'white',
            '& .MuiAlert-icon': {
              color: 'white',
            },
          }}
        >
          {error}
        </Alert>
      )}
    </Box>
  );
}
