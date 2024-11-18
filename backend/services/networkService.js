import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the file name and derive the __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const getIpAddress = () => {
  return new Promise((resolve, reject) => {
    const pythonScriptPath = path.resolve(
      __dirname,
      '../scripts/Python/get_ip.py'
    );

    // Log the resolved Python script path for debugging
    console.log('Resolved Python script path:', pythonScriptPath);

    // Spawn the Python process
    const pythonProcess = spawn('python', [pythonScriptPath]);

    let output = '';
    let errorOutput = '';

    // Collect standard output
    pythonProcess.stdout.on('data', (data) => {
      output += data.toString();
    });

    // Collect standard error
    pythonProcess.stderr.on('data', (data) => {
      errorOutput += data.toString();
    });

    // Handle process exit
    pythonProcess.on('close', (code) => {
      if (code !== 0) {
        console.error(`Python script failed with code: ${code}`);
        reject({ message: 'Python script failed', error: errorOutput });
      } else {
        console.log('Python script output:', output);
        resolve(output.trim());
      }
    });

    // Handle process errors
    pythonProcess.on('error', (err) => {
      console.error('Error spawning Python process:', err);
      reject({ message: 'Error spawning Python process', error: err });
    });
  });
};

export default { getIpAddress };
