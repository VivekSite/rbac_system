import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
	{
		username: { type: String, required: true, minLength: 3 },
		email: {
			type: String,
			required: true,
			unique: true
		},
		mobile: {
			type: String,
			length: 10
		},
		password: {
			type: String,
			required: true
		},
		role: {
			type: String,
			enum: ["Admin", "User", "Employee", "Assistent"],
			required: true
		},
		profileImage: { type: String, default: "" },
		isEmailVerified: { type: Boolean, default: false },
		isMobileVerified: { type: Boolean, default: false },
		isDeleted: { type: Boolean, default: false },
		updated_at: {
			type: Number,
			default: () => +new Date()
		},
		created_at: {
			type: Number,
			default: () => +new Date()
		}
	},
	{
		timestamps: true
	}
);

userSchema.index({
	email: 1
});

userSchema.index({
	mobile: 1
});

userSchema.index({
	username: 1
});

export const userModel = mongoose.model("users", userSchema);
