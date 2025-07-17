"use client";
import { useEffect, useState } from "react";
import {
  Box, Button, TextField, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, IconButton, Dialog, DialogTitle, DialogContent,
  DialogActions, Snackbar, Alert, CircularProgress,
  TablePagination,
  InputAdornment
} from "@mui/material";
import { Delete, Add, Edit, Search, Person } from "@mui/icons-material";
import Technology from "../nav/Technology";

interface Customer {
  _id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  image?: string;
  status?: boolean;
}

export default function AllCustomers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
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
  const [newCustomer, setNewCustomer] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    image: "",
  });
  const [editCustomer, setEditCustomer] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    image: "",
  });

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/customers');
      if (response.ok) {
        const data = await response.json();
        setCustomers(data);
      } else {
        setError('Không thể tải danh sách khách hàng');
      }
    } catch (error: unknown) {
      setError('Lỗi kết nối');
      console.error('Error fetching customers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAddModal = () => setOpenAddModal(true);
  const handleCloseAddModal = () => {
    setOpenAddModal(false);
    setNewCustomer({ name: "", email: "", phone: "", address: "", image: "" });
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
    setOpenEditModal(true);
  };
  const handleCloseEditModal = () => setOpenEditModal(false);

  const handleOpenDeleteModal = (customer: Customer) => {
    setSelectedCustomer(customer);
    setOpenDeleteModal(true);
  };
  const handleCloseDeleteModal = () => setOpenDeleteModal(false);

  const handleCloseSnackbar = () => setSnackbar({ ...snackbar, open: false });

  const handleAddCustomer = async () => {
    if (!newCustomer.name.trim() || !newCustomer.email.trim()) {
      setSnackbar({ open: true, message: "Vui lòng nhập đầy đủ thông tin!", severity: "error" });
      return;
    }

    try {
      const response = await fetch('/api/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCustomer),
      });

      if (response.ok) {
        setSnackbar({ open: true, message: "Thêm khách hàng thành công!", severity: "success" });
        handleCloseAddModal();
        fetchCustomers();
      } else {
        const errorData = await response.json();
        setSnackbar({ open: true, message: `Lỗi: ${errorData.message}`, severity: "error" });
      }
    } catch (error: unknown) {
      setSnackbar({ open: true, message: "Lỗi kết nối", severity: "error" });
      console.error('Error adding customer:', error);
    }
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
        fetchCustomers();
      } else {
        const errorData = await response.json();
        setSnackbar({ open: true, message: `Lỗi: ${errorData.message}`, severity: "error" });
      }
    } catch (error: unknown) {
      setSnackbar({ open: true, message: "Lỗi kết nối", severity: "error" });
      console.error('Error editing customer:', error);
    }
  };

  const handleDeleteCustomer = async () => {
    if (!selectedCustomer) return;

    try {
      const response = await fetch(`/api/customers/${selectedCustomer._id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setSnackbar({ open: true, message: "Xóa khách hàng thành công!", severity: "success" });
        handleCloseDeleteModal();
        fetchCustomers();
      } else {
        const errorData = await response.json();
        setSnackbar({ open: true, message: `Lỗi: ${errorData.message}`, severity: "error" });
      }
    } catch (error: unknown) {
      setSnackbar({ open: true, message: "Lỗi kết nối", severity: "error" });
      console.error('Error deleting customer:', error);
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>, isEdit = false) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64 = e.target?.result as string;
        if (isEdit) {
          setEditCustomer({ ...editCustomer, image: base64 });
        } else {
          setNewCustomer({ ...newCustomer, image: base64 });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const filteredCustomers = customers.filter((customer) =>
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
                  {filteredCustomers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((customer, idx) => (
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
            label="Tên khách hàng"
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
            label="Số điện thoại"
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
            label="Địa chỉ"
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
            }}
          >
            Tải ảnh
            <input 
              type="file" 
              hidden 
              accept="image/*" 
              onChange={handleImageUpload}
            />
          </Button>
          {newCustomer.image && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 1 }}>
                Ảnh đã chọn:
              </Typography>
              <Box
                component="img"
                src={newCustomer.image}
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
              onChange={(e) => handleImageUpload(e, true)}
            />
          </Button>
          {editCustomer.image && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 1 }}>
                Ảnh hiện tại:
              </Typography>
              <Box
                component="img"
                src={editCustomer.image}
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
