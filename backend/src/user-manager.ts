import express from "express";
import loki from "lokijs";
import { sleep } from "./utils";

export const TOKEN_TTL = 1000 * 3600 * 24 * 7; // 7 days

class AuthUser {
    constructor(public username: string, public token: string, public displayName: string) { }
}

let g_creating = false;
let g_created = false;

export class UserManager {
    private tokens: loki.Collection;

    static init(): Promise<any> {
        return new Promise<any>(async (solve) => {
            if (g_creating) {
                while (!g_created) {
                    await sleep(10);
                }
                solve();
            }
            else {
                g_creating = true;
                const db = new loki("tokens.db", {
                    autoload: true,
                    autoloadCallback: databaseInitialize,
                    autosave: true,
                    autosaveInterval: 5000
                });

                function databaseInitialize() {
                    if (!db.getCollection("tokens")) {
                        db.addCollection("tokens", { ttl: TOKEN_TTL, ttlInterval: TOKEN_TTL });
                    }

                    userManager.tokens = db.getCollection('tokens');
                    g_created = true;

                    solve();
                }
            }
        });
    }

    saveToken(username: string, token: string, displayName: string) {
        if (!this.tokens.findOne({ token })) {
            this.tokens.insert({ token, username, displayName });
        }
    }

    removeAllTokens() {
        this.tokens.clear();
    }

    findUserWithToken(username: string, token: string): AuthUser {
        const user = this.tokens.findOne({ token });
        if (user && user.username === username) {
            return user;
        }
        return undefined;
    }

    verifyRequestAndRefreshCookie(req: express.Request, res: express.Response) {
        try {
            const name = req.cookies.navicore_site_username;
            const token = req.cookies.navicore_site_token;
            const user: AuthUser = this.findUserWithToken(name, token);
            if (user) {
                // refersh token Expire time
                res.cookie('navicore_site_username', name, { maxAge: TOKEN_TTL });
                res.cookie('navicore_site_displayName', user.displayName, { maxAge: TOKEN_TTL });
                res.cookie('navicore_site_token', token, { maxAge: TOKEN_TTL });
            }

            return user;
        } catch (error) {
            return undefined;
        }
    }
}

export const userManager = new UserManager();
