import mongoose, { Schema, Document } from "mongoose";

export interface IRecipe extends Document {
  title: string;
  description: string;
  image?: string;
  category: string;
  difficulty: "Easy" | "Medium" | "Hard";
  timeNeeded: number;
  servings: number;
  ingredients: string[];
  instructions: string[];
  isFavorite: boolean;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
}

const RecipeSchema = new Schema<IRecipe>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String },
    category: { type: String, required: true },
    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      required: true,
    },
    timeNeeded: { type: Number, required: true },
    servings: { type: Number, required: true },
    ingredients: [{ type: String, required: true }],
    instructions: [{ type: String, required: true }],
    isFavorite: { type: Boolean, default: false },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);

export default mongoose.models.Recipe ||
  mongoose.model<IRecipe>("Recipe", RecipeSchema);
