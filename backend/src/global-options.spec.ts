import { expect } from 'chai';
import { globalOptions } from "./global-options";

describe('GlobalOptions', () => {
    it('should verify password', () => {
        expect(globalOptions.verifyUserAndPassword('simba', "simba'spassword")).to.be.true;
        expect(globalOptions.verifyUserAndPassword('simba', 'bad password')).to.be.false;    
    });
});
