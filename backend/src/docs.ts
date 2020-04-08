import express from 'express';
import { userManager } from "./user-manager";
import fs from 'mz/fs';
import { JSDOM } from 'jsdom'

async function authMiddleware(req: express.Request, res: express.Response, next: () => void) {
    const user = await userManager.verifyRequestAndRefreshCookie(req, res)
    if (!user) {
        res.status(401).send({ status: 401, message: 'Please login first' });
    } else {
        next();
    }
}

// find document name in '<a class="icon icon-home>Document Name</a>'
async function getDocTitle(dirName: string): Promise<string> {
    try {
        const dom = new JSDOM(await fs.readFile(`docs/${dirName}/index.html`, 'utf8'));
        let title = dom.window.document.querySelector(".icon-home").textContent;
        const m = title.match(/[\s\r\n]*(.+)[\s\r\n]*/)
        if (m) {
            return m[1];
        } else {
            return null;
        }
    } catch (error) {
        return null;
    }
}

// find document name in '<a class="icon icon-home>Document Name</a>'
export async function isUserAuthorized(dirName: string, username: string): Promise<boolean> {
    try {
        const file = await fs.readFile(`docs/${dirName}/authorize.txt`, 'utf8');
        const lines = file.split('\n').map(o => o.trim());
        for (const line of lines) {
            if (line === '*' || line === username || `${line}@mapbar.com` === username) {
                return true;
            }
        }
        return false;
    } catch (error) {
        return false;
    }
}

// list documents under 'docs' folder
async function docListMiddleware(req: express.Request, res: express.Response, next: () => void) {
    if (req.url === '/') {
        try {
            const docs = [];
            const dirs = await fs.readdir('docs');
            for (const d of dirs) {
                const title = await getDocTitle(d);
                if (title && await isUserAuthorized(d, req.cookies.navicore_site_username)) {
                    docs.push({ title, path: d });
                }
            };

            res.send({ status: 200, docs: docs });
        } catch (error) {
            res.status(500).send({ status: 500, message: error });
        }
    } else {
        next();
    }
}

//////////////////////////////////////////////////////////////////////////////////
export const docsRouter = express.Router();
docsRouter.use(authMiddleware);
docsRouter.use('/', docListMiddleware); // serve static files
docsRouter.use('/', express.static('docs')); // serve static files
docsRouter.use(function (req, res) {    // custom 404 page
    res.status(404).send('404: Page not Found');
});
