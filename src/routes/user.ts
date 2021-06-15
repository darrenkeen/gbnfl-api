import { Request, Response, Router } from 'express';
import * as bcrypt from 'bcrypt';

import { User } from '../entities/User';
import { COOKIE_NAME } from '../constants';
import { Player } from '../entities/Player';

const me = async (req: Request, res: Response) => {
  if (!(req.session as any).userId) {
    return res.status(404).json(undefined);
  }

  const user = await User.findOne((req.session as any).userId, {
    relations: ['player'],
  });

  return res.json(user);
};

const register = async (req: Request, res: Response) => {
  const hashedPassword = await bcrypt.hash(req.body.password, 10);

  let user;
  try {
    if (!req.body.firstName || !req.body.lastName) {
      return {
        errors: [
          {
            field: 'firstName',
            message: 'First name and last name cannot be blank',
          },
        ],
      };
    }
    user = new User({
      ...req.body,
      password: hashedPassword,
    });

    await user.save();
    return res.json(user);
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({
      errors: [
        {
          field: 'username',
          message: 'Username already taken',
        },
      ],
    });
  }
};

const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = await User.findOne({
    where: {
      email,
    },
  });
  if (!user) {
    return res.status(401).json({
      errors: [
        {
          field: 'email',
          message: 'Email and/or password is incorrect',
        },
      ],
    });
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    return res.status(401).json({
      errors: [{ field: 'password', message: 'Incorrect password' }],
    });
  }
  (req.session as any).userId = user.id;

  return res.json({ user });
};

const logout = async (req: Request, res: Response) => {
  await new Promise((resolve) =>
    req.session.destroy((err) => {
      res.clearCookie(COOKIE_NAME);
      if (err) {
        console.error(err);
        resolve(false);
        return;
      }

      resolve(true);
    })
  );

  return res.json();
};

const updateUser = async (req: Request, res: Response) => {
  const { body } = req;
  try {
    const player = await Player.findOneOrFail(body.playerId).catch(() => {
      throw new Error('No player');
    });

    let additonalUpdates: Partial<User> = {};

    if (body.email) {
      additonalUpdates.email = body.email;
    }

    await User.update(body.id, { ...additonalUpdates, player });
    return res.json({ text: 'Updated' });
  } catch (e) {
    return res.status(404).json({ error: e });
  }
};

const router = Router();

router.get('/me', me);
router.post('/register', register);
router.post('/login', login);
router.get('/logout', logout);
router.post('/update', updateUser);

export default router;
