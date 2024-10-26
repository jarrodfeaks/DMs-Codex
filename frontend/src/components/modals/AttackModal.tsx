import { Box, Button, Dialog, Grid, TextField, Typography, IconButton } from "@mui/material";
import { useState, useEffect } from "react";
import { Casino } from "@mui/icons-material";
import { Dice } from "../../../../shared/enums";
import { GetMaxValueForDice } from "../../utils";

interface AttackModalProps {
    open: boolean;
    onClose: (result?: { totalDamageDealt: number }) => void;
    payload: { damageDice: [Dice, number][] };
}

export default function AttackModal({ open, onClose, payload }: AttackModalProps) {
    const { damageDice = [] } = payload || {};
    const initialDamageValues = damageDice.map(([_, num]) => Array(num).fill(''));
    const [damageValues, setDamageValues] = useState<number[][]>(initialDamageValues);
    const [totalDamage, setTotalDamage] = useState<number>(0);

    useEffect(() => {
        const sum = damageValues.flat().reduce((acc, value) => acc + (parseInt(value, 10) || 0), 0);
        setTotalDamage(sum);
    }, [damageValues]);

    const handleInputChange = (diceIndex: number, rollIndex: number, value: string) => {
        const intValue = parseInt(value, 10);
        const maxValue = GetMaxValueForDice(damageDice[diceIndex][0]);
        if (!isNaN(intValue) && intValue >= 0 && intValue <= maxValue) {
            const newValues = [...damageValues];
            newValues[diceIndex][rollIndex] = intValue;
            setDamageValues(newValues);
        } else if (value === '') {
            const newValues = [...damageValues];
            newValues[diceIndex][rollIndex] = 0;
            setDamageValues(newValues);
        }
    };

    const randomizeValues = () => {
        const randomizedValues = damageDice.map(([dice, num]) =>
            Array(num).fill(null).map(() => Math.floor(Math.random() * GetMaxValueForDice(dice)) + 1)
        );
        setDamageValues(randomizedValues);
    };

    const onAttack = () => {
        let totalDamageDealt = 0;
        let isValid = true;

        damageValues.forEach((diceValues, diceIndex) => {
            const maxValue = GetMaxValueForDice(damageDice[diceIndex][0]);
            diceValues.forEach((value) => {
                const intValue = parseInt(value, 10);
                if (isNaN(intValue) || intValue <= 0 || intValue > maxValue) {
                    isValid = false;
                } else {
                    totalDamageDealt += intValue;
                }
            });
        });

        if (isValid) {
            onClose({ totalDamageDealt });
        } else {
            alert('Please enter valid damage values.');
        }
    };

    const onCancel = () => {
        onClose();
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

                {damageDice.map(([dice, num], diceIndex) => (
                    <Box key={diceIndex} sx={{ mb: 2 }}>
                        <Grid container spacing={2}>
                            {damageValues[diceIndex].map((value, rollIndex) => (
                                <Grid item xs={4} key={rollIndex}>
                                    <TextField
                                        type="number"
                                        value={value}
                                        onChange={(e) => handleInputChange(diceIndex, rollIndex, e.target.value)}
                                        InputProps={{ inputProps: { min: 0, max: GetMaxValueForDice(dice) } }}
                                        fullWidth
                                        label={`${dice}`}
                                    />
                                </Grid>
                            ))}
                        </Grid>
                    </Box>
                ))}

                {/* Total Damage */}
                <Typography variant="h6" sx={{ mt: 2, textAlign: 'center' }}>
                    Total Damage: {totalDamage}
                </Typography>

                {/* Buttons */}
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
                    <IconButton onClick={randomizeValues} color="primary">
                        <Casino />
                    </IconButton>
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
