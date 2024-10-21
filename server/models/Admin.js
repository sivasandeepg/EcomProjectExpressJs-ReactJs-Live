const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = require('./User'); // Import base User model

const adminSchema = new Schema({
  permissions: { 
    type: [String], 
    enum: ['manageUsers', 'manageVendors', 'viewReports', 'managePayments'], // Permissions
    default: ['manageUsers', 'manageVendors', 'viewReports', 'managePayments'],
  },
  superAdmin: { 
    type: Boolean, 
    default: true 
  }, // Flag for super admin role
}, { timestamps: true });

const Admin = User.discriminator('admin', adminSchema);
module.exports = Admin;
 