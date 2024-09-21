import mongoose, { Schema, Document } from "mongoose";

export interface User extends Document {
  _id: string; // Explicitly declare the _id field
  name: string;
  email?: string;
  password?: string;
  audioFiles?: mongoose.Types.ObjectId[] | AudioFile[];
  stts?: mongoose.Types.ObjectId[] | STT[];
}

export interface AudioFile extends Document {
  _id: string; // Explicitly declare the _id field
  fileName: string;
  uploadedAt: Date;
  stt?: mongoose.Types.ObjectId | STT;
}

export interface STT extends Document {
  _id: string; // Explicitly declare the _id field
  audio: mongoose.Types.ObjectId | AudioFile;
  content: string;
}

export const UserSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  audioFiles: [{ type: Schema.Types.ObjectId, ref: "AudioFile" }],
  stts: [{ type: Schema.Types.ObjectId, ref: "STT" }],
});

const AudioFileSchema: Schema = new Schema({
  fileName: { type: String, required: true },
  uploadedAt: { type: Date, default: Date.now },
  stt: { type: Schema.Types.ObjectId, ref: "STT", default: null },
});

const STTSchema: Schema = new Schema({
  audio: { type: Schema.Types.ObjectId, ref: "AudioFile", required: true },
  content: { type: String, required: true },
});

// Export models
const AudioFileModel =
  mongoose.models.AudioFile || mongoose.model<AudioFile>("AudioFile", AudioFileSchema);
const STTModel = mongoose.models.STT || mongoose.model<STT>("STT", STTSchema);
const UserModel = mongoose.models.User || mongoose.model<User>("User", UserSchema);

export { AudioFileModel, STTModel, UserModel };
