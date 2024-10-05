import mongoose from 'mongoose';

const ComplianceSnapshotSchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now },
  totalAssets: { type: Number, required: true },
  assets: [
    {
      assetId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Asset',
        required: true,
      },
      name: { type: String },
      type: { type: String },
      desc: { type: String },
      isScoped: { type: Boolean, default: false },
      completionStatus: {
        isCompleted: { type: Boolean, default: false },
        feedback: { type: String, default: null },
        history: [
          {
            modifiedAt: { type: Date, default: Date.now },
            modifiedBy: {
              type: mongoose.Schema.Types.ObjectId,
              ref: 'User',
            },
            changes: { type: Map, of: String },
          },
        ],
      },
    },
  ],
  overallRiskScore: { type: Number, default: 0 },
});

export const ComplianceSnapshot = mongoose.model(
  'ComplianceSnapshot',
  ComplianceSnapshotSchema
);
