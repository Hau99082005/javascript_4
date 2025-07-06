import React, { useState } from 'react';
import Analitic from './Analitic';
import { Container, Typography, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip, Fab, Modal, Fade, IconButton } from '@mui/material';
import AiAssistantBox from '@/components/ai/AiAssistantBox';
import SmartToy from '@mui/icons-material/SmartToy';
import Close from '@mui/icons-material/Close';

const recentTransactions = [
  { id: 1, name: 'Order #1234', date: '2025-07-01', amount: 120.5, status: 'Completed' },
  { id: 2, name: 'Order #1235', date: '2025-07-02', amount: 89.99, status: 'Pending' },
  { id: 3, name: 'Order #1236', date: '2025-07-03', amount: 45.0, status: 'Failed' },
  { id: 4, name: 'Order #1237', date: '2025-07-03', amount: 210.0, status: 'Completed' },
];

export default function Pages() {
  const [aiModalOpen, setAiModalOpen] = useState(false);
  return(
    <Container maxWidth="xl" sx={{ position: 'relative', minHeight: '100vh' }}>
      {/* Nút FAB AI nổi */}
      <Fab
        color="error"
        aria-label="Trợ lý AI"
        sx={{
          position: "fixed",
          bottom: 32,
          right: 32,
          zIndex: 1300,
          boxShadow: 6,
          background: 'linear-gradient(135deg, #ff3c00 0%, #ff9800 100%)',
          '&:hover': {
            background: 'linear-gradient(135deg, #d32f2f 0%, #ff3c00 100%)',
            transform: 'scale(1.1)',
          },
          transition: 'all 0.3s ease',
        }}
        onClick={() => setAiModalOpen(true)}
      >
        <SmartToy fontSize="large" sx={{ color: 'white' }} />
      </Fab>
      {/* Modal chứa giao diện trợ lý AI */}
      <Modal
        open={aiModalOpen}
        onClose={() => setAiModalOpen(false)}
        closeAfterTransition
        sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        <Fade in={aiModalOpen}>
          <Box sx={{ position: "relative" }}>
            {/* Nút đóng */}
            <IconButton
              onClick={() => setAiModalOpen(false)}
              sx={{
                position: "absolute",
                top: 8,
                right: 8,
                zIndex: 10,
                bgcolor: "rgba(255,255,255,0.7)",
                "&:hover": { bgcolor: "rgba(255,255,255,1)" }
              }}
            >
              <Close />
            </IconButton>
            {/* Card trợ lý AI */}
            <AiAssistantBox />
          </Box>
        </Fade>
      </Modal>
      <Analitic/>
      <Box sx={{ mt: 6 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 2, color: '#ff8a00', textAlign: 'center', letterSpacing: 1 }}>
          Recent Transection
        </Typography>
       
        <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 3, maxWidth: 900, mx: 'auto', background: '#23272f' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ color: '#fff', fontWeight: 600 }}>Name</TableCell>
                <TableCell sx={{ color: '#fff', fontWeight: 600 }}>Date</TableCell>
                <TableCell sx={{ color: '#fff', fontWeight: 600 }}>Amount</TableCell>
                <TableCell sx={{ color: '#fff', fontWeight: 600 }}>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {recentTransactions.map((row) => (
                <TableRow key={row.id}>
                  <TableCell sx={{ color: '#fff' }}>{row.name}</TableCell>
                  <TableCell sx={{ color: '#fff' }}>{row.date}</TableCell>
                  <TableCell sx={{ color: '#fff' }}>${row.amount.toFixed(2)}</TableCell>
                  <TableCell>
                    <Chip
                      label={row.status}
                      color={row.status === 'Completed' ? 'success' : row.status === 'Pending' ? 'warning' : 'error'}
                      size="small"
                      sx={{ fontWeight: 600 }}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Container>
  );
}