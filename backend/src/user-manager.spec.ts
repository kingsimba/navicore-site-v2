import { userManager } from "./user-manager";
import { expect } from 'chai';

describe('UserManager', () => {
    userManager.removeAllTokens();
    const o = userManager;

    it('should be able to save tokens', async () => {
        await o.saveToken('myname', 'mytoken', 'Zhaolin Feng');
        expect(await o.findUserWithToken('myname', 'mytoken')).is.not.undefined;
        expect(await o.findUserWithToken('myname', 'bad-token')).is.undefined;
        expect(await o.findUserWithToken('bad-name', 'mytoken')).is.undefined;

        expect((await o.findUserWithToken('myname', 'mytoken')).displayName).equals('Zhaolin Feng');

        await o.removeAllTokens();
        expect(await o.findUserWithToken('myname', 'mytoken')).is.undefined;
    });
});
