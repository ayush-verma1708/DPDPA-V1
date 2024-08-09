// seedAdmin.js
import mongoose from 'mongoose';
import User from './models/User.js';
import bcrypt from 'bcryptjs';

const MONGO_URI = 'mongodb+srv://dpdpuser:brInQsw1d2aROZfd@dpdp.z1j1ymf.mongodb.net/?retryWrites=true&w=majority&appName=dpdp';


async function createAdminUser() {
  try {
    await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

    const existingAdmin = await User.findOne({ role: 'admin' });
    if (existingAdmin) {
      console.log('Admin user already exists');
      return;
    }

    const adminPassword = await bcrypt.hash('admin_password', 10);

    const adminUser = new User({
      username: 'admin',
      password: adminPassword,
      role: 'admin'
    });

    await adminUser.save();
    console.log('Admin user created successfully');
  } catch (err) {
    console.error(err);
  } finally {
    mongoose.connection.close();
  }
}

createAdminUser();
