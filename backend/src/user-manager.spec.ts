import { userManager } from "./user-manager";
import { expect } from 'chai';

describe('UserManager', () => {
    userManager.removeTokenFile();
    const o = userManager;

    it('should be able to save tokens', async () => {
        await o.saveToken('myname', 'mytoken', 'Zhaolin Feng');
        expect(o.findUser('myname', 'mytoken')).is.not.undefined;
        expect(o.findUser('myname', 'mytoken').displayName).equals('Zhaolin Feng');
        expect(o.findUser('myname', 'badToken')).is.undefined;
        expect(o.findUser('nonexistName', 'mytoken')).is.undefined;

        o.removeAllTokens();
        expect(o.findUser('myname', 'mytoken')).is.undefined;

        o.loadFile();
        expect(o.findUser('myname', 'mytoken')).is.not.undefined;
    });
});