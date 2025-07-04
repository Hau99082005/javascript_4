'use client';
import * as React from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import styles from './page.module.css';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { useSearchParams } from 'next/navigation';

export default function Home() {
  const searchParams = useSearchParams();
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    if (searchParams.get('error') === 'unauthorized') {
      setOpen(true);
    }
  }, [searchParams]);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Welcome to the Home Page</h1>
      <Stack spacing={2} direction="row">
        <Button variant="text">Text</Button>
        <Button variant="contained">Contained</Button>
        <Button variant="outlined">Outlined</Button>
      </Stack>
      <Snackbar open={open} autoHideDuration={4000} onClose={() => setOpen(false)}>
        <Alert severity="error" onClose={() => setOpen(false)}>
          Bạn không có quyền truy cập!
        </Alert>
      </Snackbar>
    </div>
  );
}
