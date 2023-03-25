import React from "react";
import { Box, Button, Typography } from "@mui/material";

function NotFound() {
  return (
    <Box
      sx={{
        width: "100%",
        height: "100vh",
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Typography variant="h1">404</Typography>
      <Typography variant="h3">Not Found</Typography>
      <Typography variant="h5">
        The page you are looking for does not exist or has been moved.
      </Typography>
      <Button variant="contained" href="/" style={{ marginTop: "3rem" }}>
        Go to Home
      </Button>
    </Box>
  );
}

export default NotFound;
