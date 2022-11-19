// Tragically, Firestore can't handle anything made with the new keyword - factory to get around this
const Company = function(name, status, notes) {
  const result = {};
  result.name = name;
  result.status = status;
  result.notes = notes;
  return result;
}

module.exports = Company;
