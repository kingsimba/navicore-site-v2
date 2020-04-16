import chai from 'chai';
import chaiHttp from 'chai-http';
import { app } from './index';

const expect = chai.expect;

chai.use(chaiHttp);

describe('/api/v1/ca', async () => {

    it('return ca information', async () => {
        const res = await chai.request(app)
            .get('/api/v1/ca');
        expect(res).to.have.status(200);
        expect(res.body.daysLeft).is.a('number');
    });
});
