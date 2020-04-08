import express from "express";
import { authRouter } from "./auth";
import { docsRouter } from "./docs";
import CookieParser from 'cookie-parser';
import { globalOptions } from "./global-options";
import { userManager } from './user-manager'

export const app = express();

const address = globalOptions.server.address;
const port = globalOptions.server.port;

userManager.init();

app.use(CookieParser());
app.use('/api/v1/docs', docsRouter);
app.use('/api/v1/auth', authRouter);

// start the Express server
app.listen(port, () => {
    // tslint:disable-next-line:no-console
    console.log(`server started at http://${address}:${port}`);
});
