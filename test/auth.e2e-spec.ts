import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
// import { setupApp } from '../src/setup-app';

describe('AuthController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    // setupApp(app);
    await app.init();
  });

  it('handler register', () => {
    return request(app.getHttpServer())
      .post('/auth/register')
      .send({name: 'jane doe', email: 'jane2@example.com', password: 'test'})
      .expect(201)
      .then(({body} : request.Response) => {
        expect(body.id).toBeDefined();
        expect(body.name).toBe('jane doe');
        expect(body.email).toBe('jane2@example.com');
      })
  });

  it('handler login after register', async () => {
    const email = 'jane2@example.com';

    const response = await request(app.getHttpServer())
      .post('/auth/register')
      .send({name: 'jane doe', email, password: 'test'})
      .expect(201);

    const cookie = response.get('Set-Cookie');
    const { body } = await request(app.getHttpServer())
      .get('/auth/whoami')
      .set('Cookie', cookie)
      .expect(200);
    
    expect(body.email).toEqual(email);

  })
});
