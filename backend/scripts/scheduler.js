import cron from 'node-cron';
import { createCompletionData } from './createCompletionData.js'; // Correct import

// Schedule a task to run every day at 00:00 (midnight)
cron.schedule('0 0 * * *', () => {
  console.log('Running createCompletionData task...');
  createCompletionData('66d2b72f9561977c7f364ea8')
    .then(() => console.log('Completion data created successfully!'))
    .catch((error) => console.error('Error creating completion data:', error));
});
