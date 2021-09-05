import mongoose from "mongoose";
import { UserType } from "../types";

const userSchema = new mongoose.Schema({
   id: String,
   points: { type: String, default: "50" },
   scratchedAt: Date,
   gotDailyPointsAt: Date,
});

const User = mongoose.model<UserType>("User", userSchema);

export default User;
