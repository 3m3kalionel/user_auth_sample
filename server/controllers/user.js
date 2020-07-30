import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import userModel from '../models/userModel';
import { 
  handleError,
} from '../utils';

export default class User {
  static async createUser(req, res) {
    const { username, phoneNumber, email,  password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const userDetails = {
      username: username.toLowerCase(),
      email: email.toLowerCase(),
      password: hashedPassword,
      phoneNumber,
    };

    return userModel.create(
      userDetails,
      function (error, user) {
        if (error && error.errors) {
          return handleError(error, res);
        }
        const token = jwt.sign(
          { userId: user.id },
          process.env.APP_SECRET,
          {
            expiresIn: 120,
          }
        );
        const  newUser = user.toObject();
        delete newUser.password
        return res.status(201).json({
          newUser,
          token
        })
      }
    )
  }

  static async signIn(req, res) {
    const { email, password } = req.body
    const foundUser = await userModel.findOne({ email }, '-__v');

    if (!foundUser) {
      return res.status(404).send({ error: 'user not found' })
    }
    const isValidPassword = await bcrypt.compare(password, foundUser.password);
    if (!isValidPassword) {
      return res.status(400).json({
        error: 'Username and password don\'t match'
      })
    };
    const token = jwt.sign(
      { userId: foundUser.id },
      process.env.APP_SECRET,
      {
        expiresIn: 120,
      }
    );
    const user = foundUser.toObject();
    delete user.password;
    return res.status(200).json({
      user,
      token
    });
  }
}
