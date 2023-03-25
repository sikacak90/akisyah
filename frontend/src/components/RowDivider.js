import { useTheme } from "@emotion/react";
import { Box } from "@mui/material";
import React from "react";

function RowDivider() {
  const theme = useTheme();
  return (
    <Box
      sx={{
        height: "1px",
        background: theme.palette.darkGray.main,
        width: "100%",
        opacity: 0.2,
      }}
    ></Box>
  );
}

export default RowDivider;
