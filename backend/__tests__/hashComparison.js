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
