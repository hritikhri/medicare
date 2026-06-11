// Business logic for symptom parsing (mock)
// In prod, integrate with NLP service
const mapSymptomsToSpecialty = (symptoms) => {
  if (symptoms.includes('heart')) return 'Cardiologist';
  // Add more mappings
  return 'General Physician';
};

module.exports = { mapSymptomsToSpecialty };