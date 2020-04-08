import { expect } from 'chai';
import { globalOptions } from "./global-options";

describe('GlobalOptions', () => {
    it('should load options correctly', () => {
        expect(globalOptions.server.port).equals(9080);
    });

	it('should verify password', () => {
        expect(globalOptions.verifyLocalUser('simba', "simba'spassword")).to.be.true;
        expect(globalOptions.verifyLocalUser('simba', 'bad password')).to.be.false;    
    });
});
