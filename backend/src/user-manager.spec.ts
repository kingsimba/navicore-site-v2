import { userManager, UserManager } from "./user-manager";
import { expect } from 'chai';

let o: UserManager = undefined;

describe('UserManager', () => {
    before(async () => {
        await UserManager.init();
        userManager.removeAllTokens();
        o = userManager;
    });

    it('should be able to save tokens', () => {
        o.saveToken('myname', 'mytoken', 'Zhaolin Feng');
        expect(o.findUserWithToken('myname', 'mytoken')).is.not.undefined;
        expect(o.findUserWithToken('myname', 'bad-token')).is.undefined;
        expect(o.findUserWithToken('bad-name', 'mytoken')).is.undefined;
        expect((o.findUserWithToken('myname', 'mytoken')).displayName).equals('Zhaolin Feng');

        o.removeAllTokens();
        expect(o.findUserWithToken('myname', 'mytoken')).is.undefined;
    });
});
