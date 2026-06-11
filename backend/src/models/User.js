  const mongoose = require('mongoose');
  const bcrypt = require('bcryptjs');

  const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    password: { type: String, required: true },
    mobile: { type: String, required: true },
    profilePic:{type:String,default:"https://res.cloudinary.com/dxp5vte7o/image/upload/v1767437280/samples/people/boy-snow-hoodie.jpg"},
    bloodGroup: String,
    address: String,
    location: {
      city: { type: String, default: "Ghaziabad" },
      state: { type: String, default: "U.P" },
      country: { type: String, default: "India" },
      pincode: { type: Number, default: 201001 }
    },
    assingnedDoctor:{
      type:mongoose.Schema.Types.ObjectId,
      ref:"doctor",
    }
    ,
    role: { type: String, enum: ['patient', 'doctor', 'admin'], default: 'patient' },
    isVerified: { type: Boolean, default: false },
    medicalReports: [{ name: String, url: String, uploadDate: { type: Date, default: Date.now } }],
    personalNotes: [{ note: String, date: { type: Date, default: Date.now } }],
    googleId: String
  }, { timestamps: true });

  userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function(password) {
  return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', userSchema);