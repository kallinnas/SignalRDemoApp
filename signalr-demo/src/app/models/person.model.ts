export interface Person {
    id: number;
    name: string;
    username: string;
    password: string;
}

export class PersonAuthDto {
    username: string;
    password: string;

    constructor(username: string, password: string) { this.username = username; this.password = password }
}

export class PersonSignalrDto {
    id!: string;
    name!: string;
    signalrConnectionId!: string;
}
