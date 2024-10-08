
/**
    Rolls a 20-sided die or adds rolled values and adds the given modifiers.
    @param proficiencyBonus - The proficiency bonus to add to the roll.
    @param abilityModifier - The ability modifier to add to the roll.
    @param diceRoll - Optional dice roll to use when inputting a specific value.
    @returns The result of the hit roll.
*/
export function rollsWithModifiers(proficiencyBonus: number, abilityModifier: number, diceRoll?: number): number {
    const roll = diceRoll !== null && diceRoll !== undefined ? diceRoll : Math.floor(Math.random() * 20) + 1;
    return roll + proficiencyBonus + abilityModifier;
}

/**
    Calculates the proficiency bonus based on character level.
    @param {number} characterLevel - The level of the character.
    @returns {number} The proficiency bonus for the given level.
*/
export function calculateProficiencyBonus(characterLevel: number): number {
    if (characterLevel >= 1 && characterLevel <= 4) {
        return 2;
    } else if (characterLevel >= 5 && characterLevel <= 8) {
        return 3;
    } else if (characterLevel >= 9 && characterLevel <= 12) {
        return 4;
    } else if (characterLevel >= 13 && characterLevel <= 16) {
        return 5;
    } else if (characterLevel >= 17 && characterLevel <= 20) {
        return 6;
    } else {
        throw new Error('Character level must be between 1 and 20');
    }
}