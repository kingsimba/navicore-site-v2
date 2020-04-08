import express from "express";
import storage from "node-persist";

class AuthUser {
    constructor(public username: string, public token: string, public displayName: string) { }
}

class UserNamager {
    maxAge = 1000 * 3600 * 24 * 7; // 7 days
    private storageCreated = false;

    async initIfNeeded() {
        if (!this.storageCreated) {
            await storage.init({
                dir: './cache',
                stringify: JSON.stringify,
                parse: JSON.parse,
                encoding: 'utf8',
                logging: false,  // can also be custom logging function
                ttl: 1000 * 3600 * 24 * 7, // 7Days: ttl* [NEW], can be true for 24h default or a number in MILLISECONDS or a valid Javascript Date object
                expiredInterval: 2 * 60 * 1000, // every 2 minutes the process will clean-up the expired cache
                forgiveParseErrors: false
            });

            this.storageCreated = true;
        }
    }

    async saveToken(username: string, token: string, displayName: string): Promise<any> {
        await this.initIfNeeded();
        return storage.set(token, new AuthUser(username, token, displayName));
    }

    async removeAllTokens() {
        try {
            await this.initIfNeeded();
            await storage.clear();    
        } catch (error) {
        }
    }

    async findUserWithToken(username: string, token: string) : Promise<AuthUser> | undefined {
        await this.initIfNeeded();
        const user: AuthUser = await storage.get(token);
        if (user && user.username == username) {
            return user;
        }
        return undefined;
    }

    async verifyRequestAndRefreshCookie(req: express.Request, res: express.Response): Promise<AuthUser> {
        try {
            await this.initIfNeeded();
            const name = req.cookies.navicore_site_username;
            const token = req.cookies.navicore_site_token;
            const user: AuthUser = await this.findUserWithToken(name, token);
            if (user) {
                // refersh token Expire time
                res.cookie('navicore_site_username', name, { maxAge: this.maxAge });
                res.cookie('navicore_site_displayName', user.displayName, { maxAge: this.maxAge });
                res.cookie('navicore_site_token', token, { maxAge: this.maxAge });
            }    

            return user;
        } catch (error) {
            return undefined;
        }
    }
}

export const userManager = new UserNamager();
