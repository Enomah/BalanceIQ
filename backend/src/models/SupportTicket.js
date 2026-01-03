import mongoose from "mongoose";

const SupportTicketSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  subject: {
    type: String,
    required: true,
    trim: true,
  },
  category: {
    type: String,
    enum: ["general", "technical", "billing", "feature"],
    default: "general",
  },
  message: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["open", "in_progress", "resolved", "closed", "paused"],
    default: "open",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const SupportTicket = mongoose.model("SupportTicket", SupportTicketSchema);
export default SupportTicket;
