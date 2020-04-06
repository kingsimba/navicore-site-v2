import express from 'express';
import { userManager } from "./user-manager";
import fs from 'fs';

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

function docListMiddleware(req: express.Request, res: express.Response, next: () => void) {
    if (req.url == '/') {
        res.status(200);
        res.send({
            status: 200,
            docs: [ { name: 'DocName' }]
        });
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
