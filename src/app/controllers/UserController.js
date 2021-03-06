import * as Yup from 'yup';
import User from '../models/User';

class UserController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      password: Yup.string()
        .required()
        .min(6),
      email: Yup.string()
        .required()
        .email(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const userExists = await User.findOne({ where: { email: req.body.email } });

    if (userExists) {
      res.status(400).json({ error: 'User already exists.' });
    }

    const { id, name, email, provider } = await User.create(req.body);

    return res.json({
      id,
      name,
      email,
      provider,
    });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
      oldPassword: Yup.string().min(6),
      password: Yup.string()
        .min(6)
        .when('oldPassworld', (oldPassword, field) =>
          oldPassword ? field.required() : field
        ),
      confirmPassword: Yup.string().when('password', (password, field) =>
        password ? field.required().oneOf([Yup.ref('password')]) : field
      ),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { email, oldPassworld } = req.body;

    const user = await User.findByPk(req.userId);

    if (email !== user.email) {
      const userExists = User.findOne({ where: { email } });

      if (!userExists) {
        return res.status(401).json({ error: 'User alredy exists' });
      }

      if (oldPassworld && !(await user.checkPassword(oldPassworld))) {
        return res.status(401).json({ error: 'Password does not match' });
      }
    }

    const { id, name, provider, avatar_id } = await user.update(req.body);

    return res.json({
      id,
      name,
      email,
      provider,
      avatar_id,
    });
  }
}

export default new UserController();
