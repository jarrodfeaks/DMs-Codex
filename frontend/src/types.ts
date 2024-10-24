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
    encounters: unknown[]; // TODO: define these types
    monsters: unknown[];
}

interface Player {
    _id: string;
    name: string;
    level: number;
    class: string;
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
}

export { LoginStatus, AssistantMode };
export type { User, UserInfo, Campaign, Player, Message };

