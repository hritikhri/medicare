const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');        // Update path as per your structure
const Doctor = require('../models/Doctor');
const Appointment = require('../models/Appointment');
const Notification = require('../models/Notification')

mongoose.connect('mongodb://localhost:27017/telemedhub', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.once('open', async () => {
  console.log('Connected to MongoDB. Starting seeding...');

  try {
    // Clear existing data
    await User.deleteMany({});
    await Doctor.deleteMany({});
    await Appointment.deleteMany({});
    await Notification.deleteMany({});

    console.log('Cleared previous data.');

    // ====================== 10 PATIENTS ======================
    const patients = [];

    const patientData = [
      { name: "Rahul Sharma", email: "rahul.sharma@gmail.com", password: "password123", mobile: "9876543210", bloodGroup: "A+", address: "Sector 12, Ghaziabad" },
      { name: "Priya Verma", email: "priya.verma@gmail.com", password: "password123", mobile: "9876543211", bloodGroup: "B+", address: "Indirapuram, Ghaziabad" },
      { name: "Amit Kumar", email: "amit.kumar@gmail.com", password: "password123", mobile: "9876543212", bloodGroup: "O+", address: "Vaishali, Ghaziabad" },
      { name: "Sneha Gupta", email: "sneha.gupta@gmail.com", password: "password123", mobile: "9876543213", bloodGroup: "AB+", address: "Raj Nagar, Ghaziabad" },
      { name: "Rohan Singh", email: "rohan.singh@gmail.com", password: "password123", mobile: "9876543214", bloodGroup: "A-", address: "Crossings Republik, Ghaziabad" },
      { name: "Anjali Mehta", email: "anjali.mehta@gmail.com", password: "password123", mobile: "9876543215", bloodGroup: "B-", address: "Sahibabad, Ghaziabad" },
      { name: "Vikash Patel", email: "vikash.patel@gmail.com", password: "password123", mobile: "9876543216", bloodGroup: "O-", address: "Vasundhara, Ghaziabad" },
      { name: "Neha Kapoor", email: "neha.kapoor@gmail.com", password: "password123", mobile: "9876543217", bloodGroup: "A+", address: "Kaushambi, Ghaziabad" },
      { name: "Arjun Reddy", email: "arjun.reddy@gmail.com", password: "password123", mobile: "9876543218", bloodGroup: "B+", address: "Mohan Nagar, Ghaziabad" },
      { name: "Kavita Sharma", email: "kavita.sharma@gmail.com", password: "password123", mobile: "9876543219", bloodGroup: "O+", address: "Loni, Ghaziabad" },
    ];

    for (let data of patientData) {
      const user = new User({
        ...data,
        role: 'patient',
        isVerified: true,
        location: { city: "Ghaziabad", state: "U.P", country: "India", pincode: 201001 }
      });
      await user.save();
      patients.push(user);
    }

    console.log('✅ 10 Patients created');

    // ====================== 10 DOCTORS ======================
    const doctors = [];
    const specializationsList = [
      "Cardiology", "Neurology", "Orthopedics", "Pediatrics", "Gynecology",
      "Dermatology", "ENT", "Gastroenterology", "Ophthalmology", "General Medicine"
    ];

    const doctorNames = [
      "Dr. Rajesh Malhotra", "Dr. Sunita Agarwal", "Dr. Vikram Singh", "Dr. Pooja Sharma",
      "Dr. Ankit Verma", "Dr. Meera Nair", "Dr. Karan Bhatt", "Dr. Ritu Kapoor",
      "Dr. Sandeep Reddy", "Dr. Neelam Joshi"
    ];

    for (let i = 0; i < 10; i++) {
      const user = new User({
        name: doctorNames[i],
        email: `doctor${i + 1}@clinic.com`,
        password: "password123",
        mobile: `98888${1000 + i}`,
        role: 'doctor',
        isVerified: true,
        location: { city: "Ghaziabad", state: "U.P", country: "India", pincode: 201001 }
      });
      await user.save();

      const doctor = new Doctor({
        userId: user._id,
        bio: `Experienced ${specializationsList[i]} specialist with over ${5 + i} years of practice.`,
        profilePic: "https://res.cloudinary.com/dxp5vte7o/image/upload/v1779332392/user-profile-icon-circle_1256048-12499_yykyuh.webp",
        qualifications: [
          { degree: "MBBS", university: "AIIMS Delhi", year: 2015 },
          { degree: "MD", university: "PGIMER Chandigarh", year: 2018 }
        ],
        specializations: [specializationsList[i]],
        department: specializationsList[i],
        experience: 5 + i * 2,
        consultationFee: 500 + (i * 100),
        consultationDuration: 15,
        consultationModes: { online: true, offline: true },
        languagesSpoken: ["English", "Hindi"],
        clinic: {
          name: `${specializationsList[i]} Clinic`,
          address: `Sector ${10 + i}, Ghaziabad`,
          city: "Ghaziabad",
          state: "U.P",
          pincode: "201001"
        },
        medicalLicense: {
          licenseNumber: `UPMC${10000 + i}`,
          issuedBy: "Uttar Pradesh Medical Council",
          expiryDate: new Date(2028, 5, 15),
          documentUrl: "https://example.com/license.pdf"
        },
        isVerified: true,
        isFeatured: i % 3 === 0,
        ratings: { average: 4.2 + (i % 3) * 0.3, count: 15 + i * 5 }
      });

      await doctor.save();
      doctors.push(doctor);

      // Link doctor to user
      user.assingnedDoctor = doctor._id; // Note: typo in your schema (should be assignedDoctor)
      await user.save();
    }

    console.log('✅ 10 Doctors created');

    // ====================== APPOINTMENTS ======================
    const appointments = [];

    for (let i = 0; i < 15; i++) {
      const patient = patients[i % 10];
      const doctor = doctors[i % 10];

      const appointmentDate = new Date();
      appointmentDate.setDate(appointmentDate.getDate() + Math.floor(i / 3) + 1);

      const app = new Appointment({
        patientId: patient._id,
        doctorId: doctor._id,
        status: ['pending', 'confirmed', 'completed'][i % 3],
        appointmentDate: appointmentDate,
        time: `${9 + (i % 8)}:00 AM`,
        notes: "Regular checkup" + (i % 3 === 0 ? " - Feeling chest pain" : ""),
      });

      await app.save();
      appointments.push(app);
    }

    console.log('✅ 15 Appointments created');

    // ====================== NOTIFICATIONS ======================
    for (let i = 0; i < 20; i++) {
      const user = i % 2 === 0 ? patients[i % 10]._id : doctors[i % 10].userId;

      const notif = new Notification({
        userId: user,
        type: ['appointment', 'message', 'report', 'recommendation'][i % 4],
        message: [
          "Your appointment with Dr. " + doctors[i % 10].userId.name + " is confirmed tomorrow.",
          "You have a new message from your doctor.",
          "Your blood report is now available.",
          "Dr. " + doctors[i % 10].userId.name + " recommended a follow-up consultation."
        ][i % 4],
        isRead: i % 3 === 0,
        relatedId: appointments[i % appointments.length]?._id
      });

      await notif.save();
    }

    console.log('✅ 20 Notifications created');

    console.log('\n🎉 Seeding completed successfully!');
    console.log(`Patients: 10 | Doctors: 10 | Appointments: 15 | Notifications: 20`);

  } catch (error) {
    console.error('Error during seeding:', error);
  } finally {
    mongoose.disconnect();
  }
});