import { Box, Button, Dialog, Grid, TextField, Typography } from "@mui/material";
import { useState } from "react";

export default function AttackModal({ open, onClose }: { open: boolean, onClose: () => void }) {

    const [damageValues, setDamageValues] = useState<number[]>(Array(11).fill(0));  // TEMP - 11 text fields; should be dynamic

    const onAttack = async () => {
        onClose();
        // Deal damage here
    };

    const onCancel = () => {
        setDamageValues(Array(11).fill(0));
        onClose();
    };

    const handleInputChange = (index: number, value: string) => {
        const intValue = parseInt(value, 10);
        if (!isNaN(intValue) && intValue >= 0) {
            const newValues = [...damageValues];
            newValues[index] = intValue;
            setDamageValues(newValues);
        } else if (value === '') { 
            const newValues = [...damageValues];
            newValues[index] = 0;
            setDamageValues(newValues);
        }
    };

    return (
        <Dialog
            open={open}
            onClose={onCancel}
        >
            <Box sx={{
                width: 400,
                bgcolor: 'background.paper',
                p: 4,
            }}>
                <Typography variant="h5" sx={{ mb: 2 }}>
                    Roll Damage
                </Typography>

                {/* Damage Roll Text Fields */}
                <Grid container spacing={2}>
                    {damageValues.map((value, index) => (
                        <Grid item xs={4} key={index}>
                            <TextField
                                type="number"
                                value={value}
                                onChange={(e) => handleInputChange(index, e.target.value)}
                                InputProps={{ inputProps: { min: 0 } }}  // Restrict to positive numbers
                                fullWidth
                            />
                        </Grid>
                    ))}
                </Grid>

                {/* Attack Button */}
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
                    <Button onClick={onCancel} color="error">
                        Cancel
                    </Button>
                    <Button
                        onClick={onAttack}
                        variant="contained"
                        color="primary"
                    >
                        Deal Damage
                    </Button>
                </Box>
            </Box>
        </Dialog>
    );
}
