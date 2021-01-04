import express from 'express';
import { tokenManager } from "./token-manager";
import fs from 'mz/fs';
import { globalOptions } from './global-options';

function authenticationMiddleware(req: express.Request, res: express.Response, next: () => void) {
    if (!tokenManager.verifyRequestAndRefreshCookie(req, res)) {
        res.status(401).send({ status: 401, message: 'Please login first' });
    } else {
        next();
    }
}

async function authorizationMiddleware(req: express.Request, res: express.Response, next: () => void) {
    if (await isUserAuthorized(req.params.doc, req.cookies.navicore_site_username)) {
        next();
    } else {
        res.status(403).send({ status: 403, message: 'Forbidden' });
    }
}

// find document name in '<a class="icon icon-home>Document Name</a>'
async function getDocTitle(dirName: string): Promise<string> {
    try {
        const htmlText = await fs.readFile(`docs/${dirName}/index.html`, 'utf8');
        // I should have used DOM, But it's too slow.
        // let title = dom.window.document.querySelector(".icon-home").textContent;
        let titleStart = htmlText.indexOf('class="icon icon-home"');
        if (titleStart != -1) {
            titleStart = htmlText.indexOf('>', titleStart) + 1;
            const titleEnd = htmlText.indexOf('<', titleStart);
            const title = htmlText.substr(titleStart, titleEnd - titleStart);
            return title.trim();
        }
        return null;
    } catch (error) {
        return null;
    }
}

// find document name in '<a class="icon icon-home>Document Name</a>'
export async function isUserAuthorized(dirName: string, username: string): Promise<boolean> {
    try {
        if (globalOptions.superUsers.indexOf(username) != -1) {
            return true;
        }
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
docsRouter.use(authenticationMiddleware);
docsRouter.use('/:doc/', authorizationMiddleware);
docsRouter.use('/', docListMiddleware); // serve static files
docsRouter.use('/', express.static('docs')); // serve static files
docsRouter.use(function (req, res) {    // custom 404 page
    res.status(404).send('404: Page not Found');
});
