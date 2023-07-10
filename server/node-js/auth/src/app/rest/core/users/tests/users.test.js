import assert from "assert";
import supertest from 'supertest';
import {Server} from '@config';

let appModule = new Server.express()
const api = supertest(appModule.init());

describe('Basic User CRUD Test', function() {
    it('should return number of characters in a string', function() {
        assert.equal('Hello'.length, 5);
    });
    it('should return first character of the string', function() {
        assert.equal('Hello'.charAt(0), 'H');
    });
});
describe('POST /users', function() {
    it('responds with json', function(done) {
        //const externalAPI= supertest('http://localhost:5555');
        api
            .post('/users/create-one')
            .send({name: 'john'})
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function(err, res) {
                if (err) return done(err);
                done();
            });
    });
})