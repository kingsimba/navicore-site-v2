import express from "express";
import CookieParser from 'cookie-parser';
import { authRouter } from "./auth";
import { docsRouter } from "./docs";
import { globalOptions } from "./global-options";
import { tokenManager as tokenManager } from './token-manager'
var checkCertExpiration = require('check-cert-expiration');

export const app = express();

const address = globalOptions.server.address;
const port = globalOptions.server.port;

// Start loading the database
tokenManager.init();

// The middleware will inject 'cookies' into express.Response
// Afterwards, it's convenient to use thing like 'res.cookies.navicore_site_token'
app.use(CookieParser());

// Sub-routers
app.use('/api/v1/docs', docsRouter);
app.use('/api/v1/auth', authRouter);
app.get('/api/v1/ca', async function (req, res) {
    try {
        if (req.query.host == undefined) {
            res.status(400).send({ status: 400, message: 'Please specify host' });
        } else {
            const { daysLeft, host, port } = await checkCertExpiration(req.query.host);
            res.send({ host, port, daysLeft });
        }
    } catch (err) {
        res.status(500).send({ status: 500, err });
    }
});

// start the Express server
app.listen(port, () => {
    // tslint:disable-next-line:no-console
    console.log(`server started at http://${address}:${port}`);
});
