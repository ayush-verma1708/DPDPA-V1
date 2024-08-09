// utils/getNextSequence.js
const mongoose = require('mongoose');

const getNextSequence = async (model, prefix) => {
  const lastEntry = await model.findOne().sort({ _id: -1 }).exec();
  let nextSequence = 1;

  if (lastEntry) {
    const lastID = lastEntry.FixedID;
    const lastSequence = parseInt(lastID.replace(prefix, ''), 10);
    nextSequence = lastSequence + 1;
  }

  return `${prefix}${String(nextSequence).padStart(2, '0')}`;
};

module.exports = getNextSequence;
