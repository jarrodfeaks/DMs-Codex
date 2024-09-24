import React, { useState } from 'react';

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
        Athletics: false,
        Acrobatics: false,
        SleightOfHand: false,
        Stealth: false,
        Arcana: false,
        History: false,
        Investigation: false,
        Nature: false,
        Religion: false,
        AnimalHandling: false,
        Insight: false,
        Medicine: false,
        Perception: false,
        Survival: false,
        Deception: false,
        Intimidation: false,
        Performance: false,
        Persuasion: false
    });
    const [output, setOutput] = useState([]);

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
        <div style={{marginLeft: 30}}>
            <h2>D&D Skills Calculator</h2>
            
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

            <button onClick={calculateSkills}>Calculate Skills</button>

            <h3>Skill Modifiers</h3>
            <ul>
                {output.map((line, index) => (
                    <li key={index}>{line}</li>
                ))}
            </ul>
        </div>
    );
}

export default SkillsCalc;
