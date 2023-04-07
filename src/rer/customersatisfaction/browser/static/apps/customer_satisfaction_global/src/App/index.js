import * as React from 'react';
import Container from '@mui/material/Container';

import AppBar from '@mui/material/AppBar';
import Stack from '@mui/material/Stack';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { ThemeProvider, createTheme } from '@mui/material/styles';

import Comments from './Comments';

import '../App.css';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#1976d2',
    },
  },
});



const Header = () => {
  return (
    <Stack spacing={2} sx={{ flexGrow: 1 }}>
      <ThemeProvider theme={darkTheme}>
        <AppBar position="static" color="primary">
          <Toolbar>
            <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
              Customer Satisfaction
            </Typography>
          </Toolbar>
        </AppBar>
      </ThemeProvider>
    </Stack>
  )
}

function App() {
  return (
    <Container>
      <Header />
      <Comments />
    </Container>
  );
}

export default App;
