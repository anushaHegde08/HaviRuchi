import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  image?: string;
  phone?: string;
  provider: "credentials" | "google";
  favorites: mongoose.Types.ObjectId[];
  createdAt: Date;
  isVerified: boolean;
  emailVerifyToken: string;
  emailVerifyTokenExpiry: Date;
  resetToken: string;
  resetTokenExpiry: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    image: { type: String },
    phone: { type: String },
    provider: {
      type: String,
      enum: ["credentials", "google"],
      default: "credentials",
    },
    favorites: [
      {
        type: Schema.Types.ObjectId,
        ref: "Recipe",
      },
    ],
    isVerified: { type: Boolean, default: false },
    emailVerifyToken: { type: String },
    emailVerifyTokenExpiry: { type: Date },
    resetToken: { type: String },
    resetTokenExpiry: { type: Date },
  },
  { timestamps: true },
);

export default mongoose.models.User ||
  mongoose.model<IUser>("User", UserSchema);
