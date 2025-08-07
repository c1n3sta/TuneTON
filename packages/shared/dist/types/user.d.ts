export interface User {
    id: string;
    telegramId: string;
    username: string;
    email?: string;
    firstName?: string;
    lastName?: string;
    avatarUrl?: string;
    role: 'user' | 'admin' | 'moderator';
    preferences?: UserPreferences;
    createdAt: Date;
    updatedAt: Date;
}
export interface UserPreferences {
    theme?: 'light' | 'dark' | 'system';
    language?: string;
    notifications?: {
        email?: boolean;
        push?: boolean;
        telegram?: boolean;
    };
    audioQuality?: 'low' | 'medium' | 'high';
    autoplay?: boolean;
    explicitContent?: boolean;
}
export interface CreateUserDto {
    telegramId: string;
    username: string;
    email?: string;
    firstName?: string;
    lastName?: string;
    avatarUrl?: string;
}
export interface UpdateUserDto extends Partial<CreateUserDto> {
    preferences?: Partial<UserPreferences>;
}
export interface UserSession {
    id: string;
    userId: string;
    token: string;
    ipAddress: string;
    userAgent: string;
    expiresAt: Date;
    createdAt: Date;
    updatedAt: Date;
}
//# sourceMappingURL=user.d.ts.map