import mongoose, { Schema, Document } from "mongoose";

interface User extends Document {
  name: string;
  email?: string;
  password?: string;
  audioFiles?: mongoose.Types.ObjectId[];
  stts?: mongoose.Types.ObjectId[];
}

interface AudioFile extends Document {
  url: string;
  uploadedAt: Date;
  stt?: mongoose.Types.ObjectId;
}

interface STT extends Document {
  audio: mongoose.Types.ObjectId;
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
