import { Avatar, Box, Typography } from "@mui/material";
import React, { useRef } from "react";

function getCurrentTime() {
  // Create a new Date object
  const now = new Date();

  // Get the current hour and minute as two separate numbers
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();

  // Pad the numbers with a leading zero if necessary
  const formattedHours = hours < 10 ? `0${hours}` : hours;
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
  const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;

  // Combine the formatted hours and minutes into a string with a colon separator
  const currentTime = `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
  return currentTime;
}

function ListItem({ imgUrl, name, username }) {
  const time = useRef(getCurrentTime());
  return (
    <Box display={"flex"} width="100%" sx={{ margin: "1rem 0" }}>
      <Avatar variant="rounded" src={imgUrl}/>
      <Box
        display={"flex"}
        alignItems="center"
        justifyContent={"space-between"}
        sx={{ ml: 2, width: "100%", padding: "0 1rem" }}
      >
        <Typography>{name}</Typography>
        <Typography>{time.current}</Typography>
      </Box>
    </Box>
  );
}

export default ListItem;
