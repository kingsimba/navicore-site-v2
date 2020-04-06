import express from 'express';
import { userManager } from "./user-manager";
import fs from 'mz/fs';
import { JSDOM } from 'jsdom'

export const docsRouter = express.Router();

function authMiddleware(req: express.Request, res: express.Response, next: () => void) {
    const user = userManager.verifyRequestAndRefreshCookie(req, res);
    if (!user) {
        res.status(401);
        res.send({ status: 401, message: 'Please login first' });
    } else {
        next();
    }
}

// find document name in '<a class="icon icon-home>Document Name</a>'
async function getDocName(dirName: string) : Promise<string> {
    try {
        const dom = new JSDOM(await fs.readFile(`docs/${dirName}/index.html`, 'utf8'));
        return dom.window.document.querySelector(".icon-home").textContent;
    } catch (error) {
        return null;
    }
}

// list documents under 'docs' folder
async function docListMiddleware(req: express.Request, res: express.Response, next: () => void) {
    if (req.url == '/') {
        try {
            const docs = [];
            const dirs = await fs.readdir('docs');
            for (const d of dirs) {
                const st = await fs.stat(`docs/${d}`);
                if (st.isDirectory()) {
                    const name = await getDocName(d);
                    if (name) {
                        docs.push({ name: name, path: d });
                    }
                }
            };

            res.status(200);
            res.send({
                status: 200,
                docs: docs
            });
        } catch (error) {
            res.status(500);
            res.send({ status: 500, message: error });
        }
    } else {
        next();
    }
}

docsRouter.use(authMiddleware);
docsRouter.use('/', docListMiddleware); // serve static files
docsRouter.use('/', express.static('docs')); // serve static files
docsRouter.use(function (req, res) {    // custom 404 page
    res.status(404);
    res.send('404: Page not Found');
});
