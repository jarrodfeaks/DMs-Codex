import React, {useState} from 'react';
import {Box, Typography, Modal} from '@mui/material';

function calculateModifier(abilityScore) {
    return Math.floor((abilityScore - 10) / 2);
}

function getProficiencyBonus(level) {
    return Math.ceil(level / 4) + 1;
}

function SkillsCalc() {
    const [level, setLevel] = useState('');
    const [abilityScores, setAbilityScores] = useState({
        str: '',
        dex: '',
        con: '',
        int: '',
        wis: '',
        cha: ''
    });

    const [proficiencies, setProficiencies] = useState({
        Acrobatics: false,
        AnimalHandling: false,
        Arcana: false,
        Athletics: false,
        Deception: false,
        History: false,
        Insight: false,
        Intimidation: false,
        Investigation: false,
        Medicine: false,
        Nature: false,
        Perception: false,
        Performance: false,
        Persuasion: false,
        Religion: false,
        SleightOfHand: false,
        Stealth: false,
        Survival: false
    });

    const [output, setOutput] = useState([]);
    
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    function calculateSkills() {
        const proficiencyBonus = getProficiencyBonus(level);
        
        const skills = {
            Acrobatics: abilityScores.dex,
            AnimalHandling: abilityScores.wis,
            Arcana: abilityScores.int,
            Athletics: abilityScores.str,
            Deception: abilityScores.cha,
            History: abilityScores.int,
            Insight: abilityScores.wis,
            Intimidation: abilityScores.cha,
            Investigation: abilityScores.int,
            Medicine: abilityScores.wis,
            Nature: abilityScores.int,
            Perception: abilityScores.wis,
            Performance: abilityScores.cha,
            Persuasion: abilityScores.cha,
            Religion: abilityScores.int,
            SleightOfHand: abilityScores.dex,
            Stealth: abilityScores.dex,
            Survival: abilityScores.wis
        };

        const newOutput = [];
        for (const skill in skills) {
            let modifier = calculateModifier(skills[skill]);
            if (proficiencies[skill]) {
                modifier += proficiencyBonus;
            }
            newOutput.push(`${skill}: ${modifier >= 0 ? '+' : ''}${modifier}`);
        }
        setOutput(newOutput);
    }

    return (
        <div style={{marginLeft: 40, display: 'flex', gap: 50, marginTop: 30 }}>
            <div>
            <label>
                Level:
                <input 
                    type="number" 
                    value={level} 
                    onChange={(e) => setLevel(parseInt(e.target.value))} 
                />
            </label>

            <h3>Ability Scores</h3>
            {Object.keys(abilityScores).map((key) => (
                <div key={key}>
                    <label>
                        {key.toUpperCase()}:
                        <input
                            type="number"
                            value={abilityScores[key]}
                            onChange={(e) =>
                                setAbilityScores((prev) => ({
                                    ...prev,
                                    [key]: parseInt(e.target.value)
                                }))
                            }
                        />
                    </label>
                </div>
            ))}

            <h3>Proficiencies</h3>
            {Object.keys(proficiencies).map((skill) => (
                <div key={skill}>
                    <label>
                        {skill}:
                        <input
                            type="checkbox"
                            checked={proficiencies[skill]}
                            onChange={(e) =>
                                setProficiencies((prev) => ({
                                    ...prev,
                                    [skill]: e.target.checked
                                }))
                            }
                        />
                    </label>
                </div>
            ))}
            </div>

            <div>
                <button style={{backgroundColor: 'green', color: 'white'}} onClick={calculateSkills}>Calculate Skills</button>
                <button style={{backgroundColor: 'blue', color: 'white'}} onClick={handleOpen}>Open Modal</button>
                    <Modal open={open} onClose={handleClose}>
                        <Box sx={{position: 'absolute', top: '50%', left: '60%', transform: 'translate(-50%, -50%)', width: 1000, height: 700, bgcolor: 'background.paper', border: '2px solid #000', boxShadow: 24, p: 4,}}>
                            <Typography>
                                Peepee Poopoo
                            </Typography>
                        </Box>
                    </Modal>

                <h3>Skill Modifiers</h3>
                <ul>
                    {output.map((line, index) => (
                        <li key={index}>{line}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default SkillsCalc;
