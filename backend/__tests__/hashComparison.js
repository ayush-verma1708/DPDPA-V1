import bcrypt from 'bcrypt';

async function testHashing() {
  try {
    const testPassword = 'adminpassword'; // Password to hash
    const saltRounds = 10;

    // Generate a new hash for the test password
    const newHash = await bcrypt.hash(testPassword, saltRounds);

    // Compare the test password with the new hash
    const isMatch = await bcrypt.compare(testPassword, newHash);
  } catch (error) {
    console.error('Error during hashing and comparison:', error);
  }
}

testHashing();

// import bcrypt from 'bcrypt';

// const testPassword = 'adminpassword'; // The password you are testing with
// const storedHash = '$2b$10$EhrBTH5IyWLDDfRxIhkRouMQa6OFP521q051mPx3kizYXHz939Lfy'; // Replace with the actual hash from the database

// // Compare the test password with the stored hash
// const isMatch = await bcrypt.compare(testPassword, storedHash);
// console.log('Password Match:', isMatch); // Should log true if the password and hash match
