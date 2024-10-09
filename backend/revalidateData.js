import mongoose from 'mongoose';
import Action from './models/action.js';
import { checkAndUpdateActionCompletion } from './utils/completionUtils.js';

const revalidateData = async () => {
  const actions = await Action.find();
  for (const action of actions) {
    await checkAndUpdateActionCompletion(action._id);
  }
  mongoose.connection.close();
};

mongoose
  .connect('mongodb://localhost:27017/yourdb', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => revalidateData())
  .catch((err) => console.error('Error connecting to database:', err));
