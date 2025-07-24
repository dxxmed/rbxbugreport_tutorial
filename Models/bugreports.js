import mongoose from "mongoose";

const Schema = mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "A title is REQUIRED!"],
    },
    description: {
      type: String,
      required: [true, "A description is REQUIRED!"],
    },
  },
  {
    timestamps: true
  },
);

mongoose.model("Product", Schema);

export default Product;