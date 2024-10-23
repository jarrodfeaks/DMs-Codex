import { Dice } from "../../shared/enums";

/**
    Get the max value for a dice
    @param diceEnum - The dice to get the max value for.
    @returns The max value for the dice.
*/
export function GetMaxValueForDice (dice: Dice): number {
    return parseInt(dice.replace('D', ''), 10);
};


/**
    Calculates a random roll for a X-sided dice
    @param sides - The number of sides of the dice.
    @returns True if the character got hit, false otherwise.

    ! Sides will change from number to enum to have a set amount of dice types they can roll.
*/
export function rollDice(sides: number): number {
    return Math.floor(Math.random() * sides) + 1;
}

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
    Calculates if character got hit.
    @param roll - The character roll.
    @param abilityModifier - The ability modifier of the attack. (Varies from each weapon)
    @param proficiencyBonus - The proficiency bonus of the character.
    @param armorClass - The armor class of the target.
    @returns True if the character got hit, false otherwise.
*/
export function calculateCharacterHit(roll: number, attackModifier: number, armorClass: number, proficiencyBonus?: number,): boolean {
    if (proficiencyBonus === null || proficiencyBonus === undefined) {
        proficiencyBonus = 0;
    }
    return roll + attackModifier + proficiencyBonus >= armorClass;
}

/**
    Calculate character damage.
    @param rolls - The character roll.
    @param weaponModifier - The attack modifier of the attacker.
    @returns The damage dealt.
*/
export function calculateCharacterDamage(rolls: number, weaponModifier: number): number {
    return rolls + weaponModifier;
}

/**
    Calculates the proficiency bonus based on character level.
    @param characterLevel - The level of the character.
    @returns The proficiency bonus for the given level.
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

/**
    Sort Queue List by initiative Rolls
    @param queue - The queue list to sort.
    @returns // Array of the list sorted by initiative rolls.
*/
export function sortQueueByInitiative(queue: Array<{ name: string, initiative: number }>): Array<{ name: string, initiative: number }> {
    return queue.sort((a, b) => b.initiative - a.initiative);
}

/**
    Returns hit attack string for the combat log.
    @param customMessage - Message.
    @returns The default combat log string.
*/
export function customCombatLogString(customMessage: string): string {
    return `• ${customMessage}`;
}

/**
    Returns hit attack string for the combat log.
    @param characterName - The name of the character.
    @param weapon - The action the character is taking.
    @param target - The target of the action.
    @param damage - The damage dealt.
    @returns The default combat log string.
*/
export function attackCombatLogString(characterName: string, weapon: string, target: string, damage: number): string {
    return `• ${characterName} SUCCESSFULLY attacked ${target} with a ${weapon}. Dealing a total of ${damage} damage!`;
}

/**
    Returns missed attack string for the combat log.
    @param characterName - The name of the character.
    @param weapon - The weapon/action the character is taking.
    @param target - The target of the action.
    @returns The default combat log string.
*/
export function missedCombatLogString(characterName: string, weapon: string, target: string): string {
    return `• ${characterName} FAILED to attack ${target} with a ${weapon}!`;
}

/**
    Returns hit attack string for the combat log.
    @param turnNumber - Prints the turn number.
    @returns The default combat log string.
*/
export function nextTurnCombatLogString(turnNumber: string): string {
    return `• TURN ${turnNumber}`;
}

/**
    Returns hit attack string for the combat log.
    @param number - number to format.
    @returns The default combat log string.
*/
export function formatNumber(number: number): string {
    if (number > 0) return `+ ${number}`;
    return `${number}`;
}

/**
 * Capitalizes the first letter of a string.
 * @param str - The string to capitalize.
 * @returns The string with the first letter capitalized.
 */
function capitalizeFirstLetter(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

/**
 * Converts D&D 5e API JSON into a format suitable for saving in MongoDB.
 * @param apiData - The JSON data from the external API.
 * @returns The formatted data for MongoDB.
 */
export function formatMonsterForMongo(apiData: any): any {
    return {
        name: apiData.name,
        level: apiData.challenge_rating,
        currentHitpoints: apiData.hit_points,
        maxHitpoints: apiData.hit_points,
        armorClass: apiData.armor_class && apiData.armor_class.length > 0 ? apiData.armor_class[0].value : null,
        challengeRating: apiData.challenge_rating,
        creatureType: [capitalizeFirstLetter(apiData.type)],
        speed: apiData.speed.walk ? parseInt(apiData.speed.walk) : 0,
        movementType: Object.keys(apiData.speed).map(type => capitalizeFirstLetter(type)),
        proficiencyBonus: apiData.proficiency_bonus,
        strength: apiData.strength,
        dexterity: apiData.dexterity,
        intelligence: apiData.intelligence,
        charisma: apiData.charisma,
        constitution: apiData.constitution,
        wisdom: apiData.wisdom,
        vulnerabilities: [apiData.damage_vulnerabilities],
        resistances: [apiData.damage_resistances],
        damageImmunities: [apiData.damage_immunities],
        statusImmunities: [apiData.condition_immunities],
    };
}