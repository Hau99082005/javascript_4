"use client";
import { TextField, Button, Box, Modal, CircularProgress, Typography, Alert, Container } from "@mui/material";
import React, { useState } from "react";
import { runAi } from "@/ai/ai";
import Markdown from 'react-markdown';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: { xs: '95%', sm: '80%' },
    height: { xs: '90%', sm: '80%' },
    bgcolor: 'background.paper',
    border: '2px solid #d32f2f',
    borderRadius: 2,
    boxShadow: 24,
    p: { xs: 2, sm: 4 },
    overflowY: 'auto',
};

export default function AiComponent() {
    const [response, setResponse] = useState("");
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [error, setError] = useState("");
    const [query, setQuery] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!query.trim()) {
            setError("Vui lòng nhập câu hỏi!");
            return;
        }

        setLoading(true);
        setError("");
        
        try {
            const aiResponse = await runAi(query);
            // console.log(aiResponse);
            setResponse(aiResponse);
            setOpen(true);
            setQuery(""); // Xóa dữ liệu sau khi gửi thành công
        } catch (err) {
            setError("Có lỗi xảy ra khi gọi AI. Vui lòng kiểm tra kết nối và thử lại!");
            console.error("AI Error:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && e.ctrlKey) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            handleSubmit(e as any);
        }
    };

    return (
        <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
            <Typography 
                variant="h4" 
                component="h1" 
                gutterBottom 
                sx={{ 
                    color: 'text.primary', 
                    mb: 4, 
                    textAlign: 'center',
                    fontWeight: 'bold'
                }}
            >
                Trợ lý AI
            </Typography>
            
            <form onSubmit={handleSubmit}>
                <Box sx={{ mb: 3 }}>
                    <TextField 
                        fullWidth
                        multiline
                        rows={4}
                        label="Hãy viết câu hỏi của bạn..." 
                        variant="outlined"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyPress={handleKeyPress}
                        disabled={loading}
                        placeholder="Nhập câu hỏi của bạn ở đây... (Ctrl + Enter để gửi nhanh)"
          InputLabelProps={{
                            style: { color: 'text.primary' },
                        }} 
                        sx={{ 
            '& .MuiOutlinedInput-root': {
                '& fieldset': {
                                    borderColor: '#d32f2f',
                },
                '&:hover fieldset': {
                                    borderColor: '#f44336',
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: '#d32f2f',
                                }
                            }
                        }}
                    />
                </Box>
                
                {error && (
                    <Alert severity="error" sx={{ mb: 3 }}>
                        {error}
                    </Alert>
                )}
                
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    <Button 
                        type="submit"
                        variant="contained" 
                        disabled={loading || !query.trim()}
                        size="large"
                        sx={{ 
                            backgroundColor: '#d32f2f',
                            px: 4,
                            py: 1.5,
                            fontSize: '1.1rem',
                            '&:hover': {
                                backgroundColor: '#b71c1c',
                            },
                            '&:disabled': {
                                backgroundColor: '#ccc',
                            }
                        }}
                    >
                        {loading ? (
                            <>
                                <CircularProgress size={20} sx={{ color: 'white', mr: 1 }} />
                                Đang xử lý...
                            </>
                        ) : (
                            <Markdown>{response}</Markdown>
                        )}
                    </Button>
                </Box>
     </form>
            
            <Modal 
                open={open} 
                onClose={handleClose}
                aria-labelledby="modal-title" 
                aria-describedby="modal-description"
            >
       <Box sx={style}>
                    <Typography 
                        id="modal-title" 
                        variant="h5" 
                        component="h2" 
                        sx={{ 
                            mb: 3, 
                            color: 'text.primary',
                            fontWeight: 'bold',
                            borderBottom: '2px solid #d32f2f',
                            pb: 1
                        }}
                    >
         Phản hồi của AI
        </Typography>
                    <Typography 
                        id="modal-description" 
                        sx={{ 
                            color: 'text.secondary', 
                            whiteSpace: 'pre-wrap',
                            lineHeight: 1.6,
                            fontSize: '20px',
                            fontFamily: 'Lato'
                        }}
                    >
                        {response}
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
                        <Button 
                            onClick={handleClose}
                            variant="outlined" 
                            sx={{ 
                                borderColor: '#d32f2f',
                                color: '#d32f2f',
                                '&:hover': {
                                    borderColor: '#b71c1c',
                                    backgroundColor: 'rgba(211, 47, 47, 0.04)',
                                }
                            }}
                        >
                            Đóng
                        </Button>
                    </Box>
       </Box>
     </Modal>
        </Container>
    );
}