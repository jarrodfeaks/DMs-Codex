import { Attribute, DamageType, Initative, Skill, Status } from "../../shared/enums";

interface User {
    sid: string; // session ID
    nickname: string;
    name: string;
    picture: string;
    updated_at: string;
    email: string;
    email_verified: boolean;
    sub: string; // user ID
}

// used for assistant state management
interface UserInfo {
    dmId: string;
    rulebookId: string | null;
    assistantId: string | null;
    threadId: string | null;
}

enum LoginStatus {
    Fetching,
    LoggedIn,
    LoggedOut,
    Error
}

interface Campaign {
    _id: string;
    dmId: string;
    name: string;
    players: Player[];
    encounters: Encounter[];
    monsters: Monster[];
}

interface Player {
    _id: string;
    name: string;
    level: number;
    class: string;
    maxHitpoints: number;
    currentHitpoints: number;
    tempHitpoints: number;
    strength: number;
    dexterity: number;
    constitution: number;
    intelligence: number;
    wisdom: number;
    charisma: number;
    armorClass: number;
    customModifiers: Map<Skill | Initative, number>;
    status: Status[];
    temperaroaryModifiers: [Attribute | Skill, number][];
    damageImmunities: DamageType[];
    statusImmunities: Status[];
    resistances: DamageType[];
    vulnerabilities: DamageType[];
    proficiencies: [Attribute | Skill];
}

interface Monster {
    _id: string;
    name: string;
    level: number;
    maxHitpoints: number;
    currentHitpoints: number;
    tempHitpoints: number;
    strength: number;
    dexterity: number;
    constitution: number;
    intelligence: number;
    wisdom: number;
    charisma: number;
    armorClass: number;
    customModifiers: Map<Skill | Initative, number>;
    status: Status[];
    temperaroaryModifiers: [Attribute | Skill, number][];
    damageImmunities: DamageType[];
    statusImmunities: Status[];
    resistances: DamageType[];
    vulnerabilities: DamageType[];
}

interface Encounter {
    _id: string;
    name: string;
    turns: Turn; //
    players: Player[];
    monsters: Monster[];
    initiative_order: Player|Monster[];
    current_turn: string;
    combat_log: string[];
}

interface Turn {
    _id: string;
    unitTurn: Player|Monster;
    action: string;
    weapon: string;
    custom: string;
    targetUnits: [Monster|Player, boolean][];
    hitDiceRoll: number;
    damageRoll: number;
    bonusAction: boolean;
    reaction: boolean;
}

interface Weapon {
    name: string;
    damage: string;
    type: string;
    range: string;
    properties: string;
}

enum AssistantMode {
    Rules,
    Encounter,
    Chat
}

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string | null;
    citations?: unknown[];
}

export { LoginStatus, AssistantMode };
export type { User, UserInfo, Campaign, Player, Message, Monster, Encounter, Turn, Weapon };

