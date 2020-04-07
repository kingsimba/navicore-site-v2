import chai from 'chai';
import chaiHttp from 'chai-http';
import { app } from './index';
import { userManager } from './user-manager';

const expect = chai.expect;
chai.use(chaiHttp);

describe('/api/v1/docs', async () => {
    before( async () => {
        await userManager.saveToken('simba', '1111-1111', 'Zhaolin Feng');
        await userManager.saveToken('god_incarbinate@navinfo.com', '1111-1111', 'God Himself');
    });

    it('should return 401 if access token is incorrect', async () => {
        let res = await chai.request(app)
            .get('/api/v1/docs/sample.html');
        expect(res).to.have.status(401);
        expect(res.body.status).equals(401);
        expect(res.body.message).equals('Please login first');
    });

    it('should return 200 if access token is correct', async () => {
        let res = await chai.request(app)
            .get('/api/v1/docs/sample.html')
            .set('Cookie', 'navicore_site_username=simba;navicore_site_token=1111-1111');
        expect(res).to.have.status(200);
        expect(res.text).matches(/This is a static sample HTML page/);
    });

    it('should return 404 if page is not found', async () => {
        let res = await chai.request(app)
            .get('/api/v1/docs/non-exist.html')
            .set('Cookie', 'navicore_site_username=simba;navicore_site_token=1111-1111');
        expect(res).to.have.status(404);
        expect(res.text).matches(/404: Page not found/i);
    });

    it('should return document list with docs/', async () => {
        let res = await chai.request(app)
            .get('/api/v1/docs')
            .set('Cookie', 'navicore_site_username=simba;navicore_site_token=1111-1111');
        expect(res).to.have.status(200);
        expect(res.body.docs).is.an('Array')
            .and.have.lengthOf(2)
            .and.deep.contains({ title: 'NaviCore Public Documents', path: 'navicore-public-docs'})
            .and.deep.contains({ title: 'Competitive Analysis', path: 'competitive-analysis'});

        // simba don't have access
        expect(res.body.docs).not.deep.contains({ title: 'Top Secret Document', path: 'top-secret'})

        // But God have access
        res = await chai.request(app)
            .get('/api/v1/docs')
            .set('Cookie', 'navicore_site_username=god_incarbinate@navinfo.com;navicore_site_token=1111-1111');
        expect(res).to.have.status(200);
        expect(res.body.docs).is.an('Array')
            .and.have.lengthOf(3)
            .and.deep.contains({ title: 'NaviCore Public Documents', path: 'navicore-public-docs'})
            .and.deep.contains({ title: 'Competitive Analysis', path: 'competitive-analysis'})
            .and.deep.contains({ title: 'Top Secret Document', path: 'top-secret'})
    });
});
