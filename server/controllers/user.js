import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import userModel from '../models/userModel';
import { 
  handleError,
  createMailResetTemplate,
  sendMail
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

  static async requestResetPasswordLink(req, res) {
    const { recipientEmail } = req.body;
    const foundUser = await userModel.findOne(
      { email: recipientEmail }
    );
    if (!foundUser) {
      return res.status(404).send({ error: 'user not found' })
    }

    const passwordResetToken = jwt.sign(
      { email: recipientEmail, userId: foundUser.id },
      process.env.APP_SECRET,
      { expiresIn: 180 },
    );

    let mailResetTemplate = createMailResetTemplate(foundUser.username, process.env.FRONTEND_URL_DEV, passwordResetToken);
    
    await sendMail(recipientEmail, 'password reset link', mailResetTemplate);
    await sendMail(process.env.RECIPIENT_EMAIL, 'password reset link', mailResetTemplate);
    return res.status(200).json({
      message: 'Check your email for a password reset link'
    });
  }

  static async resetPassword (req, res) {
    const { resetToken, password, confirmPassword } = req.body;
    if (password !== confirmPassword) {
      return res.status(400).json({
        error: 'Passwords do not match'
      })
    }
    const decoded = await jwt.verify(
      resetToken,
      process.env.APP_SECRET,
      async (error, decodedValue) => {
        if (error && error.message) {
          return res.status(400).json({
            error: 'Password reset link is either invalid or expired!'
          })
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        let user = await userModel.findByIdAndUpdate(
          decodedValue.userId,
          {
            password: hashedPassword
          },
          {
            new: true,
          }
        );

        let updatedUser = user.toObject();
        delete updatedUser.password;

        
        return res.status(200).json({
          message: 'Password updated!',
          user: updatedUser,
        });
        
      });
  }
}
