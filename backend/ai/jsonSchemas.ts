import { z } from "zod";

const DamageType = z.enum([
    "acid",
    "bludgeoning",
    "cold",
    "fire",
    "force",
    "lightning",
    "necrotic",
    "piercing",
    "poison",
    "psychic",
    "radiant",
    "slashing",
    "thunder"
]);

const AbilityScore = z.enum([
    "strength",
    "dexterity",
    "constitution",
    "intelligence",
    "wisdom",
    "charisma"
]);

const Skill = z.enum([
    "acrobatics",
    "animal_handling",
    "arcana",
    "athletics",
    "deception",
    "history",
    "insight",
    "intimidation",
    "investigation",
    "medicine",
    "nature",
    "perception",
    "performance",
    "persuasion",
    "religion",
    "sleight_of_hand",
    "stealth",
    "survival"
])

const MonsterType = z.enum([
    "Aberration",
    "Beast",
    "Celestial",
    "Construct",
    "Dragon",
    "Elemental",
    "Fey",
    "Fiend",
    "Giant",
    "Humanoid",
    "Monstrosity",
    "Ooze",
    "Plant",
    "Undead"
]);

const MovementType = z.enum([
    "Burrow",
    "Walk",
    "Climb",
    "Fly",
    "Hover",
    "Swim"
]);

const Status = z.enum([
    "Blinded",
    "Charmed",
    "Deafened",
    "Frightened",
    "Grappled",
    "Incapacitated",
    "Invisible",
    "Paralyzed",
    "Poisoned",
    "Petrified",
    "Prone",
    "Restrained",
    "Stunned",
    "Unconscious",
    "Exhaustion"
]);

const SavingThrowProficiency = z.object({
    ability_score: AbilityScore,
    is_proficient: z.boolean(),
    modifier: z.number(),
});

const SkillProficiency = z.object({
    skill: Skill,
    is_proficient: z.boolean(),
    modifier: z.number(),
});

const Character = z.object({
    name: z.string().nullable(),
    hit_points: z.object({
        current: z.number().nullable(),
        max: z.number().nullable(),
        temp: z.number().nullable(),
    }),
    armor_class: z.number().nullable(),
    ability_scores: z.object({
        strength: z.number().nullable(),
        dexterity: z.number().nullable(),
        constitution: z.number().nullable(),
        intelligence: z.number().nullable(),
        wisdom: z.number().nullable(),
        charisma: z.number().nullable(),
    }),
    defenses: z.array(DamageType),
    weapons: z.array(z.string()),
    proficiencies: z.object({
        saving_throws: z.array(SavingThrowProficiency),
        skills: z.array(SkillProficiency)
    })
})

const Equipment = z.object({
    name: z.string(),
    quantity: z.number()
})

const Player = Character.extend({
    level: z.number().nullable(),
    race: z.string().nullable(),
    class: z.string().nullable(),
    equipment_list: z.array(Equipment),
    death_saving_throws: z.object({
        success: z.number().nullable(),
        failure: z.number().nullable(),
    }),
})

/********** MONSTER/ENCOUNTER GEN SCHEMAS **********/

const ModifierKey = z.union([
    z.literal("Initative"),
    Skill
]);

const Monster = z.object({
    // Base character fields
    name: z.string(),
    maxHitpoints: z.number(),
    currentHitpoints: z.number(),
    tempHitpoints: z.number().nullable(),
    strength: z.number(),
    dexterity: z.number(),
    constitution: z.number(),
    intelligence: z.number(),
    wisdom: z.number(),
    charisma: z.number(),
    armorClass: z.number(),
    customModifiers: z.record(ModifierKey, z.number()).nullable(),
    status: z.array(Status).nullable(),
    temporaryModifiers: z.array(z.object({
        skill: Skill,
        is_proficient: z.boolean(),
        modifier: z.number()
    })),
    damageImmunities: z.array(DamageType),
    statusImmunities: z.array(Status),
    resistances: z.array(DamageType),
    vulnerabilities: z.array(DamageType),
    weapons: z.array(z.string()), // For ObjectId strings
    proficiencies: z.array(z.union([AbilityScore, Skill])),
    notes: z.string().nullable(),

    // Monster-specific fields
    challengeRating: z.number(),
    creatureType: z.array(MonsterType),
    speed: z.number(),
    movementType: z.array(MovementType),
    proficiencyBonus: z.number(),
});

const EncounterResponse = z.object({
    message: z.string(),
    monsters: z.array(Monster).nullable()
  });


export default { Player, EncounterResponse };
