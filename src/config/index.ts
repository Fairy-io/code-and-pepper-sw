export interface Config {
    app: { port: number };
    nats: { server: string };
}

export const configuration = (): Config => ({
    app: { port: parseInt(process.env.PORT || '3000') },
    nats: {
        server:
            process.env.NATS_SERVER ||
            'nats://localhost:4222',
    },
});
