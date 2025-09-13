import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  // Basic Information
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxLength: [50, 'Name cannot exceed 50 characters']
  },
  
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  
  employeeId: {
    type: String,
    required: [true, 'Employee/Student ID is required'],
    unique: true,
    trim: true
  },
  
  password: {
    type: String,
    required: [true, 'Password is required'],
    minLength: [6, 'Password must be at least 6 characters']
  },
  
  // Role-based access
  role: {
    type: String,
    enum: ['teacher', 'student'],
    required: [true, 'Role is required']
  },
  
  // Additional Information
  department: {
    type: String,
    required: [true, 'Department is required'],
    trim: true
  },
  
  // For Students
  class: {
    type: String,
    required: function() { return this.role === 'student'; }
  },
  
  section: {
    type: String,
    required: function() { return this.role === 'student'; }
  },
  
  // Account Status
  isActive: {
    type: Boolean,
    default: true
  },
  
  // Profile Image (optional)
  profileImage: {
    type: String,
    default: null
  }
  
}, {
  timestamps: true // Adds createdAt and updatedAt automatically
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  // Only hash password if it's been modified
  if (!this.isModified('password')) return next();
  
  // Hash password with salt of 12
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Instance method to check password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Static method to find user by email
userSchema.statics.findByEmail = function(email) {
  return this.findOne({ email: email.toLowerCase() });
};

// Don't return password in JSON
userSchema.methods.toJSON = function() {
  const user = this.toObject();
  delete user.password;
  return user;
};

export default mongoose.model('User', userSchema);
