import { Avatar, Box, Typography } from '@mui/material';
import { yellow } from '@mui/material/colors';
import React from 'react';

function ListItem({ imgUrl, name, time }) {
  return (
    <Box
      display={'flex'}
      width="100%"
      sx={{ margin: '.3rem 0', color: yellow['A200'] }}
    >
      <Avatar variant="rounded" src={imgUrl} />
      <Box
        display={'flex'}
        alignItems="center"
        justifyContent={'space-between'}
        sx={{ ml: 2, width: '100%', padding: '0 1rem' }}
      >
        <Typography>{name}</Typography>
        <Typography>{time}</Typography>
      </Box>
    </Box>
  );
}

export default ListItem;
