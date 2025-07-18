import React from 'react';
import Analitic from './Analitic';
import { Container, Typography, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip } from '@mui/material';

const recentTransactions = [
  { id: 1, name: 'Order #1234', date: '2025-07-01', amount: 120.5, status: 'Completed' },
  { id: 2, name: 'Order #1235', date: '2025-07-02', amount: 89.99, status: 'Pending' },
  { id: 3, name: 'Order #1236', date: '2025-07-03', amount: 45.0, status: 'Failed' },
  { id: 4, name: 'Order #1237', date: '2025-07-03', amount: 210.0, status: 'Completed' },
];

export default function Pages() {
  return(
    <Container maxWidth="xl">
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