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
}
