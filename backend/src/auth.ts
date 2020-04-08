import { Guid } from 'guid-typescript';
import express from 'express';
import passport from 'passport';
import LdapStrategy from 'passport-ldapauth'
import bodyParser from 'body-parser'
import { userManager, TOKEN_TTL } from './user-manager'
import { globalOptions } from "./global-options";

// provide LDAP options
var getLdapOptions = function (req: express.Request, callback: (arg0: any, arg1: LdapStrategy.Options) => void) {

  process.nextTick(() => {
    let opts: LdapStrategy.Options = null;

    const username: string = req.body.username;
    const nameWithoutSuffix = username.substr(0, username.lastIndexOf('@'));

    if (username.endsWith('@mapbar.com')) {
      opts = {
        server: {
          url: "ldap://ldap.mapbar.com",
          bindDN: `uid=${nameWithoutSuffix},ou=user,dc=mapbar,dc=com`,
          bindCredentials: req.body.password,
          searchBase: 'ou=user,dc=mapbar,dc=com',
          searchFilter: `uid=${nameWithoutSuffix}`
        }
      }
    } else if (username.endsWith('@navinfo.com')) {
      opts = {
        server: {
          url: 'ldap://192.168.0.151:389',
          bindDN: username,
          bindCredentials: req.body.password,
          searchBase: 'ou=Navinfo,dc=navinfo,dc=net',
          searchFilter: `(&(objectCategory=Person)(sAMAccountName=${nameWithoutSuffix}))`
        }
      };
    }

    callback(null, opts);
  });

};

function responseLoginOK(res: express.Response, username: string, displayName: string) {
  const token = Guid.create().toString();
  userManager.saveToken(username, token, displayName);
  res.cookie('navicore_site_username', username, { maxAge: TOKEN_TTL })
    .cookie('navicore_site_displayName', displayName, { maxAge: TOKEN_TTL })
    .cookie('navicore_site_token', token, { maxAge: TOKEN_TTL })
    .send({ status: 200, username });
}

export const authRouter = express.Router();

passport.use(new LdapStrategy(getLdapOptions));
authRouter.use(bodyParser.json());
authRouter.use(passport.initialize());
authRouter.post('/login', (req: express.Request, res: express.Response, next: express.NextFunction): void => {
  try {
    // return if the user already has correct cookie
    const user = userManager.verifyRequestAndRefreshCookie(req, res);
    if (user) {
      res.send({ status: 200, username: user.username });
      return;
    }

    // check username/password not null
    const username: string = req.body.username;
    const password: string = req.body.password;
    if (!username || !password) {
      res.status(400).send({ status: 400, message: 'Please provide username/password' });
      return;
    }

    // verify local user
    if (!username.endsWith('@mapbar.com') && !username.endsWith('@navinfo.com')) {
      if (globalOptions.verifyLocalUser(username, password)) {
        responseLoginOK(res, username, username);
      }
      else {
        res.status(401).send({ status: 401, message: 'Invalid username/password' });
      }
      return;
    }

    // perform LDAP
    passport.authenticate('ldapauth', (err, user, info): void => {
      var error = err || info;
      if (error) {
        res.status(401).send({ status: 401, message: error.message });
      } else if (!user) {
        res.status(500).send({ status: 500, data: info });
      } else {
        responseLoginOK(res, username, user.displayName);
      }
    })(req, res, next);
  } catch (error) {
    res.status(500).send({ status: 500, error });
  }
});

authRouter.post('/logout', (req, res) => {
  res.clearCookie('navicore_site_username')
    .clearCookie('navicore_site_displayName')
    .clearCookie('navicore_site_token')
    .send({ status: 200 });
});
