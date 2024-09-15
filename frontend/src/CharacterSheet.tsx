import React, {FC} from 'react';
import {TextField, Box, Typography} from "@mui/material";

const CharacterSheet: FC = () => {

  return (
    <Box sx={{display:'flex', flexDirection: 'column'}}>
      {/* <Container sx={{bgcolor:'#262626', borderRadius: 5, margin: 2, padding: 2}}>
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
      </Container> */}
      <Box sx={{display:'flex', flexDirection: 'column', border: '2px solid', borderColor: '#FFFFF0', borderRadius: '10px'}}>
        <Typography sx={{color: '#FF1B1C'}}>Character</Typography>
        <TextField id='characterName' className='characterName' label='Character Name' sx={{
                marginBottom: 2, 
                marginTop: 2, 
                backgroundColor: '#FFFDD0', 
                borderRadius: '10px', 
                '& .MuiInputLabel-root.Mui-focused': {color: '#FF1B1C'}
              }}/>
        <TextField id='characterRace' className='characterRace' label='Character Race' sx={{
                marginBottom: 2, 
                marginTop: 2, 
                backgroundColor: '#FFFDD0', 
                borderRadius: '10px', 
                '& .MuiInputLabel-root.Mui-focused': {color: '#FF1B1C'}
              }}/>
        <TextField id='characterLevel' className='characterLevel' label='Character Level' type='number' sx={{
          marginBottom: 2, 
          marginTop: 2, 
          backgroundColor: '#FFFDD0', 
          borderRadius: '10px', 
          '& .MuiInputLabel-root.Mui-focused': {color: '#FF1B1C'}
        }}/>
      </Box>
      <Box sx={{display:'flex', flexDirection: 'row', border: '2px solid', borderColor: '#FFFFF0', borderRadius: '10px'}}>
      <Typography sx={{color: '#FF1B1C'}}>Ability Scores</Typography>
      <TextField id='characterLevel' className='characterLevel' label='Character Level' type='number' sx={{
          marginBottom: 2, 
          marginTop: 2, 
          backgroundColor: '#FFFDD0', 
          borderRadius: '10px', 
          '& .MuiInputLabel-root.Mui-focused': {color: '#FF1B1C'}
        }}/><TextField id='characterLevel' className='characterLevel' label='Character Level' type='number' sx={{
          marginBottom: 2, 
          marginTop: 2, 
          backgroundColor: '#FFFDD0', 
          borderRadius: '10px', 
          '& .MuiInputLabel-root.Mui-focused': {color: '#FF1B1C'}
        }}/><TextField id='characterLevel' className='characterLevel' label='Character Level' type='number' sx={{
          marginBottom: 2, 
          marginTop: 2, 
          backgroundColor: '#FFFDD0', 
          borderRadius: '10px', 
          '& .MuiInputLabel-root.Mui-focused': {color: '#FF1B1C'}
        }}/><TextField id='characterLevel' className='characterLevel' label='Character Level' type='number' sx={{
          marginBottom: 2, 
          marginTop: 2, 
          backgroundColor: '#FFFDD0', 
          borderRadius: '10px', 
          '& .MuiInputLabel-root.Mui-focused': {color: '#FF1B1C'}
        }}/><TextField id='characterLevel' className='characterLevel' label='Character Level' type='number' sx={{
          marginBottom: 2, 
          marginTop: 2, 
          backgroundColor: '#FFFDD0', 
          borderRadius: '10px', 
          '& .MuiInputLabel-root.Mui-focused': {color: '#FF1B1C'}
        }}/><TextField id='characterLevel' className='characterLevel' label='Character Level' type='number' sx={{
          marginBottom: 2, 
          marginTop: 2, 
          backgroundColor: '#FFFDD0', 
          borderRadius: '10px', 
          '& .MuiInputLabel-root.Mui-focused': {color: '#FF1B1C'}
        }}/>
      </Box>
      <Box sx={{display:'flex', flexDirection: 'row', border: '2px solid', borderColor: '#FFFFF0', borderRadius: '10px'}}>
      <Typography sx={{color: '#FF1B1C'}}>Ability Modifiers</Typography>
      <TextField id='characterLevel' className='characterLevel' label='Character Level' type='number' sx={{
          marginBottom: 2, 
          marginTop: 2, 
          backgroundColor: '#FFFDD0', 
          borderRadius: '10px', 
          '& .MuiInputLabel-root.Mui-focused': {color: '#FF1B1C'}
        }}/><TextField id='characterLevel' className='characterLevel' label='Character Level' type='number' sx={{
          marginBottom: 2, 
          marginTop: 2, 
          backgroundColor: '#FFFDD0', 
          borderRadius: '10px', 
          '& .MuiInputLabel-root.Mui-focused': {color: '#FF1B1C'}
        }}/><TextField id='characterLevel' className='characterLevel' label='Character Level' type='number' sx={{
          marginBottom: 2, 
          marginTop: 2, 
          backgroundColor: '#FFFDD0', 
          borderRadius: '10px', 
          '& .MuiInputLabel-root.Mui-focused': {color: '#FF1B1C'}
        }}/><TextField id='characterLevel' className='characterLevel' label='Character Level' type='number' sx={{
          marginBottom: 2, 
          marginTop: 2, 
          backgroundColor: '#FFFDD0', 
          borderRadius: '10px', 
          '& .MuiInputLabel-root.Mui-focused': {color: '#FF1B1C'}
        }}/><TextField id='characterLevel' className='characterLevel' label='Character Level' type='number' sx={{
          marginBottom: 2, 
          marginTop: 2, 
          backgroundColor: '#FFFDD0', 
          borderRadius: '10px', 
          '& .MuiInputLabel-root.Mui-focused': {color: '#FF1B1C'}
        }}/><TextField id='characterLevel' className='characterLevel' label='Character Level' type='number' sx={{
          marginBottom: 2, 
          marginTop: 2, 
          backgroundColor: '#FFFDD0', 
          borderRadius: '10px', 
          '& .MuiInputLabel-root.Mui-focused': {color: '#FF1B1C'}
        }}/>
      </Box>
      <Box sx={{display:'flex', flexDirection: 'row', border: '2px solid', borderColor: '#FFFFF0', borderRadius: '10px'}}>
      <Typography sx={{color: '#FF1B1C'}}>Saving Throws</Typography>
      <TextField id='characterLevel' className='characterLevel' label='Character Level' type='number' sx={{
          marginBottom: 2, 
          marginTop: 2, 
          backgroundColor: '#FFFDD0', 
          borderRadius: '10px', 
          '& .MuiInputLabel-root.Mui-focused': {color: '#FF1B1C'}
        }}/><TextField id='characterLevel' className='characterLevel' label='Character Level' type='number' sx={{
          marginBottom: 2, 
          marginTop: 2, 
          backgroundColor: '#FFFDD0', 
          borderRadius: '10px', 
          '& .MuiInputLabel-root.Mui-focused': {color: '#FF1B1C'}
        }}/><TextField id='characterLevel' className='characterLevel' label='Character Level' type='number' sx={{
          marginBottom: 2, 
          marginTop: 2, 
          backgroundColor: '#FFFDD0', 
          borderRadius: '10px', 
          '& .MuiInputLabel-root.Mui-focused': {color: '#FF1B1C'}
        }}/><TextField id='characterLevel' className='characterLevel' label='Character Level' type='number' sx={{
          marginBottom: 2, 
          marginTop: 2, 
          backgroundColor: '#FFFDD0', 
          borderRadius: '10px', 
          '& .MuiInputLabel-root.Mui-focused': {color: '#FF1B1C'}
        }}/><TextField id='characterLevel' className='characterLevel' label='Character Level' type='number' sx={{
          marginBottom: 2, 
          marginTop: 2, 
          backgroundColor: '#FFFDD0', 
          borderRadius: '10px', 
          '& .MuiInputLabel-root.Mui-focused': {color: '#FF1B1C'}
        }}/><TextField id='characterLevel' className='characterLevel' label='Character Level' type='number' sx={{
          marginBottom: 2, 
          marginTop: 2, 
          backgroundColor: '#FFFDD0', 
          borderRadius: '10px', 
          '& .MuiInputLabel-root.Mui-focused': {color: '#FF1B1C'}
        }}/>
      </Box>
      <Typography sx={{color: '#FF1B1C'}}>Skills go here</Typography>
      <Box sx={{display:'flex', flexDirection: 'row', border: '2px solid', borderColor: '#FFFFF0', borderRadius: '10px'}}>
      <Typography sx={{color: '#FF1B1C'}}>Life</Typography>
      <TextField id='characterLevel' className='characterLevel' label='Character Level' type='number' sx={{
          marginBottom: 2, 
          marginTop: 2, 
          backgroundColor: '#FFFDD0', 
          borderRadius: '10px', 
          '& .MuiInputLabel-root.Mui-focused': {color: '#FF1B1C'}
        }}/><TextField id='characterLevel' className='characterLevel' label='Character Level' type='number' sx={{
          marginBottom: 2, 
          marginTop: 2, 
          backgroundColor: '#FFFDD0', 
          borderRadius: '10px', 
          '& .MuiInputLabel-root.Mui-focused': {color: '#FF1B1C'}
        }}/><TextField id='characterLevel' className='characterLevel' label='Character Level' type='number' sx={{
          marginBottom: 2, 
          marginTop: 2, 
          backgroundColor: '#FFFDD0', 
          borderRadius: '10px', 
          '& .MuiInputLabel-root.Mui-focused': {color: '#FF1B1C'}
        }}/><TextField id='characterLevel' className='characterLevel' label='Character Level' type='number' sx={{
          marginBottom: 2, 
          marginTop: 2, 
          backgroundColor: '#FFFDD0', 
          borderRadius: '10px', 
          '& .MuiInputLabel-root.Mui-focused': {color: '#FF1B1C'}
        }}/><TextField id='characterLevel' className='characterLevel' label='Character Level' type='number' sx={{
          marginBottom: 2, 
          marginTop: 2, 
          backgroundColor: '#FFFDD0', 
          borderRadius: '10px', 
          '& .MuiInputLabel-root.Mui-focused': {color: '#FF1B1C'}
        }}/><TextField id='characterLevel' className='characterLevel' label='Character Level' type='number' sx={{
          marginBottom: 2, 
          marginTop: 2, 
          backgroundColor: '#FFFDD0', 
          borderRadius: '10px', 
          '& .MuiInputLabel-root.Mui-focused': {color: '#FF1B1C'}
        }}/>
      </Box>
    </Box>
  );
};

export default CharacterSheet;