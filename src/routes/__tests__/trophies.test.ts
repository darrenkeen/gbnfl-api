import 'module-alias/register';
import { logger } from '../../config/logger';

import { TestFactory } from '../../test/factory';
import { populateUsers } from '../../test/populateUsers';

describe('Testing trophies component', () => {
  const factory: TestFactory = new TestFactory();
  const testTrophies = {
    dateTime: new Date().toISOString(),
    season: 2,
    players: [
      {
        playerId: '100',
        kills: 20,
      },
      {
        playerId: '200',
        kills: 11,
      },
    ],
  };

  beforeAll(async () => {
    await factory.init();
    await populateUsers(factory);
  });

  afterAll(async () => {
    await factory.close();
  });

  describe('POST /trophies', () => {
    it('responds with status 400', (done) => {
      factory.app
        .post('/api/v1/trophies')
        .send()
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(400, done);
    });
    it('responds with new trophies', (done) => {
      factory.app
        .post('/api/v1/trophies')
        .send(testTrophies)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          try {
            if (err) throw err;
            const { data } = res.body;
            expect(data.length).toEqual(testTrophies.players.length);
            return done();
          } catch (err) {
            return done(err);
          }
        });
    });
  });

  describe('GET /trophies/:season', () => {
    it('responds with trophies array', (done) => {
      factory.app.get('/api/v1/trophies/2').end((err, res) => {
        try {
          if (err) throw err;
          // Assert status
          logger.info(JSON.stringify(res.body));
          expect(res.status).toEqual(200);

          res.body.forEach((player: any) => {
            expect(player.trophyCount).toEqual(1);
          });

          return done();
        } catch (err) {
          return done(err);
        }
      });
    });
  });
});
