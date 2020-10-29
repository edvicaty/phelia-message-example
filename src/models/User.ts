import mongoose from "mongoose";
const Schema = mongoose.Schema;

export interface IUser extends mongoose.Document {
  username: string;
  slackID: string;
  clickUpToken: string;
  clickUpID: string;
  isAdmin: boolean;
}

const userSchema = new Schema(
  {
    username: String,
    slackID: String,
    clickUpToken: String,
    clickUpID: String,
    isAdmin: Boolean,
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);

const User = mongoose.model<IUser>("User", userSchema);

export default User;
