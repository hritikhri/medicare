const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema(
  {
    // 🔗 Link to User
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    // 🧑‍⚕️ Basic Profile
    bio: {
      type: String,
      maxlength: 1000,
    },

    profilePic: {
      type: String,
      default:
        "https://res.cloudinary.com/dxp5vte7o/image/upload/v1767437280/samples/people/boy-snow-hoodie.jpg",
    },

    // 🎓 Professional Info
    qualifications: [
      {
        degree: String, // MBBS, MD
        university: String,
        year: Number,
      },
    ],

    specializations: {
      type: [String],
      required: true,
    },

    department: {
      type: String, // Cardiology, Orthopedics
    },

    experience: {
      type: Number,
      min: 0,
    },
    
    // 📊 Platform Metrics
    patients:[{
      type:mongoose.Schema.Types.ObjectId,
      ref:"user"
    }],
    
    totalAppointments: {
      type: Number,
      default: 0,
    },

    earnings: {
      type: Number,
      default: 0,
    },

    languagesSpoken: {
      type: [String],
      default: ["English"],
    },

    // 🏥 Clinic / Hospital
    clinic: {
      name: String,
      address: String,
      city: String,
      state: String,
      pincode: String,
      location: {
        type: {
          type: String,
          enum: ["Point"],
          default: "Point",
        },
        coordinates: {
          type: [Number], // [longitude, latitude]
          index: "2dsphere",
        },
      },
    },

    // 🧾 Medical Verification
    medicalLicense: {
      licenseNumber: String,
      issuedBy: String,
      expiryDate: Date,
      documentUrl: String,
    },

    isVerified: {
      type: Boolean,
      default: false, // Admin approval
    },

    // ⏱️ Consultation
    consultationFee: {
      type: Number,
      required: true,
    },

    consultationDuration: {
      type: Number,
      default: 15, // minutes
    },

    consultationModes: {
      online: { type: Boolean, default: true },
      offline: { type: Boolean, default: false },
    },

    availabilitySlots: [
      {
        date: Date,
        time: String,
        isBooked: { type: Boolean, default: false },
      },
    ],


    // ⭐ Ratings & Reviews
    ratings: {
      average: { type: Number, default: 0 },
      count: { type: Number, default: 0 },
    },

    reviews: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        rating: {
          type: Number,
          min: 1,
          max: 5,
        },
        comment: String,
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    // 🚀 Visibility
    isFeatured: {
      type: Boolean,
      default: false,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Doctor", doctorSchema);
