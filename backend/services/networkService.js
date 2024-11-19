import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the file name and derive the __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Generic function to run a Python script
const runPythonScript = (scriptName) => {
  return new Promise((resolve, reject) => {
    const pythonScriptPath = path.resolve(
      __dirname,
      '../scripts/Python',
      scriptName
    );

    console.log(`Resolved Python script path: ${pythonScriptPath}`);

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
        console.error(
          `Python script "${scriptName}" failed with code: ${code}`
        );
        reject({
          message: `Python script "${scriptName}" failed`,
          error: errorOutput,
        });
      } else {
        console.log(`Python script "${scriptName}" output:`, output.trim());
        resolve(output.trim());
      }
    });

    // Handle process errors
    pythonProcess.on('error', (err) => {
      console.error(`Error spawning Python script "${scriptName}":`, err);
      reject({
        message: `Error spawning Python script "${scriptName}"`,
        error: err,
      });
    });
  });
};

// Export functions for specific scripts
const getIpAddress = () => runPythonScript('get_ip.py');

const scanNetwork = async () => {
  const output = await runPythonScript('scan_network.py');
  try {
    const devices = JSON.parse(output); // Parse the output as JSON
    return devices;
  } catch (err) {
    console.error('Failed to parse JSON output:', output);
    throw new Error(
      `Failed to parse JSON from scan_network.py: ${err.message}`
    );
  }
};

export default { getIpAddress, scanNetwork };

// import { spawn } from 'child_process';
// import path from 'path';
// import { fileURLToPath } from 'url';

// // Get the file name and derive the __dirname equivalent for ES modules
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// const getIpAddress = () => {
//   return new Promise((resolve, reject) => {
//     const pythonScriptPath = path.resolve(
//       __dirname,
//       '../scripts/Python/get_ip.py'
//     );

//     // Log the resolved Python script path for debugging
//     console.log('Resolved Python script path:', pythonScriptPath);

//     // Spawn the Python process
//     const pythonProcess = spawn('python', [pythonScriptPath]);

//     let output = '';
//     let errorOutput = '';

//     // Collect standard output
//     pythonProcess.stdout.on('data', (data) => {
//       output += data.toString();
//     });

//     // Collect standard error
//     pythonProcess.stderr.on('data', (data) => {
//       errorOutput += data.toString();
//     });

//     // Handle process exit
//     pythonProcess.on('close', (code) => {
//       if (code !== 0) {
//         console.error(`Python script failed with code: ${code}`);
//         reject({ message: 'Python script failed', error: errorOutput });
//       } else {
//         console.log('Python script output:', output);
//         resolve(output.trim());
//       }
//     });

//     // Handle process errors
//     pythonProcess.on('error', (err) => {
//       console.error('Error spawning Python process:', err);
//       reject({ message: 'Error spawning Python process', error: err });
//     });
//   });
// };

// export default { getIpAddress };
