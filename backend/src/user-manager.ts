import express from "express";
import loki from "lokijs";
import { sleep } from "./utils";

export const TOKEN_TTL = 1000 * 3600 * 24 * 7; // 7 days
const TOKEN_UPDATE_TIME = 1000 * 3600 * 24; // 1 days

class AuthUser {
    constructor(public username: string, public token: string, public displayName: string) { }
}

let g_creating = false;

class UserManager {
    private tokens: loki.Collection;

    async init(): Promise<any> {
        return new Promise<any>(async (resolve) => {
            if (g_creating) {
                // wait for db loading
                while (!userManager.tokens) {
                    await sleep(10);
                }
                resolve();
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
                    resolve();
                }
            }
        });
    }

    saveToken(username: string, token: string, displayName: string) {
        if (this.tokens && !this.tokens.findOne({ token })) {
            this.tokens.insert({ token, username, displayName });
        }
    }

    removeAllTokens() {
        if (this.tokens) {
            this.tokens.clear();
        }
    }

    findUserWithToken(username: string, token: string): AuthUser {
        const user = this.tokens && this.tokens.findOne({ token });
        if (user && user.username === username) {
            // update ttl in db
            const metaObj: any = user;
            const now = Date.now();
            const lastSaveTime = now - metaObj.meta.created;
            if (lastSaveTime > TOKEN_UPDATE_TIME) {
                this.tokens.update(user);
            }
            return user;
        }
        return undefined;
    }

    removeToken(token: string) {
        const user = this.tokens && this.tokens.findOne({ token });
        if (user) {
            this.tokens.remove(user);
        }
    }

    verifyRequestAndRefreshCookie(req: express.Request, res: express.Response) {
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
    }
}

export const userManager = new UserManager();
