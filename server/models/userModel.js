import bcrypt from "bcryptjs"
import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true },
    password: { type: String, required: true }
}, { timestamp: true });

userSchema.pre("save", async function(next) {
    if (!this.isModified("password")) return next();
    //hash password
    this.password = await bcrypt.hash(this.password, 10);
    next()
});

// userSchema.methods.comparePassword = async function (password) {
//     return bcrypt.compare(password, this.password);
// };

export default mongoose.model('User', userSchema);