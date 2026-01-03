import mongoose from "mongoose";

const shoppingListItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
    default: 1,
  },
  unit: {
    type: String,
    trim: true,
    default: "pcs",
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  category: {
    type: String,
    enum: [
      "groceries",
      "electronics",
      "clothing",
      "household",
      "health",
      "other",
    ],
    default: "other",
  },
  checked: {
    type: Boolean,
    default: false,
  },
});

const shoppingListSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    items: [shoppingListItemSchema],
    totalPrice: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["active", "completed", "archived"],
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);

shoppingListSchema.pre("save", function (next) {
  this.totalPrice = this.items.reduce((total, item) => total + item.price, 0);
  next();
});

shoppingListSchema.index({ userId: 1, createdAt: -1 });

const ShoppingList = mongoose.model("ShoppingList", shoppingListSchema);

export default ShoppingList;
