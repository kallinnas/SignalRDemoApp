export class User {
    id!: string;
    role!: number;
    name!: string;
    email!: string;
    password!: string;
}

export class UserAuthDto {
    constructor(
        public email: string,
        public password: string
    ) { }
}

export class UserRegistrDto {
    constructor(
        public email: string,
        public password: string,
        public name: string
    ) { }
}

export class UserSignalrDto {
    id!: string;
    name!: string;
    signalrId!: string;
    token!: string;
}

export class TokenRequest {
    token!: string;
}