import express from 'express';
import { userManager } from "./user-manager";

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

docsRouter.use(authMiddleware);
docsRouter.use('/', express.static('docs')); // serve static files
docsRouter.use(function (req, res) {
    res.status(404);
    res.send('404: Page not Found');
});
