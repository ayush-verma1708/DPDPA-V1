// import { exec } from 'child_process';
// import path from 'path';

// // Function to execute the network scan Python script and get the result
// export const networkScan = () => {
//   return new Promise((resolve, reject) => {
//     // Path to your Scapy Python script
//     const pythonScriptPath = path.join(
//       __dirname,
//       '..',
//       'scripts',
//       'scapy_network_scan.py'
//     );

//     // Execute the Python script
//     exec(`python ${pythonScriptPath}`, (error, stdout, stderr) => {
//       if (error) {
//         console.error(`exec error: ${error}`);
//         return reject(new Error('Error executing the network scan script'));
//       }
//       if (stderr) {
//         console.error(`stderr: ${stderr}`);
//         return reject(new Error('Error during network scan execution'));
//       }

//       try {
//         // Parse the JSON output from the Python script
//         const devices = JSON.parse(stdout);
//         resolve(devices); // Return the devices list
//       } catch (parseError) {
//         console.error('Error parsing Python output:', parseError);
//         reject(new Error('Error processing network scan results'));
//       }
//     });
//   });
// };
