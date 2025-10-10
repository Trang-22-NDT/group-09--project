const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const connectDB = require('../config/database');

// Load env
dotenv.config();

// Connect DB
connectDB();

const createAdmin = async () => {
  try {
    // Kiểm tra admin đã tồn tại chưa
    const existingAdmin = await User.findOne({ email: 'admin@group09.com' });
    
    if (existingAdmin) {
      console.log('❌ Admin đã tồn tại!');
      process.exit(0);
    }

    // Tạo admin mới
    const admin = await User.create({
      name: 'Admin Group 09',
      email: 'admin@group09.com',
      password: 'admin123',
      role: 'admin',
      avatar: 'https://i.pravatar.cc/150?img=12',
      bio: 'System Administrator',
      phone: '0123456789',
      address: 'Admin Office'
    });

    console.log('✅ Admin created successfully!');
    console.log('📧 Email:', admin.email);
    console.log('🔑 Password: admin123');
    console.log('👤 Role:', admin.role);
    
    process.exit(0);

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

createAdmin();