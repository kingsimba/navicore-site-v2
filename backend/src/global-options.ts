import fs from "mz/fs";
import deepExtend from "deep-extend";

interface LocalUser {
    name: string;
    password: string;
}

interface ServerOptions {
    address: string;
    port: number;
}

interface GlobalOptions {
    server: ServerOptions;
    localUsers: LocalUser[];
}

class GlobalOptions {
    server: ServerOptions = {
        address: "localhost",
        port: 8080
    }
    localUsers: LocalUser[] = []

    constructor() {
        try {
            const root = JSON.parse(fs.readFileSync('navicore-site.json', 'utf8'));
            // merge json options into default options.
            deepExtend(this.server, root.server);
            if (root.localUsers) {
                this.localUsers = root.localUsers;
            }
        } catch (error) {
        }
    }

    verifyLocalUser(username: string, password: string): boolean {
        const user = globalOptions.localUsers.find(o => o.name === username && o.password === password);
        return user != undefined;
    }
}

export const globalOptions = new GlobalOptions();
