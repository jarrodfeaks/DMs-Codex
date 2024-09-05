// App.tsx
import React from 'react';
import { createTheme } from '@mui/material';
import LoginPage from './LoginPage';

const theme = createTheme({
  palette: {}
});

const App: React.FC = () => {
  return (
    <div>
      <LoginPage />
    </div>
  );
};

export default App;
