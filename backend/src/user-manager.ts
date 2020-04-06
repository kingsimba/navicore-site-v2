import express from "express";
import fs from 'fs';

class AuthUser {
    constructor(public username: string, public token: string, public displayName: string) { }
}

class UserNamager {
    maxAge = 1000 * 60 * 24 * 7; // 7 days
    private tokenFile = 'tokens.json';

    tokens: AuthUser[];

    constructor() {
        this.loadFile();
    }

    removeTokenFile() {
        try {
            if (fs.existsSync(this.tokenFile)) {
                fs.unlinkSync(this.tokenFile);
            }
        } catch (error) {
        }
    }

    loadFile() {
        try {
            const data = fs.readFileSync(this.tokenFile, 'utf-8');
            this.tokens = JSON.parse(data);
        } catch (error) {
            this.tokens = [];
        }
    }

    saveFile(): Promise<any> {
        return new Promise((resolve) => {
            const data = JSON.stringify(this.tokens);
            fs.writeFile(this.tokenFile, data, () => {
                resolve();
            });
        });
    }

    findUser(username: string, token: string): AuthUser | null {
        const result = this.tokens.find(o => o.username == username && o.token == token);
        return result;
    }

    saveToken(username: string, token: string, displayName: string): Promise<any> {
        if (this.findUser(username, token) == null) {
            this.tokens.push(new AuthUser(username, token, displayName));
            return this.saveFile();
        } else {
            return null;
        }
    }

    removeAllTokens() {
        this.tokens = [];
    }

    verifyRequestAndRefreshCookie(req: express.Request, res: express.Response): AuthUser {
        const name = req.cookies.navicore_site_username;
        const token = req.cookies.navicore_site_token;
        const user = this.findUser(name, token);
        if (user) {
            // refersh token Expire time
            res.cookie('navicore_site_username', name, { maxAge: this.maxAge });
            res.cookie('navicore_site_displayName', user.displayName, { maxAge: this.maxAge });
            res.cookie('navicore_site_token', token, { maxAge: this.maxAge });
        }
        return user;
    }
}

export const userManager = new UserNamager();
