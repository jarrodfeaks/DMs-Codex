enum Action {
    Attack = "Attack",
    Dash = "Dash",
    Disengage = "Disengage",
    Dodge = "Dodge",
    Grapple = "Grapple",
    Help = "Help",
    Hide = "Hide",
    Improvise = "Improvise",
    Influence = "Influence",
    Magic = "Magic",
    Ready = "Ready",
    Search = "Search",
    Shove = "Shove",
    Study = "Study",
    Utilize = "Utilize",
}

enum Activity {
    Action = "Action",
    BonusAction = "Bonus Action",
    Reaction = "Reaction",
}

enum Attribute {
    Strength = "Strength",
    Dexterity = "Dexterity",
    Constitution = "Constitution",
    Intelligence = "Intelligence",
    Wisdom = "Wisdom",
    Charisma = "Charisma",
}

enum Class {
    Artificer = "Artificer",
    Barbarian = "Barbarian",
    Bard = "Bard",
    Cleric = "Cleric",
    Druid = "Druid",
    Fighter = "Fighter",
    Monk = "Monk",
    Paladin = "Paladin",
    Ranger = "Ranger",
    Rogue = "Rogue",
    Sorcerer = "Sorcerer",
    Warlock = "Warlock",
    Wizard = "Wizard",
}

enum DamageType {
    Acid = "Acid",
    Bludgeoning = "Bludgeoning",
    Cold = "Cold",
    Fire = "Fire",
    Force = "Force",
    Lightning = "Lightning",
    Necrotic = "Necrotic",
    Piercing = "Piercing",
    Poison = "Poison",
    Psychic = "Psychic",
    Radiant = "Radiant",
    Slashing = "Slashing",
    Thunder = "Thunder",
}

enum Dice {
    D4 = "D4",
    D6 = "D6",
    D8 = "D8",
    D10 = "D10",
    D12 = "D12",
    D20 = "D20",
}

enum MonsterType {
    Aberration = "Aberration",
    Beast = "Beast",
    Celestial = "Celestial",
    Construct = "Construct",
    Dragon = "Dragon",
    Elemental = "Elemental",
    Fey = "Fey",
    Fiend = "Fiend",
    Giant = "Giant",
    Humanoid = "Humanoid",
    Monstrosity = "Monstrosity",
    Ooze = "Ooze",
    Plant = "Plant",
    Undead = "Undead",
}

enum MovementType {
    Burrow = "Burrow",
    Climb = "Climb",
    Fly = "Fly",
    Swim = "Swim",
}

enum Race {
    Dragonborn = "Dragonborn",
    Dwarf = "Dwarf",
    Elf = "Elf",
    Gnome = "Gnome",
    HalfElf = "Half-Elf",
    HalfOrc = "Half-Orc",
    Halfling = "Halfling",
    Human = "Human",
    Tiefling = "Tiefling",
}

enum Skill {
    Athletics = "Athletics",
    Acrobatics = "Acrobatics",
    SleightOfHand = "Sleight of Hand",
    Stealth = "Stealth",
    Arcana = "Arcana",
    History = "History",
    Investigation = "Investigation",
    Nature = "Nature",
    Religion = "Religion",
    AnimalHandling = "Animal Handling",
    Insight = "Insight",
    Medicine = "Medicine",
    Perception = "Perception",
    Survival = "Survival",
    Deception = "Deception",
    Intimidation = "Intimidation",
    Performance = "Performance",
    Persuasion = "Persuasion",
}

enum Status {
    Blinded = "Blinded",
    Charmed = "Charmed",
    Deafened = "Deafened",
    Frightened = "Frightened",
    Grappled = "Grappled",
    Incapacitated = "Incapacitated",
    Invisible = "Invisible",
    Paralyzed = "Paralyzed",
    Poisoned = "Poisoned",
    Petrified = "Petrified",
    Prone = "Prone",
    Restrained = "Restrained",
    Stunned = "Stunned",
    Unconscious = "Unconscious",
    Exhaustion = "Exhaustion",
}

export { Action, Activity, Attribute, Class, DamageType, Dice, MonsterType, MovementType, Race, Skill, Status, };
