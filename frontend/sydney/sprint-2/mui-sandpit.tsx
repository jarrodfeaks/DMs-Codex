import React, { FC, useState } from 'react';
import {
  TextField, Box, Button, Container, Avatar, Typography, Checkbox,
  FormControlLabel, Switch, RadioGroup, Radio, FormControl, FormLabel,
  Select, MenuItem, Slider, Card, CardContent, CardActions
} from "@mui/material";

const Playground: FC = () => {
  const [name, setName] = useState('');
  const [age, setAge] = useState<number | string>('');
  const [checked, setChecked] = useState(false);
  const [selectedValue, setSelectedValue] = useState('');
  const [switchState, setSwitchState] = useState(false);
  const [sliderValue, setSliderValue] = useState<number>(30);

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const handleAgeChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setAge(event.target.value as number);
  };

  const handleSliderChange = (event: Event, newValue: number | number[]) => {
    setSliderValue(newValue as number);
  };

  const handleSubmit = () => {
    alert(`Name: ${name}, Age: ${age}, Checkbox: ${checked}, Radio: ${selectedValue}, Switch: ${switchState}, Slider: ${sliderValue}`);
  };

  return (
    <Container>
      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1.5rem", mt: 4 }}>
        <Avatar sx={{ width: 100, height: 100 }}>A</Avatar>
        <Typography variant="h1">Playground</Typography>

        {/* TextField */}
        <TextField
          label="Name"
          variant="outlined"
          value={name}
          onChange={handleNameChange}
        />

        {/* Select */}
        <FormControl fullWidth>
          <FormLabel>Age</FormLabel>
          <Select
            value={age}
            // onChange={handleAgeChange}
            displayEmpty
          >
            <MenuItem value=""><em>None</em></MenuItem>
            <MenuItem value={10}>10</MenuItem>
            <MenuItem value={20}>20</MenuItem>
            <MenuItem value={30}>30</MenuItem>
          </Select>
        </FormControl>

        {/* Checkbox */}
        <FormControlLabel
          control={<Checkbox checked={checked} onChange={() => setChecked(!checked)} />}
          label="I accept the terms"
        />

        {/* Radio Buttons */}
        <FormControl>
          <FormLabel>Gender</FormLabel>
          <RadioGroup
            row
            value={selectedValue}
            onChange={(e) => setSelectedValue(e.target.value)}
          >
            <FormControlLabel value="male" control={<Radio />} label="Male" />
            <FormControlLabel value="female" control={<Radio />} label="Female" />
            <FormControlLabel value="other" control={<Radio />} label="Other" />
          </RadioGroup>
        </FormControl>

        {/* Switch */}
        <FormControlLabel
          control={<Switch checked={switchState} onChange={() => setSwitchState(!switchState)} />}
          label="Enable Notifications"
        />

        {/* Slider */}
        <Box sx={{ width: 300 }}>
          <Typography>Volume</Typography>
          <Slider
            value={sliderValue}
            onChange={handleSliderChange}
            aria-labelledby="continuous-slider"
            min={0}
            max={100}
          />
        </Box>

        {/* Card */}
        <Card sx={{ maxWidth: 345 }}>
          <CardContent>
            <Typography gutterBottom variant="h5">Card Title</Typography>
            <Typography variant="body2" color="text.secondary">
              This is a simple card component to showcase Material UI usage.
            </Typography>
          </CardContent>
          <CardActions>
            <Button size="small">Share</Button>
            <Button size="small">Learn More</Button>
          </CardActions>
        </Card>

        {/* Submit Button */}
        <Button variant="contained" onClick={handleSubmit}>
          Submit
        </Button>
      </Box>
    </Container>
  );
};

export default Playground;
