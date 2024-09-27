export interface GameStatus {
    status: 'waiting' | 'playing';
    // status: 'connected' | 'waiting' | 'playing';
    thisPlayer?: string;
    player1?: string;
    player2?: string;
    group?: string;
}

export interface Pending {
    waitingFor: string;
}

export interface Disconnect {
    waitingFor: string;
}

export interface Drawn {
    explanation: string;
    scores: string;
}

export interface Won {
    winner: string;
    explanation: string;
    scores: string;
}

interface Output {
    line1: string;
    line2?: string;
    scores?: string;
}