import mongoose from "mongoose";
import bcrypt from "bcrypt";
import pkg from "validator";
const { isEmail } = pkg;
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      unique: true,
      //validator:
      minLength: [6, " Must have at least 6 characters"],
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: [isEmail, "Please enter a valid email"],
    },
  },

  {
    timestamps: true,
  }
);
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

//Checks if the entered password matches a password in databse
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);
export default User;
