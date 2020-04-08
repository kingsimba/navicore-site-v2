import fs from "mz/fs";
import deepExtend from "deep-extend";

class GlobalOptions {
    server = {
        address: "localhost",
        port: 8080
    }
    localUsers = [
        { name: 'sampleUser', password: 'samplePassword' }
    ]

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
