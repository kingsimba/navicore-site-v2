import { userManager } from "./user-manager";
import { expect } from 'chai';

describe('UserManager', () => {
    before(async () => {
        await userManager.init();
        userManager.removeAllTokens();
    });

    it('should be able to save tokens', () => {
        userManager.saveToken('myname', 'mytoken', 'Zhaolin Feng');
        userManager.saveToken('simba', '1111-1111', 'Zhaolin Feng');
        expect(userManager.findUserWithToken('myname', 'mytoken')).is.not.undefined;
        expect(userManager.findUserWithToken('myname', 'bad-token')).is.undefined;
        expect(userManager.findUserWithToken('bad-name', 'mytoken')).is.undefined;
        expect((userManager.findUserWithToken('myname', 'mytoken')).displayName).equals('Zhaolin Feng');

        expect(userManager.findUserWithToken('simba', '1111-1111')).is.not.undefined;
        userManager.removeToken('1111-1111');
        expect(userManager.findUserWithToken('simba', '1111-1111')).is.undefined;

        userManager.removeAllTokens();
        expect(userManager.findUserWithToken('myname', 'mytoken')).is.undefined;
    });
});
