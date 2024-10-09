import multer from 'multer';
import path from 'path';
import Evidence from '../models/Evidence.js';

// Set up storage configuration for multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// Middleware for file upload
export const uploadFile = upload.single('file');

// Create evidence
// export const createEvidence = async (req, res) => {
//   try {
//     const fileUrl = req.file ? `/uploads/${req.file.filename}` : '';
//     const evidence = new Evidence({
//       fileName: req.file.originalname,
//       fileType: req.file.mimetype,
//       fileSize: req.file.size,
//       fileUrl: fileUrl,
//       assetId: req.body.assetId || null,
//       scopeId: req.body.scopeId || null,
//       actionId: req.body.actionId || null,
//       familyId: req.body.familyId || null,
//       controlId: req.body.controlId || null,
//       uploadedAt: new Date(), // Timestamp of upload
//     });
//     await evidence.save();
//     res.status(201).json(evidence);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };
// Create evidence
export const createEvidence = async (req, res) => {
  try {
    const fileUrl = req.file ? `/uploads/${req.file.filename}` : '';
    const evidence = new Evidence({
      fileName: req.file ? req.file.originalname : '',
      fileType: req.file ? req.file.mimetype : '',
      fileSize: req.file ? req.file.size : 0,
      fileUrl: fileUrl,
      assetId: req.body.assetId || null,
      scopeId: req.body.scopeId || null,
      actionId: req.body.actionId || null,
      familyId: req.body.familyId || null,
      controlId: req.body.controlId || null,
      uploadedAt: new Date(), // Timestamp of upload
      username: req.body.username || '', // Include username
    });
    await evidence.save();
    res.status(201).json(evidence);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all evidences
export const getAllEvidences = async (req, res) => {
  const { actionId, assetId, scopeId, controlId, familyId } = req.query;
  try {
    const status = await Evidence.findOne({
      actionId,
      assetId,
      scopeId,
      controlId,
      familyId,
    });
    res.status(200).json(status);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get evidence by ID
export const getEvidenceById = async (req, res) => {
  try {
    const evidence = await Evidence.findById(req.params.id);
    if (!evidence) {
      return res.status(404).json({ message: 'Evidence not found' });
    }
    res.status(200).json(evidence);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update evidence
export const updateEvidence = async (req, res) => {
  try {
    const evidence = await Evidence.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!evidence) {
      return res.status(404).json({ message: 'Evidence not found' });
    }
    res.status(200).json(evidence);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete evidence
export const deleteEvidence = async (req, res) => {
  try {
    const evidence = await Evidence.findByIdAndDelete(req.params.id);
    if (!evidence) {
      return res.status(404).json({ message: 'Evidence not found' });
    }
    res.status(200).json({ message: 'Evidence deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getEvidenceByParams = async (req, res) => {
  const { assetId, scopeId, actionId, familyId, controlId } = req.body;
  let statuses;
  try {
    if (scopeId == '') {
      statuses = await Evidence.findOne({
        $and: [{ assetId }, { actionId }, { familyId }, { controlId }],
      });
    } else {
      statuses = await Evidence.findOne({
        $and: [
          { assetId },
          { scopeId },
          { actionId },
          { familyId },
          { controlId },
        ],
      });
    }

    return res.status(200).json(statuses);
  } catch (err) {
    console.error('Error in getStatus:', err);
    return res
      .status(500)
      .json({ error: 'An error occurred while fetching completion statuses.' });
  }
};
