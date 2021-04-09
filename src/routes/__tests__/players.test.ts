import 'module-alias/register';
import { logger } from '../../config/logger';
import { Player } from '../../entities/Player';
// import { Player } from '../../entities/Player';

import { TestFactory } from '../../test/factory';
import { populateUsers } from '../../test/populateUsers';

describe('Testing players component', () => {
  const factory: TestFactory = new TestFactory();
  const playerData: Partial<Player> = {
    id: '1',
    name: 'testPost',
    sbmmUrl: 'https://local',
  };

  beforeAll(async () => {
    await factory.init();
    await populateUsers(factory);
  });

  afterAll(async () => {
    await factory.close();
  });

  describe('POST /players', () => {
    it('responds with status 400', (done) => {
      factory.app
        .post('/api/v1/players')
        .send()
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(400, done);
    });

    it('responds with new player', (done) => {
      factory.app
        .post('/api/v1/players')
        .send(playerData)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          try {
            if (err) throw err;

            const player: Player = res.body;

            // Assert status
            expect(res.status === 200);

            Object.keys(playerData).forEach((key) => {
              expect(playerData[key as keyof Player]).toEqual(
                player[key as keyof Player]
              );
            });

            return done();
          } catch (err) {
            return done(err);
          }
        });
    });
  });

  describe('DELETE /players', () => {
    it('responds with status 400 when bad ID', (done) => {
      factory.app
        .delete(`/api/v1/players/bad-id`)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(400, (err, res) => {
          try {
            if (err) throw err;
            const error = res.body;
            expect(error.error).toBeDefined();
            return done();
          } catch (err) {
            return done(err);
          }
        });
    });

    it('responds with 204 when successful', (done) => {
      factory.app
        .delete(`/api/v1/players/${playerData.id}`)
        .set('Accept', 'application/json')
        .expect(204)
        .end(done);
    });
  });

  describe('GET /players', () => {
    it('responds with user array', (done) => {
      console.log('get');
      factory.app
        .get('/api/v1/players')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          try {
            if (err) throw err;

            logger.info(JSON.stringify(res.body));
            // Assert status
            expect(res.status).toEqual(200);

            return done();
          } catch (err) {
            return done(err);
          }
        });
    });
  });
});
