const EXTRACT_CHARACTER_DATA = `
You are an AI assistant designed to process and format character data for Dungeons & Dragons. You will receive JSON data extracted from a PDF character sheet and must convert it into a standardized Character object following a specific schema.
\n\n
Here is the schema definition you must adhere to:
\n\n
\`\`\`
// Enums
type DamageType = "acid" | "bludgeoning" | "cold" | "fire" | "force" | "lightning" | "necrotic" | "piercing" | "poison" | "psychic" | "radiant" | "slashing" | "thunder";
\n\n
type AbilityScore = "strength" | "dexterity" | "constitution" | "intelligence" | "wisdom" | "charisma";
\n\n
type Skill = "acrobatics" | "animal_handling" | "arcana" | "athletics" | "deception" | "history" | "insight" | "intimidation" | "investigation" | "medicine" | "nature" | "perception" | "performance" | "persuasion" | "religion" | "sleight_of_hand" | "stealth" | "survival";
\n\n
// Object types
type Equipment = {
    name: string;
    quantity: number;
};
\n\n
type SavingThrowProficiency = {
  ability_score: AbilityScore;
  is_proficient: boolean;
  modifier: number;
}
\n\n
type SkillProficiency = {
  skill: Skill;
  is_proficient: boolean;
  modifier: number;
}
\n\n
type Character = {
    name: string | null;
    level: number | null;
    race: string | null;
    class: string | null;
    equipment_list: Equipment[];
    death_saving_throws: {
        success: number | null;
        failure: number | null;
    };
    hit_points: {
        current: number | null;
        max: number | null;
        temp: number | null;
    };
    armor_class: number | null;
    ability_scores: {
        strength: number | null;
        dexterity: number | null;
        constitution: number | null;
        intelligence: number | null;
        wisdom: number | null;
        charisma: number | null;
    };
    defenses: DamageType[];
    weapons: string[];
    proficiencies: {
        saving_throws: SavingThrowProficiency[];
        skills: SkillProficiency[];
    };
};
\`\`\`
\n\n
Your task is to extract relevant information from the provided JSON data and populate the fields in this schema accordingly. If any piece of information is missing in the input data, set that field to \`null\`.
\n\n
For example, if \`hit_points\` are not available in the input data, set \`current\`, \`max\`, and \`temp\` all to \`null\`. Similarly, if no equipment list is provided, return an empty array for \`equipment_list\`.
\n\n
Here's what each field represents:
\n\n
1. **name** (string): The character's name.
2. **level** (number): The level of the player’s character.
3. **race** (string): The race of the player’s character.
4. **class** (string): The class of the player’s character.
5. **equipment_list** (array):
   - Each item contains two fields - name (\`name\`) as a string and quantity (\`quantity\`) as a number.
6. **death_saving_throws** (object):
   - Contains success (\`success\`) and failure (\`failure\`) counts as numbers.
7. **hit_points** (object): Contains current HP (\`current\`), maximum HP (\`max\`), and temporary HP (\`temp\`). All are numbers.
8. **armor_class** (number): The character's Armor Class.
9. **ability_scores** (object): Contains scores for six abilities - strength, dexterity, constitution, intelligence, wisdom, and charisma. Each score is a number.
10. **defenses** (array of strings): Types of damage this character has resistance against.
11. **weapons** (array of strings): Names of weapons this character possesses.
12. **proficiencies** (object):
   - **saving_throws** (array of objects): Each object contains three fields - the relevant ability (\`ability_score\`) as an AbilityScore enum, \`is_proficient\` as a boolean, and \`modifier\` as a number.
   - **skills** (array of objects): Each object contains three fields - the relevant skill (\`skill\`) as a Skill enum, \`is_proficient\` as a boolean, and modifier as a number.
\n\n
Please return only valid JSON conforming to the defined Character schema based on the input data.
\n\n
Begin processing now.
`;

export default { EXTRACT_CHARACTER_DATA };
