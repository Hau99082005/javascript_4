"use client";
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Typography,
  useMediaQuery,
} from "@mui/material";
import CircleIcon from "@mui/icons-material/Circle";
import { useTheme } from "@mui/material/styles";

const transactions = [
  {
    name: "Le Van Hau",
    position: "JavaScript Developer",
    status: "Action",
    age: "20",
    statusColor: "green",
    startDate: new Date(),
    salary: "20.000.000",
  },
];

export default function Transection() {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <TableContainer component={Paper} sx={{ overflowX: "auto" }}>
      <Table sx={{ minWidth: 200 }}>
        <TableHead>
          <TableRow>
            <TableCell>
              <Typography variant="subtitle1">Name</Typography>
            </TableCell>
            {!isSmallScreen && (
              <TableCell>
                <Typography variant="subtitle1">Position</Typography>
              </TableCell>
            )}
            <TableCell>
              <Typography variant="subtitle1">Status</Typography>
            </TableCell>
            {!isSmallScreen && (
              <TableCell>
                <Typography variant="subtitle1">Age</Typography>
              </TableCell>
            )}
            {!isSmallScreen && (
              <TableCell>
                <Typography variant="subtitle1">Start Date</Typography>
              </TableCell>
            )}
            {!isSmallScreen && (
              <TableCell>
                <Typography variant="subtitle1">Salary</Typography>
              </TableCell>
            )}
          </TableRow>
        </TableHead>
        <TableBody>
          {transactions.map((transaction, index) => (
            <TableRow
              key={index}
              sx={{
                "&:hover": {
              backgroundColor: theme.palette.action.hover,
            },
              }}
            >
          <TableCell>
            <Box display="flex" alignItems="center">
               <Typography variant="body2">{transaction.name}</Typography>
            </Box>
          </TableCell>
          {!isSmallScreen && (
            <TableCell>
              <Typography variant="body2">{transaction.position}</Typography>
            </TableCell>
          )}
          <TableCell>
            <Box display="flex" alignItems="center">
                  <CircleIcon style={{ color: transaction.statusColor, fontSize: 12, marginRight: 4 }} />
             <Typography variant="body2">{transaction.status}</Typography>
            </Box>
          </TableCell>
            {!isSmallScreen && (
             <TableCell>
              <Typography variant="body2">{transaction.age}</Typography>
             </TableCell>
            )}
              {!isSmallScreen && (
                <TableCell>
                  <Typography variant="body2">
                    {transaction.startDate instanceof Date
                      ? transaction.startDate.toLocaleDateString()
                      : transaction.startDate}
                  </Typography>
                </TableCell>
              )}
              {!isSmallScreen && (
                <TableCell>
                  <Typography variant="body2">{transaction.salary}</Typography>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
} 