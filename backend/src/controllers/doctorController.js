const Appointment = require("../models/Appointment");
const Doctor = require("../models/Doctor");
const User = require("../models/User");

exports.getDoctorStats = async (req, res) => {
  try {
    const userId = req.user.id;

    const doctor = await Doctor.findOne({ userId });
    if (!doctor) {
      return res.status(404).json({ success: false, message: "Doctor profile not found" });
    }

    const doctorId = doctor._id;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    const stats = await Appointment.aggregate([
      {
        // ✅ FIXED: was { doctor: doctorId } — field is doctorId
        $match: { doctorId: doctorId }
      },
      {
        // ✅ JOIN Doctor to get consultationFee (doesn't exist on Appointment)
        $lookup: {
          from: 'doctors',
          localField: 'doctorId',
          foreignField: '_id',
          as: 'doctorInfo'
        }
      },
      {
        $addFields: {
          consultationFee: { $arrayElemAt: ['$doctorInfo.consultationFee', 0] }
        }
      },
      {
        $facet: {

          totalAppointments: [
            { $count: 'count' }
          ],

          todaysAppointments: [
            {
              // ✅ FIXED: was { date: ... } — field is appointmentDate
              $match: {
                appointmentDate: { $gte: today, $lt: tomorrow }
              }
            },
            { $count: 'count' }
          ],

          completedAppointments: [
            { $match: { status: 'completed' } },
            { $count: 'count' }
          ],

          pendingAppointments: [
            { $match: { status: 'pending' } },
            { $count: 'count' }
          ],

          cancelledAppointments: [
            { $match: { status: 'cancelled' } },
            { $count: 'count' }
          ],

          monthlyEarnings: [
            {
              $match: {
                status: 'completed',
                // ✅ FIXED: was { date: ... } — field is appointmentDate
                appointmentDate: { $gte: startOfMonth }
              }
            },
            {
              $group: {
                _id: null,
                total: { $sum: '$consultationFee' }
              }
            }
          ],

          totalEarnings: [
            { $match: { status: 'completed' } },
            {
              $group: {
                _id: null,
                total: { $sum: '$consultationFee' }
              }
            }
          ],

          totalPatients: [
            {
              // ✅ FIXED: was { $group: { _id: "$patient" } } — field is patientId
              $group: { _id: '$patientId' }
            },
            { $count: 'count' }
          ]
        }
      }
    ]);

    return res.status(200).json({
      success: true,
      totalAppointments:    stats[0].totalAppointments[0]?.count    || 0,
      todaysAppointments:   stats[0].todaysAppointments[0]?.count   || 0,
      completedAppointments:stats[0].completedAppointments[0]?.count|| 0,
      pendingAppointments:  stats[0].pendingAppointments[0]?.count  || 0,
      cancelledAppointments:stats[0].cancelledAppointments[0]?.count|| 0,
      totalPatients:        stats[0].totalPatients[0]?.count        || 0,
      monthlyEarnings:      stats[0].monthlyEarnings[0]?.total      || 0,
      totalEarnings:        stats[0].totalEarnings[0]?.total        || 0,
    });

  } catch (error) {
    console.error('Doctor stats error:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch doctor statistics' });
  }
};

exports.createDoctorProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const doctor = new Doctor({ userId, ...req.body });
    await doctor.save();
    res.status(201).json(doctor);
  } catch (err) {
    console.log(err);
    next(err);
  }
};

exports.updateDoctorProfile = async (req, res, next) => {
  try {
    const doctorId = req.params.id;
    if (req.user.role !== "doctor")
      return res.status(403).json({ error: "Access denied" });
    const updated = await Doctor.findByIdAndUpdate(doctorId, req.body, {
      new: true,
    });
    res.json(updated);
  } catch (err) {
    console.log(err);
    next(err);
  }
};

exports.getDoctors = async (req, res, next) => {
  try {
    const {
      search,
      specialization,
      location,
      price,
      sort = "ratings.average",
    } = req.query;
    let query = {};
    if (search)
      query = { ...query, "userId.name": { $regex: search, $options: "i" } };
    if (specialization) query.specializations = specialization;
    if (location) query["userId.location.city"] = location;
    if (price) query.consultationFee = { $lte: price };

    const doctors = await Doctor.find(query)
      .populate("userId", "name profilePic location")
      .sort(sort);
    res.json(doctors);
  } catch (err) {
    console.log(err);
    next(err);
  }
};

exports.getDoctorById = async (req, res, next) => {
  try {
    console.log("heyyy");
    if (!req?.params?.id) {
      const doctorId = req.user._id; // or from Doctor model if separate

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

      // Run multiple stats in one efficient query using $facet
      const stats = await Appointment.aggregate([
        {
          $match: {
            doctor: doctorId,
            status: { $in: ["confirmed", "completed"] }, // Only count successful ones
          },
        },
        {
          $facet: {
            totalAppointments: [{ $count: "count" }],
            todaysAppointments: [
              { $match: { date: { $gte: today, $lt: tomorrow } } },
              { $count: "count" },
            ],
            monthlyEarnings: [
              {
                $match: {
                  date: { $gte: startOfMonth },
                  status: "completed",
                },
              },
              {
                $group: {
                  _id: null,
                  earnings: { $sum: "$consultationFee" }, // Add fee field to Appointment model if not present
                },
              },
            ],
            totalUniquePatients: [
              { $group: { _id: "$patient" } },
              { $count: "count" },
            ],
          },
        },
      ]);

      // Safe extraction with defaults
      const result = {
        totalAppointments: stats[0].totalAppointments[0]?.count || 0,
        todaysAppointments: stats[0].todaysAppointments[0]?.count || 0,
        totalPatients: stats[0].totalUniquePatients[0]?.count || 0,
        monthlyEarnings: stats[0].monthlyEarnings[0]?.earnings || 0,
      };

      res.json(result);
    }
    if (req?.params?.id) {
      const doctor = await Doctor.findById(req.params.id)
        .populate("userId", "name profilePic location mobile")
        .populate("reviews.userId", "name");
      // console.log(doctor);
      if (!doctor) return res.status(404).json({ error: "Doctor not found" });
      res.json(doctor);
    }

    const userId = req.user;
    console.log(userId);
    const doctor = new Doctor({ userId, ...req.body });
    await doctor.save();
    res.status(201).json(doctor);
  } catch (err) {
    console.log(err);
    next(err);
  }
};

exports.getDoctorByIdAuth = async (req, res, next) => {
  try {
    // console.log("heyyy");
    if (req?.params?.id) {
      const doctor = await Doctor.findById(req.params.id)
        .populate("userId", "name profilePic location mobile")
        .populate("reviews.userId", "name");
      // console.log(doctor);
      if (!doctor) return res.status(404).json({ error: "Doctor not found" });
      res.json(doctor);
    }

    // const userId = req.user.id;
    // const doctor = new Doctor({ userId, ...req.body });
    // await doctor.save();
    // res.status(201).json(doctor);
  } catch (err) {
    // console.log(err);
    next(err);
  }
};

exports.updateAvailability = async (req, res, next) => {
  try {
    const { slots } = req.body;
    const doctor = await Doctor.findByIdAndUpdate(
      req.user.doctorId,
      { availabilitySlots: slots },
      { new: true },
    );
    res.json(doctor);
  } catch (err) {
    console.log(err);
    next(err);
  }
};

// GET my profile (protected)
exports.getMyProfile = async (req, res, next) => {
  // console.log("ey")
  try {
    const doctor = await Doctor.findOne({ userId: req.user.id }).populate(
      "userId",
      "name email",
    );
    // console.log("the step")
    if (!doctor)
      return res.status(404).json({ error: "Doctor profile not found" });
    // console.log(doctor);
    res.json(doctor);
  } catch (err) {
    console.log(err);
    next(err);
  }
};

// POST create profile (protected)
exports.createProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const existing = await Doctor.findOne({ userId });
    if (existing)
      return res.status(400).json({ error: "Profile already exists" });

    const doctor = new Doctor({
      userId,
      ...req.body, // Override defaults
      ratings: { average: 0, count: 0 },
      reviews: [],
      availabilitySlots: [],
    });
    await doctor.save();
    res.status(201).json(doctor);
  } catch (err) {
    console.log(err);
    next(err);
  }
};

exports.updateDoctorData = async (req, res, next) => {
  try {
    const userId = req.user.id; // from JWT

    // 1. Find doctor linked to this user
    const doctor = await Doctor.findOne({ userId });

    if (!doctor) {
      return res.status(404).json({ message: "Doctor profile not found" });
    }

    // 2. Update doctor using doctor._id
    const updatedDoctor = await Doctor.findByIdAndUpdate(doctor._id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json(updatedDoctor);
  } catch (err) {
    console.error(err);
    next(err);
  }
};

exports.GetPatients = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const doctor = await Doctor.findOne({ userId });
    if (!doctor) {
      return res.status(404).json({ success: false, message: "Doctor not found" });
    }

    // Find all completed/past appointments for this doctor
    // and get unique patients with their stats
    const appointmentStats = await Appointment.aggregate([
      {
        $match: { doctorId: doctor._id }
      },
      {
        $sort: { appointmentDate: -1 }
      },
      {
        $group: {
          _id: '$patientId',
          totalVisits: { $sum: 1 },
          lastVisit: { $first: '$appointmentDate' },  // most recent (sorted desc)
          lastNotes: { $first: '$notes' }
        }
      }
    ]);

    if (appointmentStats.length === 0) {
      return res.status(200).json({ success: true, count: 0, patients: [] });
    }

    const patientIds = appointmentStats.map(a => a._id);

    // Fetch user details for all unique patients
    const users = await User.find(
      { _id: { $in: patientIds } },
      'name email mobile profilePic bloodGroup address personalNotes location'
    );

    // Merge user data with appointment stats
    const patients = users.map(user => {
      const stats = appointmentStats.find(
        a => a._id.toString() === user._id.toString()
      );
      return {
        _id: user._id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        profilePic: user.profilePic,
        bloodGroup: user.bloodGroup,
        address: user.address,
        location: user.location,
        personalNotes: user.personalNotes,  // doctor's notes on this patient
        lastVisit: stats?.lastVisit || null,
        totalVisits: stats?.totalVisits || 0,
        lastAppointmentNotes: stats?.lastNotes || null,
      };
    });

    return res.status(200).json({
      success: true,
      count: patients.length,
      patients
    });

  } catch (err) {
    console.error(err);
    next(err);
  }
};