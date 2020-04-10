import express from "express";
import CookieParser from 'cookie-parser';
import { authRouter } from "./auth";
import { docsRouter } from "./docs";
import { globalOptions } from "./global-options";
import { tokenManager as tokenManager } from './token-manager'

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

// start the Express server
app.listen(port, () => {
    // tslint:disable-next-line:no-console
    console.log(`server started at http://${address}:${port}`);
});
