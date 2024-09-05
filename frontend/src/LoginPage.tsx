import React, {FC} from 'react';
import {TextField, Box, Button, Container, Avatar, Typography} from "@mui/material";

const LoginPage: FC = () => {

  return (
    <Container>
        <Box sx={{marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
          <Avatar sx={{bgcolor: 'red'}}></Avatar>
          <Typography variant='h5'>
            Sign In
          </Typography>
          <TextField id='email' label='Email Address' autoComplete='email' autoFocus/>
            
          <TextField id='password' label='Password' type='password'/>
          <Button variant='contained'>
            Sign In
          </Button>
      </Box>
    </Container>
  );
};

export default LoginPage;