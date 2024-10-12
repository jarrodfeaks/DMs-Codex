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
    id: number;
    name: string;
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
export type { User, Campaign, Message };

