import express from "express";
import loki from "lokijs";
import { sleep } from "./utils";

export const TOKEN_TTL = 1000 * 3600 * 24 * 7; // 7 days
const TOKEN_UPDATE_TIME = 1000 * 3600 * 24; // 1 days

class TokenEntry {
    constructor(public token: string, public username: string, public displayName: string) { }
}

let g_creating = false;

class TokenManager {
    private tokens: loki.Collection;

    /**
     * This function open the loki database. It will return a Promise when it's done.
     */
    async init(): Promise<any> {
        return new Promise<any>(async (resolve) => {
            if (g_creating) {
                // It it's already creating, wait for it to finish
                while (!tokenManager.tokens) {
                    await sleep(10);
                }
                resolve();
            }
            else {
                // start loading the database
                g_creating = true;

                // 'lokijs' is a memory database. And it supports persistence.
                const db = new loki("tokens.db", {
                    autoload: true, // load from disk
                    autoloadCallback: databaseInitialize,
                    autosave: true, // 
                    autosaveInterval: 1000 * 60 // one minute
                });

                function databaseInitialize() {
                    if (!db.getCollection("tokens")) {
                        db.addCollection("tokens", { ttl: TOKEN_TTL, ttlInterval: TOKEN_TTL });
                    }

                    tokenManager.tokens = db.getCollection('tokens');
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

    findToken(username: string, token: string): TokenEntry {
        const entry: TokenEntry = this.tokens && this.tokens.findOne({ token });
        if (entry && entry.username === username) {
            // update ttl in db
            const metaObj: any = entry;
            const now = Date.now();
            const lastSaveTime = now - metaObj.meta.created;
            if (lastSaveTime > TOKEN_UPDATE_TIME) {
                this.tokens.update(entry);
            }
            return entry;
        }
        return undefined;
    }

    removeToken(token: string) {
        const user: TokenEntry = this.tokens && this.tokens.findOne({ token });
        if (user) {
            this.tokens.remove(user);
        }
    }

    removeAllTokens() {
        if (this.tokens) {
            this.tokens.clear();
        }
    }

    verifyRequestAndRefreshCookie(req: express.Request, res: express.Response) {
        const name = req.cookies.navicore_site_username;
        const token = req.cookies.navicore_site_token;
        const entry: TokenEntry = this.findToken(name, token);
        if (entry) {
            // refresh token Expire time
            res.cookie('navicore_site_username', name, { maxAge: TOKEN_TTL });
            res.cookie('navicore_site_displayName', entry.displayName, { maxAge: TOKEN_TTL });
            res.cookie('navicore_site_token', token, { maxAge: TOKEN_TTL });
        }

        return entry;
    }
}

export const tokenManager = new TokenManager();
