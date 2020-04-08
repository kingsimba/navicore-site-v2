import { Guid } from 'guid-typescript';
import express from 'express';
import passport from 'passport';
import LdapStrategy from 'passport-ldapauth'
import bodyParser from 'body-parser'
import { userManager } from './user-manager'

///////////////////////////////////////////////////////////////////////////
// connect to LDAP server
var getLDAPConfiguration = function (req: express.Request, callback: (arg0: any, arg1: LdapStrategy.Options) => void) {
  process.nextTick( () => {

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

export const authRouter = express.Router();

passport.use(new LdapStrategy(getLDAPConfiguration))
authRouter.use(bodyParser.json());
authRouter.use(passport.initialize());
authRouter.post('/login', (req: express.Request, res: express.Response, next: express.NextFunction): void | Response => {

  // return if the user already has correct cookie
  const user = userManager.verifyRequestAndRefreshCookie(req, res);
  if (user) {
    res.send({ status: 200, username: user.username });
    return;
  }

  const username: string = req.body.username;
  if (!username || (!username.endsWith('@mapbar.com') && !username.endsWith('@navinfo.com'))) {
    res.status(401).send({ status: 401, message: 'Incorrect username/password' });
    return;
  }

  // perform MAPBAR LDAP
  passport.authenticate('ldapauth', (err, user, info): void => {
    var error = err || info;
    if (error) {
      res.status(401).send({ status: 401, message: error.message });
    } else if (!user) {
      res.status(500).send({ status: 500, data: info });
    } else {
      const name = req.body.username;
      const token = Guid.create().toString();
      userManager.saveToken(name, token, user.displayName);
      res.cookie('navicore_site_username', name, { maxAge: userManager.maxAge })
        .cookie('navicore_site_displayName', user.displayName, { maxAge: userManager.maxAge })
        .cookie('navicore_site_token', token, { maxAge: userManager.maxAge })
        .send({ status: 200, username: name })
    }
  })(req, res, next);

});

authRouter.post('/logout', (req, res) => {
  res.clearCookie('navicore_site_username')
    .clearCookie('navicore_site_displayName')
    .clearCookie('navicore_site_token')
    .send({ status: 200 });
});
