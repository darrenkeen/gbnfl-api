import { Player } from '../entities/Player';
import { TestFactory } from './factory';

export const populateUsers = async (factory: TestFactory) => {
  const testUser = [
    new Player({
      id: '100',
      name: '100TestUser',
      sbmmUrl: 'https://localhost:3000',
    }),
    new Player({
      id: '200',
      name: '200TestUser',
      sbmmUrl: 'https://google.co.uk',
    }),
  ];
  await Promise.all(
    testUser.map(async (p: Partial<Player>) => {
      try {
        console.log('testuser', p);
        await factory.app
          .post('/api/v1/players')
          .send(p)
          .set('Accept', 'application/json');
        return;
      } catch (err) {
        console.error('Couldnt populate users');
        return;
      }
    })
  );
};
