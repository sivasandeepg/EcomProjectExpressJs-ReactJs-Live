const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const baseOptions = {
  discriminatorKey: 'role', // Used to distinguish user types
  collection: 'users',
  timestamps: true, // Automatically adds createdAt and updatedAt fields
};
 
const userSchema = new Schema({
  googleId: { 
    type: String, 
    required: true, 
    unique: true, 
    index: true 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true, 
    index: true, 
    validate: {
      validator: function(v) {
        return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(v);
      },
      message: props => `${props.value} is not a valid email!`
    }
  },
  displayName: { 
    type: String, 
    required: true 
  },
  phone: { 
    type: String,
    validate: {
      validator: function(v) {
        return /\d{10}/.test(v); // Ensure phone number is 10 digits
      },
      message: props => `${props.value} is not a valid phone number!`
    }
  },
  avatarUrl: { type: String }, // Optional profile image
  role: { 
    type: String, 
    enum: ['customer', 'vendor', 'admin'], 
    default: 'customer' 
  }, // Customer is default role
  active: { 
    type: Boolean, 
    default: true 
  }, // Soft delete or deactivation option
}, baseOptions);

const User = mongoose.model('User', userSchema);
module.exports = User;
