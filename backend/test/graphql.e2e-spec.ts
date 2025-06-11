import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('GraphQL Health Check (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('should return health status', () => {
    return request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: `
          query {
            health
          }
        `,
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.data.health).toBe('NoteFlow Backend is running!');
      });
  });
});