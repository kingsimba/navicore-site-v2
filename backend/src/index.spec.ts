import chai from 'chai';
import chaiHttp from 'chai-http';
import { app } from './index';

const expect = chai.expect;

chai.use(chaiHttp);

describe('/api/v1/ca', async () => {

    it('return CA information', async () => {
        const res = await chai.request(app)
            .get('/api/v1/ca?host=navicore.cn');
        expect(res).to.have.status(200);
        expect(res.body.daysLeft).is.a('number');
    });

    it('return 400 if no host is given', async () => {
        const res = await chai.request(app)
            .get('/api/v1/ca');
        expect(res).to.have.status(400);
    });
});
