import chai from 'chai';
import chaiHttp from 'chai-http';
import { app } from './index';
import Cookie from 'cookie';

const expect = chai.expect;
chai.use(chaiHttp);

const E = encodeURIComponent;

const username = 'proxy_ios@mapbar.com';
const password = '0b2gSyBmIVXk';
const displayName = '图吧';

class Cookies {
    private cookies: any[];
    valueWithName(name: string): string {
        const v = this.cookies.find(c => name in c);
        return v[name];
    }
    constructor(response: any) {
        this.cookies = [];
        const cookies = response.header['set-cookie'];
        for (const c of cookies) {
            const parsedCookie = Cookie.parse(c);
            if (parsedCookie) {
                this.cookies.push(parsedCookie);
            }
        }
    }
}

describe('/api/v1/auth/login', async () => {
    it('with wrong password, it should fail', async () => {
        const res = await chai.request(app)
            .post('/api/v1/auth/login')
            .send({ username, password: 'badpassword' });
        expect(res).to.have.status(401);
        expect(res.body.status).equals(401);
        expect(res.body.message).matches(/invalid username/i);
    });

    it('with correct password, it should succ', async () => {
        const res = await chai.request(app)
            .post('/api/v1/auth/login')
            .send({ username, password });
        expect(res).to.have.status(200);
        expect(res.body.status).equals(200);
        expect(res).to.have.cookie('navicore_site_username', E(username));
        expect(res).to.have.cookie('navicore_site_displayName', E(displayName));
        expect(res).to.have.cookie('navicore_site_token');

        expect(new Cookies(res).valueWithName('navicore_site_token')).to.be.string;
    });

    it('should return the same token for double login', async () => {
        let res = await chai.request(app)
            .post('/api/v1/auth/login')
            .send({ username, password });
        expect(res).to.have.status(200);
        expect(res.body.status).equals(200);

        const cookies = new Cookies(res);
        const firstTimeUserName = cookies.valueWithName('navicore_site_username');
        const firstTimeCookie = cookies.valueWithName('navicore_site_token');

        res = await chai.request(app)
            .post('/api/v1/auth/login')
            .set('Cookie', `navicore_site_username=${firstTimeUserName};navicore_site_token=${firstTimeCookie}`)
            .send({ username, password });

        expect(res).to.have.status(200);
        expect(res).to.have.cookie('navicore_site_username', E(username));
        expect(res).to.have.cookie('navicore_site_displayName', E(displayName));
        expect(res).to.have.cookie('navicore_site_token', firstTimeCookie);
    });
});

describe('/api/v1/auth/logout', async () => {
    it('can clear cookie after logout', async () => {
        let res = await chai.request(app)
            .post('/api/v1/auth/login')
            .send({ username, password });
        expect(res).to.have.status(200);
        expect(res).to.have.cookie('navicore_site_username', E(username));
        expect(res).to.have.cookie('navicore_site_displayName', E(displayName));
        expect(res).to.have.cookie('navicore_site_token');

        res = await chai.request(app)
            .post('/api/v1/auth/logout');
        expect(res).not.have.cookie('navicore_site_username')
        expect(res).not.have.cookie('navicore_site_displayName')
        expect(res).not.have.cookie('navicore_site_token')
    });
});
