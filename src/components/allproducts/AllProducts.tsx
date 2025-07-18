"use client";
import React, {useState, useEffect} from "react";
import { useDispatch, useSelector } from "react-redux";
import { Box, Button, TextField, Typography, IconButton, Table, TableBody, TableCell,
    TableContainer, TableRow, TablePagination, Paper, Modal, Snackbar, Alert, 
    MenuItem, Select, InputLabel, FormControl,
    TableHead, Dialog, DialogTitle, DialogContent, DialogActions, Switch, InputAdornment, ToggleButton, ToggleButtonGroup
 } from "@mui/material";

 import { fetchUnits } from "@/reduxslice/UnitsSlice";
 import { fetchCategories } from "@/reduxslice/categorySlice";
 import { fetchSuppliers } from "@/reduxslice/supplierSlice";
 import { addProduct, fetchProducts, Product, deleteProduct } from "@/reduxslice/productSlice";

import { Edit, Add, Delete } from "@mui/icons-material";
import { CircularProgress } from "@mui/material";
import { AppDispatch } from "@/app/store";
import Search from '@mui/icons-material/Search';
import Technology from "../nav/Technology";
import Image from "next/image";

// Define types for the Redux state
interface RootState {
  products: {
    products: Product[];
    loading: boolean;
    error: string | null;
  };
  categories: {
    categories: Array<{_id: string; name: string}>;
  };
  units: {
    units: Array<{_id: string; name: string}>;
  };
  suppliers: {
    suppliers: Array<{_id: string; name: string}>;
  };
}

export default function AllProducts() {
    const { products, loading, error } = useSelector((state: RootState) => state.products);
    const [openAddModal, setOpenAddModal]= useState(false);
    const [openEditModal, setOpenEditModal] = useState(false);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [editProduct, setEditProduct] = useState({
        productName: "",
        description: "",
        price: "",
        oldPrice: "",
        quantity: "",
        image: "",
        gallery: "",
        brand: "",
        model: "",
        warranty: "",
        specs: "",
        slug: "",
        status: "",
        isFeatured: "",
        unitNameId: "",
        categoryNameId: "",
        supplierNameId: "",
    })
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

    const [page, setPage] = useState(0);
    const dispatch = useDispatch<AppDispatch>();
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "success" as "success" | "error",
      })
    const {categories} = useSelector((state: RootState) => state.categories);
    const {units} = useSelector((state: RootState) => state.units);
    const {suppliers} = useSelector((state: RootState) => state.suppliers);
    const [newProduct, setNewProduct] = useState({
        productName: "",
        description: "",
        price: "",
        oldPrice: "",
        quantity: "",
        image: "",
        gallery: "",
        brand: "",
        model: "",
        warranty: "",
        specs: "",
        slug: "",
        status: "",
        isFeatured: "",
        unitNameId: "",
        categoryNameId: "",
        supplierNameId: "",
    })
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [galleryPreview, setGalleryPreview] = useState<string[]>([]);

    console.log({ categories, units, suppliers});

    const handleOpenDeleteModal=(product: Product) => {
        setSelectedProduct(product)
        setOpenDeleteModal(true)
    }
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const handleChangePage = (_event: unknown, newPage: number) => {
        setPage(newPage);
    };
    const handleChangeRowsPerPage = (event: { target: { value: string; }; }) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleCloseEditModal = () => setOpenEditModal(false);

    useEffect(() => {
     dispatch(fetchUnits())
     dispatch(fetchProducts())

     dispatch(fetchSuppliers())
     dispatch(fetchCategories())
    }, [dispatch])
    
    const handleCloseAddModal = () => {
        setOpenAddModal(false);
    }
    const handleOpenAddModal = () => {
        setOpenAddModal(true);
    }

    const handleOpenEditModal = (product: Product) => {
        setEditProduct({
            productName: product.productName || "",
            description: product.description || "",
            price: product.price?.toString() || "",
            oldPrice: product.oldPrice?.toString() || "",
            quantity: product.quantity?.toString() || "",
            image: product.image || "",
            gallery: product.gallery || "",
            brand: product.brand || "",
            model: product.model || "",
            warranty: product.warranty || "",
            specs: JSON.stringify(product.specs) || "",
            slug: product.slug || "",
            status: product.status?.toString() || "",
            isFeatured: product.isFeatured?.toString() || "",
            unitNameId: product.unitNameId || "",
            categoryNameId: product.categoryNameId || "",
            supplierNameId: product.supplierNameId || "",
        })
        setSelectedProduct(product);
        setOpenEditModal(true);
        
    }

    const handleDeleteProduct = () => {
        if (!selectedProduct) return;
        
        dispatch(deleteProduct(selectedProduct._id))
        .unwrap()
        .then(() => {
            handleCloseDeleteModal()
            dispatch(fetchProducts())
            setSnackbar({open: true, message: "Xoá sản phẩm thành công!", severity: "success"});
        })
        .catch((error: unknown) => {
           setSnackbar({open: true, message: `Lỗi: ${error}`, severity: "error"});
        })
    }

    const handleAddProduct = () => {
      if (!newProduct.brand) {
        setSnackbar({open: true, message: "Vui lòng nhập thương hiệu!", severity: "error"});
        return;
      }
      if (!newProduct.unitNameId || !newProduct.categoryNameId) {
        setSnackbar({open: true, message: "Vui lòng chọn đơn vị và danh mục!", severity: "error"});
        return;
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let specsValue: any = newProduct.specs;
      let parsed = false;
      try {
        specsValue = JSON.parse(newProduct.specs);
        parsed = true;
      } catch {}
      if (!parsed) {
        // Parse lines like 'key: value' into object
        const lines = newProduct.specs.split('\n').map(l => l.trim()).filter(Boolean);
        const obj: Record<string, string> = {};
        for (const line of lines) {
          const idx = line.indexOf(':');
          if (idx > 0) {
            const key = line.slice(0, idx).trim();
            const value = line.slice(idx + 1).trim();
            if (key) obj[key] = value;
          }
        }
        if (Object.keys(obj).length === 0) {
          setSnackbar({open: true, message: "Thông số kỹ thuật phải là JSON hợp lệ hoặc từng dòng 'key: value'!", severity: "error"});
          return;
        }
        specsValue = obj;
      }
      const productToSubmit = {
        ...newProduct,
        specs: specsValue,
        status: String(newProduct.status) === 'true',
        isFeatured: String(newProduct.isFeatured) === 'true',
      };
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      dispatch(addProduct(productToSubmit as any))
        .unwrap()
        .then(() => {
            setSnackbar({open: true, message: "Thêm sản phẩm thành công!", severity: "success"});
          handleCloseAddModal();
        })
        .catch((error: unknown)=> {
            setSnackbar({open: true, message: `Thêm sản phẩm thất bại! ${error}`, severity: "error"});
        });
    };

    const handleCloseSnackbar= () => {
        setSnackbar({...snackbar, open: false});
    }

    const handleCloseDeleteModal = () => setOpenDeleteModal(false);

    const modalStyle = {
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: 800,
        bgcolor: "#000",
        boxShadow: 25,
        p: 4,
        color: "white",
    };
    const modalBackdropStyle = {
       backdropFilter: "blur(5px)",
    };

    // Upload ảnh đơn lên Cloudinary
    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'unsigned_preset'); // Thay bằng preset của bạn
      const res = await fetch(`https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/upload`, {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      setImagePreview(data.secure_url);
      setNewProduct({ ...newProduct, image: data.secure_url });
    };
    // Upload nhiều ảnh lên Cloudinary
    const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (!files) return;
      const urls: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const formData = new FormData();
        formData.append('file', files[i]);
        formData.append('upload_preset', 'unsigned_preset');
        const res = await fetch(`https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/upload`, {
          method: 'POST',
          body: formData,
        });
        const data = await res.json();
        urls.push(data.secure_url);
      }
      setGalleryPreview(urls);
      setNewProduct({ ...newProduct, gallery: urls.join(',') });
    };

    // Add a slugify function
    function slugify(str: string) {
      return str
        .toLowerCase()
        .normalize('NFD')
        .replace(/\p{Diacritic}/gu, '') // remove accents
        .replace(/[^a-z0-9\s-]/g, '') // remove special chars
        .replace(/\s+/g, '-') // spaces to dash
        .replace(/-+/g, '-') // collapse dashes
        .replace(/^-+|-+$/g, ''); // trim dashes
    }

    return (
  <Box sx={{
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f4c75 100%)',
    p: 3,
  }}>
    <Box sx={{ textAlign: 'center', mb: 4, pt: 2 }}>
      <Box sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        mb: 2,
      }}>
        <Box sx={{
          px: 3,
          py: 1,
          borderRadius: 3,
          background: 'rgba(255,255,255,0.08)',
          boxShadow: '0 0 24px 4px #00e6ff44',
          display: 'inline-block',
          fontSize: 56,
          filter: 'drop-shadow(0 0 8px #00e6ff)',
        }}>
          <Technology />
        </Box>
      </Box>
      <Typography
        variant="h4"
        sx={{
          color: '#ff6b35',
          fontWeight: 'bold',
          textShadow: '1px 1px 2px rgba(255, 107, 53, 0.3)',
        }}
      >
        Danh Sách Sản Phẩm Điện Tử
      </Typography>
      <Typography
        variant="h6"
        sx={{
          color: 'rgba(255, 255, 255, 0.85)',
          fontWeight: 400,
        }}
      >
        Quản lý sản phẩm hiệu quả
      </Typography>
    </Box>
    <Box sx={{
      maxWidth: '100%',
      width: 1400,
      mx: 'auto',
      background: 'rgba(255, 255, 255, 0.05)',
      borderRadius: 3,
      p: 4,
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255, 107, 53, 0.2)',
      boxShadow: '0 8px 32px rgba(255, 107, 53, 0.1)',
      overflowX: 'auto',
    }}>
      {/* Search and Add Button */}
      <Box sx={{
        display: 'flex',
        gap: 2,
        mb: 3,
        flexDirection: { xs: 'column', md: 'row' },
      }}>
        <TextField
          fullWidth
          placeholder="Tìm kiếm sản phẩm..."
          // value={filter} // implement filter state if needed
          // onChange={handleFilterChange}
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
              '::placeholder': {
                color: 'rgba(255,255,255,0.6)',
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
          Thêm sản phẩm
        </Button>
      </Box>
      {/* Table */}
      <TableContainer component={Paper} sx={{
        borderRadius: 2,
        background: 'rgba(255, 255, 255, 0.08)',
        backdropFilter: 'blur(5px)',
        border: '1px solid rgba(255, 107, 53, 0.2)',
        overflow: 'auto',
        width: '100%',
        minWidth: 1200,
      }}>
        <Table>
          <TableHead>
            <TableRow sx={{ background: 'linear-gradient(90deg, #ff6b35 0%, #f7931e 100%)' }}>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>STT</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Ảnh</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Tên sản phẩm</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Giá</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Số lượng</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Thương hiệu</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Trạng thái</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Thao tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell sx={{ color: 'white' }} colSpan={8}>
                  <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center"}}>
                    <CircularProgress/>
                    <Typography sx={{ ml: 2, color: 'white'}}>Loading...</Typography>
                  </Box>
                </TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell sx={{ color: 'white' }} colSpan={8}>Lỗi: {error}</TableCell>
              </TableRow>
            ) : (
              products.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((product: Product, idx: number) => (
                <TableRow key={product._id} style={{ borderBottom: "2px solid #000"}}>
                  <TableCell sx={{ color: 'white' }}>{page * rowsPerPage + idx + 1}</TableCell>
                  <TableCell sx={{ color: 'white' }}>
                    {product?.image ? (
                      <Image src={product.image} alt={product.productName} width={60} height={60} style={{ borderRadius: 8, objectFit: 'cover' }} />
                    ) : (
                      <Box sx={{ width: 60, height: 60, bgcolor: 'grey.800', borderRadius: 8 }} />
                    )}
                  </TableCell>
                  <TableCell sx={{ color: 'white' }}>{product?.productName}</TableCell>
                  <TableCell sx={{ color: 'white' }}>{product?.price?.toLocaleString('vi-VN')}₫</TableCell>
                  <TableCell sx={{ color: 'white' }}>{product?.quantity}</TableCell>
                  <TableCell sx={{ color: 'white' }}>{product?.brand}</TableCell>
                  <TableCell sx={{ color: 'white' }}>
                    <Box sx={{
                      display: 'inline-block',
                      px: 2,
                      py: 0.5,
                      borderRadius: 2,
                      fontWeight: 700,
                      fontSize: 13,
                      background: product.status ? 'linear-gradient(45deg, #4caf50 0%, #43e97b 100%)' : 'linear-gradient(45deg, #ff4757 0%, #ff6b35 100%)',
                      color: 'white',
                    }}>
                      {product.status ? 'Còn hàng' : 'Hết hàng'}
                    </Box>
                  </TableCell>
                  <TableCell sx={{ color: 'white' }}>
                    <IconButton onClick={() => handleOpenEditModal(product)}>
                      <Edit/>
                    </IconButton>
                    <IconButton onClick={() => handleOpenDeleteModal(product)}>
                      <Delete sx={{color: "orangered"}}/>
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={products.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>
      {/* Dialogs for Add/Edit/Delete, styled as in AllCategory */}
      <Dialog
          open={openAddModal}
          onClose={handleCloseAddModal}
        sx={modalBackdropStyle}
      >
        <DialogTitle sx={{ color: 'black' }}>Thêm Sản Phẩm</DialogTitle>
        <DialogContent>
               <TextField
               fullWidth
               label="Tên Sản Phẩm"
               variant="outlined"
               value={newProduct.productName}
            onChange={(e) => {
              setNewProduct({
                ...newProduct,
                productName: e.target.value,
                slug: slugify(e.target.value),
              });
            }}
               InputLabelProps={{
              style: { color: 'black' }
               }}
               sx={{
                mt: 2,
              input: { color: 'black' },
                '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                        borderColor: 'orangered',
                    },
                    '&:hover fieldset': {
                        borderColor: 'orangered',
                    },
                    '&.Mui-focused fieldset': {
                        borderColor: 'orangered',
                    },
                },
               }}
               />
               <TextField
               fullWidth
               label="Mô Tả"
               variant="outlined"
               value={newProduct.description}
               onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
               InputLabelProps={{
              style: { color: 'black' }
               }}
               sx={{
                mt: 2,
              input: { color: 'black' },
                '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                        borderColor: 'orangered',
                    },
                    '&:hover fieldset': {
                        borderColor: 'orangered',
                    },
                    '&.Mui-focused fieldset': {
                        borderColor: 'orangered',
                    },
                },
               }}
               />
            <TextField
               fullWidth
               label="Gía"
               variant="outlined"
               value={newProduct.price}
               onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
               InputLabelProps={{
              style: { color: 'black' }
               }}
               sx={{
                mt: 2,
              input: { color: 'black' },
                '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                        borderColor: 'orangered',
                    },
                    '&:hover fieldset': {
                        borderColor: 'orangered',
                    },
                    '&.Mui-focused fieldset': {
                        borderColor: 'orangered',
                    },
                },
               }}
            />
            <TextField
               fullWidth
               label="Gía cũ"
               variant="outlined"
               value={newProduct.oldPrice}
               onChange={(e) => setNewProduct({...newProduct, oldPrice: e.target.value})}
               InputLabelProps={{
              style: { color: 'black' }
               }}
               sx={{
                mt: 2,
              input: { color: 'black' },
                '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                        borderColor: 'orangered',
                    },
                    '&:hover fieldset': {
                        borderColor: 'orangered',
                    },
                    '&.Mui-focused fieldset': {
                        borderColor: 'orangered',
                    },
                },
               }}
            />
             <TextField
               fullWidth
               label="Số lượng"
               variant="outlined"
               value={newProduct.quantity}
               onChange={(e) => setNewProduct({...newProduct, quantity: e.target.value})}
               InputLabelProps={{
              style: { color: 'black' }
               }}
               sx={{
                mt: 2,
              input: { color: 'black' },
                '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                        borderColor: 'orangered',
                    },
                    '&:hover fieldset': {
                        borderColor: 'orangered',
                    },
                    '&.Mui-focused fieldset': {
                        borderColor: 'orangered',
                    },
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
              Tải ảnh lên
               <input 
              type="file" 
              hidden 
              accept="image/*" 
              onChange={handleImageUpload}
            />
               </Button>
          {imagePreview && (
            <Box sx={{ mt: 1 }}>
              <Image width={100} height={100} src={imagePreview} alt="preview" style={{ width: 100, borderRadius: 8 }} />
            </Box>
          )}
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
              Nhiều ảnh khác
               <input 
              type="file" 
              hidden 
              accept="image/*" 
              multiple
              onChange={handleGalleryUpload}
            />
               </Button>
          {galleryPreview.length > 0 && (
            <Box sx={{ display: 'flex', gap: 1, mt: 1, flexWrap: 'wrap' }}>
              {galleryPreview.map((url, idx) => (
                <Image width={100} height={100} key={idx} src={url} alt="gallery" style={{ width: 60, borderRadius: 6 }} />
              ))}
            </Box>
          )}
               <TextField
               fullWidth
               label="Thương hiệu"
               variant="outlined"
               value={newProduct.brand}
               onChange={(e) => setNewProduct({...newProduct, brand: e.target.value})}
               InputLabelProps={{
              style: { color: 'black' }
               }}
               sx={{
                mt: 2,
              input: { color: 'black' },
                '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                        borderColor: 'orangered',
                    },
                    '&:hover fieldset': {
                        borderColor: 'orangered',
                    },
                    '&.Mui-focused fieldset': {
                        borderColor: 'orangered',
                    },
                },
               }}
            />
             <TextField
               fullWidth
               label="Mã sản phẩm"
               variant="outlined"
               value={newProduct.model}
               onChange={(e) => setNewProduct({...newProduct, model: e.target.value})}
               InputLabelProps={{
              style: { color: 'black' }
               }}
               sx={{
                mt: 2,
              input: { color: 'black' },
                '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                        borderColor: 'orangered',
                    },
                    '&:hover fieldset': {
                        borderColor: 'orangered',
                    },
                    '&.Mui-focused fieldset': {
                        borderColor: 'orangered',
                    },
                },
               }}
            />
            <TextField
               fullWidth
               label="Bảo hành"
               variant="outlined"
               value={newProduct.warranty}
               onChange={(e) => setNewProduct({...newProduct, warranty: e.target.value})}
               InputLabelProps={{
              style: { color: 'black' }
               }}
               sx={{
                mt: 2,
              input: { color: 'black' },
                '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                        borderColor: 'orangered',
                    },
                    '&:hover fieldset': {
                        borderColor: 'orangered',
                    },
                    '&.Mui-focused fieldset': {
                        borderColor: 'orangered',
                    },
                },
               }}
            />
            <TextField
               fullWidth
               label="Thông số kỹ thuật"
               variant="outlined"
               value={newProduct.specs}
               onChange={(e) => setNewProduct({...newProduct, specs: e.target.value})}
               InputLabelProps={{
              style: { color: 'black' }
               }}
               sx={{
                mt: 2,
              input: { color: 'black' },
                '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                        borderColor: 'orangered',
                    },
                    '&:hover fieldset': {
                        borderColor: 'orangered',
                    },
                    '&.Mui-focused fieldset': {
                        borderColor: 'orangered',
                    },
                },
               }}
            />
          {/* Trạng Thái: ToggleButtonGroup Còn hàng / Hết hàng */}
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 2, mb: 2, justifyContent: 'center' }}>
            <ToggleButtonGroup
              value={String(newProduct.status) === 'true' ? 'available' : 'out'}
              exclusive
              onChange={(_e, value) => {
                if (value !== null) setNewProduct({ ...newProduct, status: value === 'available' ? 'true' : 'false' });
              }}
               sx={{
                background: 'rgba(255,255,255,0.08)',
                borderRadius: 2,
                boxShadow: '0 2px 8px rgba(255,107,53,0.08)',
                p: 0.5,
              }}
            >
              <ToggleButton
                value="available"
                sx={{
                  color: String(newProduct.status) === 'true' ? 'white' : '#ff6b35',
                  background: String(newProduct.status) === 'true' ? 'linear-gradient(45deg, #4caf50 0%, #43e97b 100%)' : 'none',
                  fontWeight: 700,
                  fontSize: 16,
                  borderRadius: 2,
                  px: 3,
                  mx: 1,
                  '&.Mui-selected': {
                    color: 'white',
                    background: 'linear-gradient(45deg, #4caf50 0%, #43e97b 100%)',
                  },
                }}
              >
                Còn hàng
              </ToggleButton>
              <ToggleButton
                value="out"
               sx={{
                  color: String(newProduct.status) === 'false' ? 'white' : '#ff6b35',
                  background: String(newProduct.status) === 'false' ? 'linear-gradient(45deg, #ff4757 0%, #ff6b35 100%)' : 'none',
                  fontWeight: 700,
                  fontSize: 16,
                  borderRadius: 2,
                  px: 3,
                  mx: 1,
                  '&.Mui-selected': {
                    color: 'white',
                    background: 'linear-gradient(45deg, #ff4757 0%, #ff6b35 100%)',
                  },
                }}
              >
                Hết hàng
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>
          <Switch
            checked={newProduct.isFeatured === 'true'}
            onChange={(e) => setNewProduct({...newProduct, isFeatured: e.target.checked ? 'true' : 'false'})}
            inputProps={{ 'aria-label': 'is featured' }}
               sx={{
                mt: 2,
              '& .MuiSwitch-thumb': {
                backgroundColor: 'orangered',
              },
              '& .MuiSwitch-track': {
                backgroundColor: 'rgba(255, 255, 255, 0.3)',
              },
              '& .MuiSwitch-switchBase.Mui-checked': {
                color: 'orangered',
              },
              '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                backgroundColor: 'orangered',
                },
               }}
            />
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel sx={{ color: 'black' }}>Tên Nhà Cung Cấp</InputLabel>
                  <Select 
                  value={newProduct.supplierNameId}
                  onChange={(e) => setNewProduct({...newProduct, supplierNameId: e.target.value})}
              sx={{
                mt: 3,
                color: 'black',
                    '.MuiOutlinedInput-notchedOutline': {
                        borderColor: 'orangered',
                    },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'orangered',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'orangered',
                    },
                    '.MuiSvgIcon-root': {
                  fill: 'black !important',
                },
                '.MuiSelect-select': {
                  color: 'black',
                },
              }}
            >
              {
                suppliers && suppliers?.map((name, index) => (
                        <MenuItem
                         key={index} 
                         value={name._id}
                        >
                        {name.name}
                        </MenuItem>
                    ))
                    }
                  </Select>
               </FormControl>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel sx={{ color: 'black' }}>Tên Đơn Vị</InputLabel>
                  <Select 
                  value={newProduct.unitNameId}
              onChange={(e) => setNewProduct({...newProduct, unitNameId: e.target.value})}
              sx={{
                mt: 3,
                color: 'black',
                    '.MuiOutlinedInput-notchedOutline': {
                        borderColor: 'orangered',
                    },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'orangered',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'orangered',
                    },
                    '.MuiSvgIcon-root': {
                  fill: 'black !important',
                },
                '.MuiSelect-select': {
                  color: 'black',
                },
              }}
            >
              {
                units && units?.map((name, index) => (
                        <MenuItem
                         key={index} 
                         value={name._id}
                        >
                        {name.name}
                        </MenuItem>
                    ))
                    }
                  </Select>
               </FormControl>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel sx={{ color: 'black' }}>Tên Danh Mục</InputLabel>
                  <Select 
                  value={newProduct.categoryNameId}
                  onChange={(e) => setNewProduct({...newProduct, categoryNameId: e.target.value})}
              sx={{
                mt: 3,
                color: 'black',
                    '.MuiOutlinedInput-notchedOutline': {
                        borderColor: 'orangered',
                    },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'orangered',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'orangered',
                    },
                    '.MuiSvgIcon-root': {
                  fill: 'black !important',
                },
                '.MuiSelect-select': {
                  color: 'black',
                },
              }}
            >
              {
                categories && categories?.map((name, index) => (
                        <MenuItem
                         key={index} 
                         value={name._id}
                        >
                        {name.name}
                        </MenuItem>
                    ))
                    }
                  </Select>
               </FormControl>
        </DialogContent>
        <DialogActions>
               <Button
               variant="outlined"
            onClick={handleCloseAddModal}
            sx={{
              color: "orangered",
              ':hover': {
                backgroundColor: "orangered",
              },
            }}
          >
            Hủy
          </Button>
          <Button
            variant="contained"
               onClick={handleAddProduct}
               sx={{
                background: "orangered",
                ':hover': {
                    background: "orangered",
                },
            }}
          >
                Thêm
               </Button>
        </DialogActions>
      </Dialog>
      <Dialog
     open={openEditModal}
     onClose={handleCloseEditModal}
        sx={modalBackdropStyle}
      >
        <DialogTitle sx={{ color: 'black' }}>Sửa Sản Phẩm</DialogTitle>
        <DialogContent>
       <TextField
       fullWidth
       label="Tên sản phẩm"
       variant="outlined"
            value={editProduct.productName}
            onChange={(e) => setEditProduct({...editProduct, productName: e.target.value})}
       InputLabelProps={{
              style: { color: 'black' }
       }}
       sx={{
        mt: 2,
              input: { color: 'black' },
        '& .MuiOutlinedInput-root': {
            borderColor: "orange",
        },
        "&:hover fieldset": {
            borderColor: "orange",
        },
        "&.Mui-focused fieldset": {
            borderColor: "orangered",
        },
       }}
       />
       <TextField
       fullWidth
       label="Mô Tả"
       variant="outlined"
            value={editProduct.description}
            onChange={(e) => setEditProduct({...editProduct, description: e.target.value})}
       InputLabelProps={{
              style: { color: 'black' }
       }}
       sx={{
        mt: 2,
              input: { color: 'black' },
        '& .MuiOutlinedInput-root': {
            borderColor: "orange",
        },
        "&:hover fieldset": {
            borderColor: "orange",
        },
        "&.Mui-focused fieldset": {
            borderColor: "orangered",
        },
       }}
       />
       <TextField
       fullWidth
       label="Giá"
       variant="outlined"
            value={editProduct.price}
            onChange={(e) => setEditProduct({...editProduct, price: e.target.value})}
       InputLabelProps={{
              style: { color: 'black' }
       }}
       sx={{
        mt: 2,
              input: { color: 'black' },
        '& .MuiOutlinedInput-root': {
            borderColor: "orange",
        },
        "&:hover fieldset": {
            borderColor: "orange",
        },
        "&.Mui-focused fieldset": {
            borderColor: "orangered",
        },
       }}
       />
       <TextField
       fullWidth
       label="Giá cũ"
       variant="outlined"
            value={editProduct.oldPrice}
            onChange={(e) => setEditProduct({...editProduct, oldPrice: e.target.value})}
       InputLabelProps={{
              style: { color: 'black' }
       }}
       sx={{
        mt: 2,
              input: { color: 'black' },
        '& .MuiOutlinedInput-root': {
            borderColor: "orange",
        },
        "&:hover fieldset": {
            borderColor: "orange",
        },
        "&.Mui-focused fieldset": {
            borderColor: "orangered",
        },
       }}
       />
       <TextField
       fullWidth
       label="Số lượng"
       variant="outlined"
            value={editProduct.quantity}
            onChange={(e) => setEditProduct({...editProduct, quantity: e.target.value})}
       InputLabelProps={{
              style: { color: 'black' }
       }}
       sx={{
        mt: 2,
              input: { color: 'black' },
        '& .MuiOutlinedInput-root': {
            borderColor: "orange",
        },
        "&:hover fieldset": {
            borderColor: "orange",
        },
        "&.Mui-focused fieldset": {
            borderColor: "orangered",
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
              Tải ảnh lên
               <input 
              type="file" 
              hidden 
              accept="image/*" 
            />
               </Button>
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
              Nhiều ảnh khác
               <input 
              type="file" 
              hidden 
              accept="image/*" 
            />
               </Button>
            <TextField
               fullWidth
               label="Thương hiệu"
               variant="outlined"
            value={editProduct.brand}
            onChange={(e) => setEditProduct({...editProduct, brand: e.target.value})}
               InputLabelProps={{
              style: { color: 'black' }
               }}
               sx={{
                mt: 2,
              input: { color: 'black' },
                '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                        borderColor: 'orangered',
                    },
                    '&:hover fieldset': {
                        borderColor: 'orangered',
                    },
                    '&.Mui-focused fieldset': {
                        borderColor: 'orangered',
                    },
                },
               }}
            />
             <TextField
               fullWidth
               label="Mã sản phẩm"
               variant="outlined"
            value={editProduct.model}
            onChange={(e) => setEditProduct({...editProduct, model: e.target.value})}
               InputLabelProps={{
              style: { color: 'black' }
               }}
               sx={{
                mt: 2,
              input: { color: 'black' },
                '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                        borderColor: 'orangered',
                    },
                    '&:hover fieldset': {
                        borderColor: 'orangered',
                    },
                    '&.Mui-focused fieldset': {
                        borderColor: 'orangered',
                    },
                },
               }}
            />
            <TextField
               fullWidth
               label="Bảo hành"
               variant="outlined"
            value={editProduct.warranty}
            onChange={(e) => setEditProduct({...editProduct, warranty: e.target.value})}
               InputLabelProps={{
              style: { color: 'black' }
               }}
               sx={{
                mt: 2,
              input: { color: 'black' },
                '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                        borderColor: 'orangered',
                    },
                    '&:hover fieldset': {
                        borderColor: 'orangered',
                    },
                    '&.Mui-focused fieldset': {
                        borderColor: 'orangered',
                    },
                },
               }}
            />
            <TextField
               fullWidth
               label="Thông số kỹ thuật"
               variant="outlined"
            value={editProduct.specs}
            onChange={(e) => setEditProduct({...editProduct, specs: e.target.value})}
               InputLabelProps={{
              style: { color: 'black' }
               }}
               sx={{
                mt: 2,
              input: { color: 'black' },
                '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                        borderColor: 'orangered',
                    },
                    '&:hover fieldset': {
                        borderColor: 'orangered',
                    },
                    '&.Mui-focused fieldset': {
                        borderColor: 'orangered',
                    },
                },
               }}
            />
             <TextField
               fullWidth
               label="Slug"
               variant="outlined"
            value={editProduct.slug}
            onChange={(e) => setEditProduct({...editProduct, slug: e.target.value})}
               InputLabelProps={{
              style: { color: 'black' }
               }}
               sx={{
                mt: 2,
              input: { color: 'black' },
                '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                        borderColor: 'orangered',
                    },
                    '&:hover fieldset': {
                        borderColor: 'orangered',
                    },
                    '&.Mui-focused fieldset': {
                        borderColor: 'orangered',
                    },
                },
               }}
            />
               <TextField
               fullWidth
               label="Trạng Thái"
               variant="outlined"
            value={editProduct.status}
            onChange={(e) => setEditProduct({...editProduct, status: e.target.value})}
               InputLabelProps={{
              style: { color: 'black' }
               }}
               sx={{
                mt: 2,
              input: { color: 'black' },
                '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                        borderColor: 'orangered',
                    },
                    '&:hover fieldset': {
                        borderColor: 'orangered',
                    },
                    '&.Mui-focused fieldset': {
                        borderColor: 'orangered',
                    },
                },
               }}
            />
          <Switch
            checked={editProduct.isFeatured === 'true'}
            onChange={(e) => setEditProduct({...editProduct, isFeatured: e.target.checked ? 'true' : 'false'})}
            inputProps={{ 'aria-label': 'is featured' }}
               sx={{
                mt: 2,
              '& .MuiSwitch-thumb': {
                backgroundColor: 'orangered',
              },
              '& .MuiSwitch-track': {
                backgroundColor: 'rgba(255, 255, 255, 0.3)',
              },
              '& .MuiSwitch-switchBase.Mui-checked': {
                color: 'orangered',
              },
              '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                backgroundColor: 'orangered',
                },
               }}
            />
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel sx={{ color: 'black' }}>Tên nhà cung cấp</InputLabel>
             <Select 
              value={editProduct.supplierNameId}
              onChange={(e) => setEditProduct({...editProduct, supplierNameId: e.target.value})}
             sx={{
                mt: 3,
                color: "black",
                ".MuiOutlinedInput-notchedOutline": {
                    borderColor: "orangered",
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "orangered",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "orangered",
                },
                ".MuiSvgIcon-root": {
                  fill: "black !important",
                },
                ".MuiSelect-select": {
                  color: "black",
                },
              }}
            >
              {suppliers && suppliers?.map((name, index) => (
                <MenuItem key={index} value={name._id}>
                  {name.name}
                </MenuItem>
              ))}
             </Select>
            </FormControl>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel sx={{ color: 'black' }}>Tên đơn vị</InputLabel>
             <Select 
              value={editProduct.unitNameId}
              onChange={(e) => setEditProduct({...editProduct, unitNameId: e.target.value})}
             sx={{
                mt: 3,
                color: "black",
                ".MuiOutlinedInput-notchedOutline": {
                    borderColor: "orangered",
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "orangered",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "orangered",
                },
                ".MuiSvgIcon-root": {
                  fill: "black !important",
                },
                ".MuiSelect-select": {
                  color: "black",
                },
              }}
            >
              {units && units?.map((name, index) => (
                <MenuItem key={index} value={name._id}>
                  {name.name}
                </MenuItem>
              ))}
             </Select>
            </FormControl>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel sx={{ color: 'black' }}>Tên danh mục</InputLabel>
             <Select 
              value={editProduct.categoryNameId}
              onChange={(e) => setEditProduct({...editProduct, categoryNameId: e.target.value})}
             sx={{
                mt: 3,
                color: "black",
                ".MuiOutlinedInput-notchedOutline": {
                    borderColor: "orangered",
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "orangered",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "orangered",
                },
                ".MuiSvgIcon-root": {
                  fill: "black !important",
                },
                ".MuiSelect-select": {
                  color: "black",
                },
              }}
            >
              {categories && categories?.map((name, index) => (
                <MenuItem key={index} value={name._id}>
                  {name.name}
                </MenuItem>
              ))}
             </Select>
            </FormControl>
        </DialogContent>
        <DialogActions>
          <Button
            variant="outlined"
            onClick={handleCloseEditModal}
            sx={{
              color: "orangered",
              ':hover': {
                backgroundColor: "orangered",
              },
            }}
          >
            Hủy
          </Button>
          <Button
            variant="contained"
            onClick={() => handleAddProduct()} 
            sx={{
              background: "orangered",
              ':hover': {
                background: "orangered",
              },
            }}
          >
            Lưu
          </Button>
        </DialogActions>
      </Dialog>
     <Modal 
     open={openDeleteModal}
     onClose={handleCloseDeleteModal}
     sx={modalBackdropStyle}>
       <Box sx={modalStyle}>
          <Typography variant="h6" component="h2">
             Xoá sản phẩm {selectedProduct?.productName}
          </Typography>
          <Typography sx={{ mb: 2}}>
           Bạn có muốn xoá sản phẩm {selectedProduct?.productName} không?
          </Typography>
          <Button 
          onClick={handleDeleteProduct}
          variant="contained"
          sx={{color: "white",
            backgroundColor: "orange",
           ":hover": {
              color: "white",
              backgroundColor: "orangered",
           },
          }}>
           Xoá
          </Button>
       </Box>
     </Modal>
     <Snackbar 
    open={snackbar.open}
    onClose={handleCloseSnackbar}
     autoHideDuration={5000}>
       <Alert
       onClose={handleCloseSnackbar}
       severity={snackbar.severity}
       >{snackbar.message}</Alert>
     </Snackbar>
    </Box>
     </Box>
    );
}