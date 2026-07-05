export type Role = "ADMIN" | "SELLER" | "BUYER" | "DRIVER";

export type AuthResponse = {
    token: string;
    username: string;
    roles: Role[];
    activeRole: Role | null;
    mustChooseRole: boolean;
};

export type RegisterPayload = {
    username: string;
    email: string;
    phoneNumber: string;
    password: string;
    roles: Role[];
};

export type LoginPayload = {
    username: string;
    password: string;
};