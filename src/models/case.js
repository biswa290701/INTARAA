import mongoose, { Schema, model } from "mongoose";
import AutoIncrementFactory  from 'mongoose-sequence';

const AiCaseSchema = new Schema({
  CaseId: { type: Number, unique: true },
  CasePrompt: { type: String, required: true },
  CaseVoiceId: { type: String, required: true, unique: false, default: "21m00Tcm4TlvDq8ikWAM" },
});

const AutoIncrement = AutoIncrementFactory(mongoose);
AiCaseSchema.plugin(AutoIncrement, { inc_field: 'CaseId' });

const CaseModel = model(process.env.DATABASE_NAME, AiCaseSchema);

async function getCaseById(caseId) {
  try {
    const caseData = await CaseModel.findOne({ CaseId: caseId });
    return caseData;
  } catch (error) {
    console.error("Error fetching case:", error.message);
    throw error;
  }
}

export default getCaseById;
export { CaseModel };