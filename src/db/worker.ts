import sqlite3InitModule from '@sqlite.org/sqlite-wasm';

let db: any = null;

const initDb = async () => {
    try {
        // @ts-ignore
        const sqlite3 = await sqlite3InitModule({
            print: console.log,
            printErr: console.error,
        });

        if ('opfs' in sqlite3) {
            db = new sqlite3.oo1.OpfsDb('/edumanage.db');
            console.log('OPFS SQLite DB initialized at', db.filename);
        } else {
            db = new sqlite3.oo1.DB('/edumanage.db', 'ct');
            console.log('Memory/In-memory SQLite DB initialized');
        }
    } catch (err) {
        console.error('Failed to initialize SQLite:', err);
    }
};

self.onmessage = async (e) => {
    const { type, payload, id } = e.data;

    if (type === 'INIT') {
        await initDb();
        if (payload.schema) {
            db.exec(payload.schema);
        }
        self.postMessage({ type: 'INIT_DONE', id });
        return;
    }

    if (!db) {
        self.postMessage({ type: 'ERROR', payload: 'Database not initialized', id });
        return;
    }

    try {
        switch (type) {
            case 'EXEC':
                db.exec(payload.sql);
                self.postMessage({ type: 'SUCCESS', id });
                break;
            case 'QUERY':
                const results = db.exec(payload.sql, {
                    returnValue: 'resultRows',
                    rowMode: 'object'
                });
                self.postMessage({ type: 'RESULT', payload: results, id });
                break;
            case 'INSERT':
                db.exec({
                    sql: payload.sql,
                    bind: payload.params
                });
                self.postMessage({ type: 'SUCCESS', id });
                break;
            default:
                self.postMessage({ type: 'ERROR', payload: 'Unknown command', id });
        }
    } catch (err: any) {
        self.postMessage({ type: 'ERROR', payload: err.message, id });
    }
};
