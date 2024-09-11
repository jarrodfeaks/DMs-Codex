enum Activity {
    Action = "Action",
    BonusAction = "Bonus Action",
    Reaction = "Reaction",
}

enum Alignment {
    lawfulGood = "Lawful Good",
    neutralGood = "Neutral Good",
    chaoticGood = "Chaotic Good",
    lawfulNeutral = "Lawful Neutral",
    trueNeutral = "True Neutral",
    chaoticNeutral = "Chaotic Neutral",
    lawfulEvil = "Lawful Evil",
    neutralEvil = "Neutral Evil",
    chaoticEvil = "Chaotic Evil",
}

enum Status {
    blinded = "Blinded",
    charmed = "Charmed",
    deafened = "Deafened",
    frightened = "Frightened",
    grappled = "Grappled",
    incapacitated = "Incapacitated",
    invisible = "Invisible",
    paralyzed = "Paralyzed",
    poisoned = "Poisoned",
    petrified = "Petrified",
    prone = "Prone",
    restrained = "Restrained",
    stunned = "Stunned",
    unconscious = "Unconscious",
    exhaustion = "Exhaustion",
}

enum DamageType {
    acid = "Acid",
    bludgeoning = "Bludgeoning",
    cold = "Cold",
    fire = "Fire",
    force = "Force",
    lightning = "Lightning",
    necrotic = "Necrotic",
    piercing = "Piercing",
    poison = "Poison",
    psychic = "Psychic",
    radiant = "Radiant",
    slashing = "Slashing",
    thunder = "Thunder",
}

enum Dices {
    D4 = "D4",
    D6 = "D6",
    D8 = "D8",
    D10 = "D10",
    D12 = "D12",
    D20 = "D20",
}

export { Activity, Alignment, DamageType, Dices, Status, };