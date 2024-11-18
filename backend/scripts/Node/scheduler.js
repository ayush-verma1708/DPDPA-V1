import cron from 'node-cron';
import { createCompletionData } from './createCompletionData.js'; // Correct import
import { generateGroupedNotificationsForAssets } from './notificationCreate.js';

// Schedule a task to run every day at 00:00 (midnight) for createCompletionData
cron.schedule('0 0 * * *', () => {
  console.log('Running createCompletionData task...');
  createCompletionData('66d2b72f9561977c7f364ea8')
    .then(() => console.log('Completion data created successfully!'))
    .catch((error) => console.error('Error creating completion data:', error));
});

// Schedule a task to run every day at 01:00 (1 AM) for generateGroupedNotificationsForAssets
cron.schedule('0 1 * * *', () => {
  console.log('Running generateGroupedNotificationsForAssets task...');
  generateGroupedNotificationsForAssets()
    .then(() => console.log('Notifications generated successfully!'))
    .catch((error) => console.error('Error generating notifications:', error));
});
