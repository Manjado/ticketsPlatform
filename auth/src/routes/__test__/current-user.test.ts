import request from 'supertest';
import { app } from '../../app';

//TO CHECK
it.skip('responds with details about the current user', async () => {
  const cookie = await global.signin();

  const response = await request(app)
    .get('/api/users/currentuser')
    .set('Cookie', cookie)
    .send()
    .expect(200);

  expect(response.body.currentuser.email).toEqual('test@test.com');
});

//TO CHECK
it.skip('responds with details about the current user', async () => {
  const response = await request(app)
    .get('/api/users/currentuser')
    .send()
    .expect(200);

  expect(response.body.currentuser).toEqual(null);
});
