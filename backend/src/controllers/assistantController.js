const Doctor = require('../models/Doctor');

exports.getSuggestions = async (req, res, next) => {
  try {
    const { symptoms, location } = req.body;
    // Mock logic: map symptoms to specializations (in prod, use NLP)
    const specializations = ['General Physician']; // e.g., based on symptoms like 'fever' -> 'General'
    let query = { specializations: { $in: specializations } };
    if (location) query['userId.location.city'] = location;

    const doctors = await Doctor.find(query).populate('userId', 'name profilePic location').limit(3);
    res.json({ suggestions: doctors, disclaimer: 'This is not medical advice. Consult a doctor.' });
  } catch (err) {
    next(err);
  }
};