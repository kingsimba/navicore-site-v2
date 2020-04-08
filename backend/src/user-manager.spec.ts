import { userManager } from "./user-manager";
import { expect } from 'chai';

describe('UserManager', () => {
    before(async () => {
        await userManager.init();
        userManager.removeAllTokens();
    });

    it('should be able to save tokens', () => {
        userManager.saveToken('myname', 'mytoken', 'Zhaolin Feng');
        expect(userManager.findUserWithToken('myname', 'mytoken')).is.not.undefined;
        expect(userManager.findUserWithToken('myname', 'bad-token')).is.undefined;
        expect(userManager.findUserWithToken('bad-name', 'mytoken')).is.undefined;
        expect((userManager.findUserWithToken('myname', 'mytoken')).displayName).equals('Zhaolin Feng');

        userManager.removeAllTokens();
        expect(userManager.findUserWithToken('myname', 'mytoken')).is.undefined;
    });
});
