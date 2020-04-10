import fs from "mz/fs";
import deepExtend from "deep-extend";

class GlobalOptions {

    // Declare the options for the server
    // note: This is more convenient than declaring a lot of interfaces/classes
    server = {
        address: "localhost",
        port: 8080
    }

    // note: By providing an example, it enables compiler checking
    localUsers = [
        { name: 'sampleUser', password: 'samplePassword' }
    ]

    constructor() {
        this.localUsers = []
        
        try {
            // load file
            const root = JSON.parse(fs.readFileSync('navicore-site.json', 'utf8'));

            // merge json options into default options.
            deepExtend(this.server, root.server);

            // load local users
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
