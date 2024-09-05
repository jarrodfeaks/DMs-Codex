import React, {FC} from 'react';
import {TextField, Box, Button, Container, Avatar, Typography} from "@mui/material";

const LoginPage: FC = () => {

  return (
    <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', width: '100vh'}}>
      <Container sx={{bgcolor:'#262626', borderRadius: 5, margin: 2, padding: 2}}>
          <Box sx={{marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center', bgcolor:'#262626'}}>
            <Avatar sx={{bgcolor: 'red'}}></Avatar>
            <Typography variant='h5' sx={{fontFamily: 'Copperplate Gothic Bold, serif'}}>
              Sign In
            </Typography>
            <TextField sx={{
              marginBottom: 2, 
              marginTop: 2, 
              backgroundColor: '#FFFDD0', 
              borderRadius: '10px', 
              '& .MuiInputLabel-root.Mui-focused': {color: '#FF1B1C'}
            }} id='email' label='Email Address' autoComplete='email' autoFocus/>
              
            <TextField sx={{
              marginBottom: 2, 
              backgroundColor: '#FFFDD0', 
              borderRadius: '10px', 
              '& .MuiInputLabel-root.Mui-focused': {color: '#FF1B1C'},
              '&.Mui-focused fieldset': {borderColor: '#FF1B1C'}
            }} variant="outlined" id='password' label='Password' type='password'/>
            <Button sx={{backgroundColor: '#FF1B1C !important', fontFamily: 'Copperplate Gothic Bold, serif'}} variant='contained'>
              Sign In
            </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default LoginPage;