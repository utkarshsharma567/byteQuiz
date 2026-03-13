import mongoose from "mongoose"; // mongoose को सही तरीके से import किया

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true // शुरू और अंत की extra spaces automatically remove हो जाएंगी
    },

    email: {
      type: String,
      required: true,
      unique: true, // database में email duplicate नहीं हो सकता
      lowercase: true, // email automatically lowercase में save होगा
      trim: true
    },

    password: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true // createdAt और updatedAt fields automatically add होंगी
  }
);

// model create कर रहे हैं
const User = mongoose.model("User", userSchema);

export default User;