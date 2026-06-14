// @ts-ignore
import schema from './schema.sql?raw';

class DbService {
    private worker: Worker;
    private callbacks: Map<string, (res: any) => void> = new Map();

    constructor() {
        this.worker = new Worker(new URL('./worker.ts', import.meta.url), {
            type: 'module'
        });

        this.worker.onmessage = (e) => {
            const { type, payload, id } = e.data;
            const callback = this.callbacks.get(id);
            if (callback) {
                if (type === 'ERROR') {
                    console.error('DB Worker Error:', payload);
                }
                callback(payload);
                this.callbacks.delete(id);
            }
        };
    }

    private send(type: string, payload: any): Promise<any> {
        const id = crypto.randomUUID();
        return new Promise((resolve) => {
            this.callbacks.set(id, resolve);
            this.worker.postMessage({ type, payload, id });
        });
    }

    async init() {
        return this.send('INIT', { schema });
    }

    async execute(sql: string) {
        return this.send('EXEC', { sql });
    }

    async select<T>(sql: string): Promise<T[]> {
        return this.send('QUERY', { sql });
    }

    async insert(sql: string, params: any[]) {
        return this.send('INSERT', { sql, params });
    }
}

export const dbService = new DbService();
