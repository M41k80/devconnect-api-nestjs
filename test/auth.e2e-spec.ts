import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';

describe('Auth (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/auth/register (POST)', async () => {
    return request(app.getHttpServer())
      .post('/auth/register')
      .send({
        email: 'test@test.com',
        password: '12345678',
        username: 'testuser',
      })
      .expect(201)
      .expect((res) => {
        expect(res.body.email).toBe('test@test.com');
        expect(res.body.password).toBeUndefined();
      });
  });

  it('/auth/login (POST)', async () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'test@test.com',
        password: '12345678',
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.accessToken).toBeDefined();
      });
  });

  afterAll(async () => {
    await app.close();
  });
});
