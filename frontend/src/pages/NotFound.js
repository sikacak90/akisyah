import { useTheme } from '@emotion/react';
import { Box, Button, Typography } from '@mui/material';
import React from 'react';
import { Link } from 'react-router-dom';

function NotFound() {
  const theme = useTheme();
  return (
    <Box
      sx={{
        width: '100%',
        height: '100vh',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        color: theme.palette.text.primary,
      }}
    >
      <Typography variant="h1">404</Typography>
      <Typography variant="h3">Not Found</Typography>
      <Typography variant="h5">
        The page you are looking for does not exist or has been moved.
      </Typography>
      <Button variant="contained" style={{ marginTop: '3rem' }}>
        <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
          Go to Home
        </Link>
      </Button>
    </Box>
  );
}

export default NotFound;
