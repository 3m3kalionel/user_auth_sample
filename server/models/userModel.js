import mongoose from 'mongoose';
import beautifyUnique from 'mongoose-beautiful-unique-validation';

import { isEmpty } from '../utils';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Please enter a username'],
    validate: {
      validator: function(field) {
        return isEmpty(field);
      },
      message: props => {
        return `input is not a valid ${props.path}`
      }
    },
    unique: '{PATH} {VALUE} is already taken'
  },
  phoneNumber: {
    type: String,
    required: [true, 'Please enter the user\'s phone number'],
    validate: {
      validator: function(field) {
        return isEmpty(field);
      },
      message: props => {
        return `input is not a valid ${props.path}`
      }
    },
    unique: 'Another user exists with the same phone number',
  },
  email: {
    type: String,
    required: [true, 'Please enter your email'],
    validate: {
      validator: function(field) {
        return isEmpty(field);
      },
      message: props => {
        return `input is not a valid ${props.path}`
      }
    },
    unique: 'Another user exists with the same phone number',
  },
  password: {
    type: String,
    required: [true, 'Please enter a  password'],
    validate: {
      validator: function (field) {
        return isEmpty(field);
      },
      message: props => `input is not a valid ${props.path}`
    }
  }
});

userSchema.plugin(beautifyUnique)

export default mongoose.model('User', userSchema);
