import { tokenManager } from "./token-manager";
import { expect } from 'chai';

describe('TokenManager', () => {
    before(async () => {
        await tokenManager.init();
        tokenManager.removeAllTokens();
    });

    it('should be able to save tokens', () => {
        tokenManager.saveToken('myname', 'mytoken', 'Zhaolin Feng');
        tokenManager.saveToken('simba', '1111-1111', 'Zhaolin Feng');
        expect(tokenManager.findToken('myname', 'mytoken')).is.not.undefined;
        expect(tokenManager.findToken('myname', 'bad-token')).is.undefined;
        expect(tokenManager.findToken('bad-name', 'mytoken')).is.undefined;
        expect((tokenManager.findToken('myname', 'mytoken')).displayName).equals('Zhaolin Feng');

        expect(tokenManager.findToken('simba', '1111-1111')).is.not.undefined;
        tokenManager.removeToken('1111-1111');
        expect(tokenManager.findToken('simba', '1111-1111')).is.undefined;

        tokenManager.removeAllTokens();
        expect(tokenManager.findToken('myname', 'mytoken')).is.undefined;
    });
});
