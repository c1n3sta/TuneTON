export declare const config: {
    readonly nodeEnv: string;
    readonly isProduction: boolean;
    readonly isDevelopment: boolean;
    readonly serviceName: string;
    readonly port: number;
    readonly host: string;
    readonly apiPrefix: string;
    readonly corsOrigins: string[];
    readonly jwt: {
        readonly secret: string;
        readonly expiresIn: string;
        readonly refreshExpiresIn: string;
        readonly issuer: string;
        readonly audience: string;
    };
    readonly database: {
        readonly url: string;
        readonly logging: boolean;
        readonly synchronize: boolean;
    };
    readonly redis: {
        readonly host: string;
        readonly port: number;
        readonly password: string | undefined;
        readonly ttl: number;
    };
    readonly mq: {
        readonly url: string;
        readonly audioProcessingQueue: "audio-processing";
        readonly notificationQueue: "notifications";
    };
    readonly storage: {
        readonly type: string;
        readonly localPath: string;
        readonly s3: {
            readonly accessKeyId: string | undefined;
            readonly secretAccessKey: string | undefined;
            readonly region: string | undefined;
            readonly bucket: string | undefined;
            readonly endpoint: string | undefined;
        };
    };
    readonly telegram: {
        readonly botToken: string | undefined;
        readonly apiUrl: string;
    };
    readonly sentry: {
        readonly dsn: string | undefined;
        readonly environment: string;
    };
    readonly features: {
        readonly enableTelegramAuth: boolean;
        readonly enableEmailVerification: boolean;
        readonly enableAudioProcessing: boolean;
    };
};
export type Config = typeof config;
export default config;
//# sourceMappingURL=index.d.ts.map