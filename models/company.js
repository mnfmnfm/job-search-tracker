const Company = function(name, status, notes) {
  const result = {};
  result.name = name;
  result.status = status;
  result.notes = notes;
  return result;
}

module.exports = Company;
