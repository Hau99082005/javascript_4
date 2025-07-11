"use client";
import React, { useEffect, useState } from "react";
import {
  Box, Button, TextField, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, IconButton, Dialog, DialogTitle, DialogContent,
  DialogActions, Snackbar, Alert, CircularProgress,
    TablePagination,
  InputAdornment
 } from "@mui/material";
import { Delete, Add, Edit, Search, Category } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { addUnit, fetchUnits, deleteUnit, Unit, updateUnit } from "@/reduxslice/UnitsSlice";
import { AppDispatch } from "@/app/store";

export default function AllUnits() {  
  const dispatch = useDispatch<AppDispatch>();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { units, loading, error } = useSelector((state: any) => state.units);

  const [openAddModal, setOpenAddModal] = useState(false);
  const [newUnitName, setNewUnitName] = useState("");
  const [filter, setFilter] = useState("");
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });
  const [openEditModal, setOpenEditModal] = useState(false);
  const [editUnitName, setEditUnitName] = useState("");
  const [editUnitSymbol, setEditUnitSymbol] = useState("");
  const [newUnitSymbol, setNewUnitSymbol] = useState("");

  useEffect(() => {
    dispatch(fetchUnits());
  }, [dispatch]);

  const handleOpenAddModal = () => setOpenAddModal(true);
  const handleCloseAddModal = () => setOpenAddModal(false);

  const handleOpenDeleteModal = (unit: Unit) => {
    setSelectedUnit(unit);
    setOpenDeleteModal(true);
  };
  const handleCloseDeleteModal = () => setOpenDeleteModal(false);

  const handleCloseSnackbar = () => setSnackbar({ ...snackbar, open: false });

  const handleOpenEditModal = (unit: Unit) => {
    setEditUnitName(unit.name);
    setEditUnitSymbol(unit.symbol || "");
    setSelectedUnit(unit);
    setOpenEditModal(true);
  };
  const handleCloseEditModal = () => setOpenEditModal(false);

  const handleAddUnit = () => {
    // Kiểm tra trùng tên trên frontend (không phân biệt hoa thường, loại bỏ khoảng trắng)
    const nameExists = (units ?? []).some(
      (unit: Unit) => unit.name.trim().toLowerCase() === newUnitName.trim().toLowerCase()
    );
    if (nameExists) {
      setSnackbar({ open: true, message: "Tên đơn vị đã tồn tại", severity: "error" });
      return;
    }
    if (!newUnitName.trim() || !newUnitSymbol.trim()) return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    dispatch(addUnit({ name: newUnitName, symbol: newUnitSymbol }) as any)
      .unwrap()
      .then(() => {
        setSnackbar({ open: true, message: "Thêm đơn vị thành công!", severity: "success" });
        setNewUnitName("");
        setNewUnitSymbol("");
        handleCloseAddModal();
      })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .catch((error: any) => {
        // Nếu backend trả về lỗi object, lấy message phù hợp
        const message =
          typeof error === "object" && error?.error
            ? error.error
            : `Lỗi: ${error}`;
        setSnackbar({ open: true, message, severity: "error" });
      });
  };

  const handleDeleteUnit = () => {
    if (!selectedUnit) return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    dispatch(deleteUnit(selectedUnit._id) as any)
      .unwrap()
      .then(() => {
        setSnackbar({ open: true, message: "Xoá đơn vị thành công!", severity: "success" });
        handleCloseDeleteModal();
      })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .catch((error: any) => {
        setSnackbar({ open: true, message: `Lỗi: ${error}`, severity: "error" });
        console.log("Xoá đơn vị thất bại", selectedUnit, error);
      });
  };
 
  const handleEditUnit = () => {
    if (!selectedUnit || !editUnitName.trim() || !editUnitSymbol.trim()) return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    dispatch(updateUnit({ id: selectedUnit._id, name: editUnitName, symbol: editUnitSymbol }) as any)
      .unwrap()
      .then(() => {
        setSnackbar({ open: true, message: "Cập nhật đơn vị thành công!", severity: "success" });
        setOpenEditModal(false);
      })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .catch((error: any) => {
        setSnackbar({ open: true, message: `Lỗi: ${error}`, severity: "error" });
      });
  };

  const filteredUnits = (units ?? []).filter((unit: Unit) =>
    (unit?.name ?? '').toLowerCase().includes(filter.toLowerCase())
  );

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilter(e.target.value);
  };

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

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
      <Box sx={{ textAlign: "center", mb: 4, pt: 2 }}>
        <Box sx={{ display: "inline-block", mb: 1 }}>
          <Category sx={{ color: '#ff6b35', fontSize: 40 }} />
        </Box>
        <Typography
          variant="h6"
          sx={{ color: "rgba(255, 255, 255, 0.85)", fontWeight: 400 }}
        >
      Quản Lý Đơn vị cho Thiết bị điện bị
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
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 4 }}>
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
            <Category sx={{ color: 'white', fontSize: 28 }} />
          </Box>
          <Typography
            variant="h4"
            sx={{
              color: '#ff6b35',
              fontWeight: 'bold',
              textShadow: '1px 1px 2px rgba(255, 107, 53, 0.3)',
            }}
          >
            Đơn vị sản phẩm điện tử
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
            placeholder="Tìm kiếm đơn vị..."
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
         Thêm đơn vị
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
                      Tên đơn vị
                    </TableCell>
                     <TableCell sx={{
                      color: 'white',
                      fontWeight: 'bold',
                      fontSize: 16,
                      py: 2,
                    }}>
                      Kí hiệu đơn vị
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
                  {filteredUnits.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((unit: Unit, idx: number) => (
                    <TableRow
                      key={unit._id}
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
                        {unit.name}
                      </TableCell>
                       <TableCell sx={{
                        color: 'white',
                        fontSize: 16,
                        py: 2,
                      }}>
                        {unit.symbol}
                      </TableCell>
                      <TableCell align="right" sx={{ py: 2 }}>
                        <IconButton
                          onClick={() => handleOpenEditModal(unit)}
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
                          onClick={() => handleOpenDeleteModal(unit)}
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
                  {filteredUnits.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} align="center" sx={{
                        color: 'rgba(255, 255, 255, 0.6)',
                        py: 4,
                        fontSize: 16,
                      }}>
                        Không có đơn vị nào.
                      </TableCell>
                    </TableRow>
                  )}
          </TableBody>
              </Table>
            </TableContainer>

            {/* Pagination */}
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
              <TablePagination
                component="div"
                count={filteredUnits.length}
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

      {/* Add Unit Modal */}
      <Dialog 
        open={openAddModal} 
        onClose={handleCloseAddModal}
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
          color: '#ff6b35',
          fontWeight: 'bold',
          fontSize: 20,
          borderBottom: '1px solid rgba(255, 107, 53, 0.2)',
        }}>
          Thêm đơn vị mới
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <TextField
            autoFocus
            margin="dense"
            label="Tên đơn vị"
            fullWidth
            value={newUnitName}
            onChange={(e) => setNewUnitName(e.target.value)}
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
            label="Ký hiệu đơn vị"
            fullWidth
            value={newUnitSymbol}
            onChange={(e) => setNewUnitSymbol(e.target.value)}
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
            onClick={handleAddUnit} 
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

      {/* Edit Unit Modal */}
      <Dialog 
        open={openEditModal} 
        onClose={handleCloseEditModal}
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
          color: '#ff6b35',
          fontWeight: 'bold',
          fontSize: 20,
          borderBottom: '1px solid rgba(255, 107, 53, 0.2)',
        }}>
          Sửa đơn vị
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <TextField
            autoFocus
            margin="dense"
            label="Tên đơn vị mới"
            fullWidth
            value={editUnitName}
            onChange={(e) => setEditUnitName(e.target.value)}
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
            label="Ký hiệu đơn vị mới"
            fullWidth
            value={editUnitSymbol}
            onChange={(e) => setEditUnitSymbol(e.target.value)}
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
            onClick={handleEditUnit} 
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

      {/* Delete Unit Modal */}
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
            Bạn có chắc muốn xóa đơn vị {selectedUnit?.name}?
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
            onClick={handleDeleteUnit} 
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