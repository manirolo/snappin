import mongoose from "mongoose";
import { BillingAccountResource, UserMetadataResource, UserResource } from "@snappin/shared/user/user.schema"
import { timestampPlugin } from "../plugin/timestamps.plugin";

const BillingAccountSchema = new mongoose.Schema<BillingAccountResource>({
    customerId: { type: String, default: null },
    portalUrl: { type: String, default: null },
    portalUrlExpiresAt: { type: String, default: null }
}, { _id: false })

const UserMetadataSchema = new mongoose.Schema<UserMetadataResource>({
    isActive: { type: Boolean, default: true },
    isFlagged: { type: Boolean, default: false },
}, { _id: false })

const UserSchema = new mongoose.Schema<UserResource>({
    clerkUserId: { type: String, default: null, index: true },
    email: { type: String, default: null, unique: true, index: true },
    firstName: { type: String, default: null },
    lastName: { type: String, default: null },
    fullName: { type: String, default: null },
    profileUrl: { type: String, default: null },
    billingAccount: { type: BillingAccountSchema, default: null },
    metadata: { type: UserMetadataSchema, default: null },
    createdAt: { type: Number },
    updatedAt: { type: Number },
})

UserSchema.plugin(timestampPlugin)

UserSchema.set("toJSON", { virtuals: true })
UserSchema.set("toObject", { virtuals: true })

export const User: mongoose.Model<UserResource> =
    (mongoose.models.User as mongoose.Model<UserResource>) ??
    mongoose.model<UserResource>("User", UserSchema, "user")