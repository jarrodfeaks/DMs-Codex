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
}

interface Monster {
    _id: string;
    name: string;
    hp: number;
    ac: number;
    initiative: number;
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
    id: number;
    role: 'user' | 'assistant';
    content: string;
}

export { LoginStatus, AssistantMode };
export type { User, Campaign, Player, Message };

