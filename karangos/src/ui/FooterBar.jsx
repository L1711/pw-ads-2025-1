import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography'
import CoffeeIcon from '@mui/icons-material/Coffee';

export default function FooterBar() {
  return (
    <Box 
      component="footer" 
      sx={{ 
        backgroundColor: 'action.disabledBackground',
        display: 'flex',
        justifyContent: 'center',
        position: 'fixed',  // posição fixa
        bottom: 0,          // na parte de baixo da página
        width: '100vw'      // 100% da largura da viewport
      }}
    >
      <Typography variant="caption" gutterBottom>
        Desenvolvido e mantido com <CoffeeIcon fontSize="small" /> por <a
         href="Lanealves02@gmail.com">Leilane Alves</a>
      </Typography>
    </Box>
  );
}