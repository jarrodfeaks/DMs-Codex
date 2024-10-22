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
    DeathSaves = "Death Saves",
    Dead = "Dead",
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

enum Initative {
    Initative = "Initative",
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
    Walk = "Walk",
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

enum Weapon {
    // Simple Melee Weapons
    Club = "Club",
    Dagger = "Dagger",
    Greatclub = "Greatclub",
    Handaxe = "Handaxe",
    Javelin = "Javelin",
    LightHammer = "Light Hammer",
    Mace = "Mace",
    Quarterstaff = "Quarterstaff",
    Sickle = "Sickle",
    Spear = "Spear",

    // Simple Ranged Weapons
    LightCrossbow = "Light Crossbow",
    Dart = "Dart",
    Shortbow = "Shortbow",
    Sling = "Sling",

    // Martial Melee Weapons
    Battleaxe = "Battleaxe",
    Flail = "Flail",
    Glaive = "Glaive",
    Greataxe = "Greataxe",
    Greatsword = "Greatsword",
    Halberd = "Halberd",
    Lance = "Lance",
    Longsword = "Longsword",
    Maul = "Maul",
    Morningstar = "Morningstar",
    Pike = "Pike",
    Rapier = "Rapier",
    Scimitar = "Scimitar",
    Shortsword = "Shortsword",
    Trident = "Trident",
    WarPick = "War Pick",
    Warhammer = "Warhammer",
    Whip = "Whip",

    // Martial Ranged Weapons
    Blowgun = "Blowgun",
    HandCrossbow = "Hand Crossbow",
    HeavyCrossbow = "Heavy Crossbow",
    Longbow = "Longbow",
    Net = "Net"
}

const WeaponCategories = {
    "Simple Melee Weapons": [
        Weapon.Club,
        Weapon.Dagger,
        Weapon.Greatclub,
        Weapon.Handaxe
    ],
    "Simple Ranged Weapons": [
        Weapon.LightCrossbow,
        Weapon.Dart,
        Weapon.Shortbow,
        Weapon.Sling
    ],
    "Martial Melee Weapons": [
        Weapon.Battleaxe,
        Weapon.Flail,
        Weapon.Glaive,
        Weapon.Greataxe,
        Weapon.Greatsword,
        Weapon.Halberd,
        Weapon.Lance,
        Weapon.Longsword,
        Weapon.Maul,
        Weapon.Morningstar,
        Weapon.Pike,
        Weapon.Rapier,
        Weapon.Scimitar,
        Weapon.Shortsword,
        Weapon.Trident,
        Weapon.WarPick,
        Weapon.Warhammer,
        Weapon.Whip
    ],
    "Martial Ranged Weapons": [
        Weapon.LightCrossbow,
        Weapon.Dart,
        Weapon.Shortbow,
        Weapon.Sling
    ]
}

enum AssistantMode {
    Rules,
    Encounter,
    Chat
}

export { Action, Activity, Attribute, Class, DamageType, Dice, Initative, MonsterType, MovementType, Race, Skill, Status, Weapon, WeaponCategories, AssistantMode };
