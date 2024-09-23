import mongoose, { Schema, Document } from "mongoose";

export interface User extends Document {
  _id: string; // Explicitly declare the _id field
  name: string;
  email?: string;
  password?: string;
  audioFiles?: mongoose.Types.ObjectId[] | AudioFile[];
  stts?: mongoose.Types.ObjectId[] | STT[];
  processedTexts?: mongoose.Types.ObjectId[] | ProcessedText[];
  tokens: Number;
  minutes: Number;
}

export const UserSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  audioFiles: [{ type: Schema.Types.ObjectId, ref: "AudioFile" }],
  stts: [{ type: Schema.Types.ObjectId, ref: "STT" }],
  processedTexts: [{ type: Schema.Types.ObjectId, ref: "ProcessedText" }],
  tokens: { type: Number, required: true, default: 0 },
  minutes: { type: Number, required: true, default: 0 },
});

export const UserModel = mongoose.models.User || mongoose.model<User>("User", UserSchema);

export interface AudioFile extends Document {
  _id: string; // Explicitly declare the _id field
  userId: string;
  fileName: string;
  uploadedAt: Date;
  sttId?: string;
  requestId?: string;
  processedTextId?: string;
}

const AudioFileSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  fileName: { type: String, required: true },
  uploadedAt: { type: Date, default: Date.now },
  sttId: { type: Schema.Types.ObjectId, ref: "STT" },
  requestId: { type: String, required: false },
  processedTextId: { type: Schema.Types.ObjectId, ref: "ProcessedText" },
});

export const AudioFileModel =
  mongoose.models.AudioFile || mongoose.model<AudioFile>("AudioFile", AudioFileSchema);

export interface STT extends Document {
  _id: string; // Explicitly declare the _id field
  userId: string;
  audioId: mongoose.Types.ObjectId | AudioFile;
  content: string;
  uploadedAt: Date;
  processedTextId?: string;
}

const STTSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  audioId: { type: Schema.Types.ObjectId, ref: "AudioFile", required: true },
  content: { type: String, required: true },
  uploadedAt: { type: Date, default: Date.now },
  processedTextId: { type: Schema.Types.ObjectId, ref: "ProcessedText", default: null },
});

export const STTModel = mongoose.models.STT || mongoose.model<STT>("STT", STTSchema);

export interface ProcessedText extends Document {
  _id: string; // Explicitly declare the _id field
  audioId: string;
  userId: string;
  sttId: string;
  uploadedAt: Date;
  content: string;
}

const ProcessedTextSchema: Schema = new Schema({
  audioId: { type: Schema.Types.ObjectId, ref: "AudioFile", required: true },
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  sttId: { type: Schema.Types.ObjectId, ref: "STT", required: true },
  uploadedAt: { type: Date, default: Date.now },
  content: { type: String, required: true },
});

export const ProcessedTextModel =
  mongoose.models.ProcessedText ||
  mongoose.model<ProcessedText>("ProcessedText", ProcessedTextSchema);
// Export models
