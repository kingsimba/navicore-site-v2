import fs from "mz/fs";

interface LocalUser {
    name: string;
    password: string;
}

class GlobalOptions {
    localUsers: LocalUser[] = [];

    constructor() {
        try {
            const root = JSON.parse(fs.readFileSync('navicore-site.json', 'utf8'));
            this.localUsers = root.localUsers;
        } catch (error) {

        }
    }

    verifyUserAndPassword(username: string, password: string): boolean {
        const user = this.localUsers.find(o => o.name === username && o.password === password);
        return user != undefined;
    }
}

export const globalOptions = new GlobalOptions();
