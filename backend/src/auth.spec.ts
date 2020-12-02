import chai from 'chai';
import chaiHttp from 'chai-http';
import { app } from './index';
import Cookie from 'cookie';

const expect = chai.expect;
chai.use(chaiHttp);

const E = encodeURIComponent;

// Enter correct information to pass all tests
const username = '';
const password = '';
const displayName = '';

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

    context('For LDAP users', () => {

        it('should have valid username before testing', async () => {
            expect(username, 'Please enter valid user information to pass all tests').is.not.empty;
            expect(password).is.not.empty;
        });

        it('without password, it should return 400', async () => {
            const res = await chai.request(app)
                .post('/api/v1/auth/login')
                .send({ username });
            expect(res).to.have.status(400);
            expect(res.body.status).equals(400);
        });

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

    context('For local users', () => {

        const LOCAL_USERNAME = 'simba';
        const LOCAL_PASSWORD = "simba'spassword";

        it('should return 200 for local user login', async () => {
            const res = await chai.request(app)
                .post('/api/v1/auth/login')
                .send({ username: LOCAL_USERNAME, password: LOCAL_PASSWORD });
            expect(res).to.have.status(200);
            expect(res.body.status).equals(200);
            expect(res).to.have.cookie('navicore_site_username', LOCAL_USERNAME);
            expect(res).to.have.cookie('navicore_site_displayName', LOCAL_USERNAME);
            expect(res).to.have.cookie('navicore_site_token');

            expect(new Cookies(res).valueWithName('navicore_site_token')).to.be.string;
        });

        it('should return 401 if local user login failed', async () => {
            const res = await chai.request(app)
                .post('/api/v1/auth/login')
                .send({ username: LOCAL_USERNAME, password: 'baspassword' });
            expect(res).to.have.status(401);
            expect(res.body.status).equals(401);
        });
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
