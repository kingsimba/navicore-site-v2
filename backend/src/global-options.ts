import fs from "mz/fs";

interface LocalUser {
    name: string;
    password: string;
}

interface ServerOptions {
    address: string;
    port: number;
}

class GlobalOptions {
    serverOpts: ServerOptions = { address: 'localhost', port: 8080 };
    localUsers: LocalUser[] = [];

    constructor() {
        try {
            const root = JSON.parse(fs.readFileSync('navicore-site.json', 'utf8'));
            this.localUsers = root.localUsers;
            this.serverOpts = root.server;
        } catch (error) {
        }
    }

    verifyUserAndPassword(username: string, password: string): boolean {
        const user = this.localUsers.find(o => o.name === username && o.password === password);
        return user != undefined;
    }
}

export const globalOptions = new GlobalOptions();
