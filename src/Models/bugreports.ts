import mongoose, { Model, Models, Mongoose } from "mongoose";

export type ProductSchema = {
  Title: {
    type: string,
    required: [true, "A title is required!"],
  },
  Description: {
    type: string,
    required: [true, "A description is required!"],
  },
  BugReportDetails: {
    type: {
      DateDiscovered: string,
      PlayerWhoReported: string,
    },
    required: [true, "Bug report details are required!"],
  },
  IsExploit: {
    type: boolean,
    required: [true, "A true or false value is required for \"IsExploit\"!"],
  },
  ExploitDetails: {
    type: {
      RepoSteps: string,
      AddtlInformation: string,
    },
    required: [false],
  },
};

const Schema: mongoose.Schema<ProductSchema> = new mongoose.Schema({
  Title: {
    type: String,
    required: [true, "A title is required!"],
  },
  Description: {
    type: String,
    required: [true, "A description is required!"],
  },
  BugReportDetails: {
    type: {
      Date_Discovered: String,
      Player_Who_Reported: String,
    },
    required: [true, "Bug report details are required!"],
  },
  IsExploit: {
    type: Boolean,
    required: [true, "A true or false value is required for \"IsExploit\"!"],
  },
  ExploitDetails: {
    type: {
      Repo_Steps: String,
      Addtl_Information: String,
      Vulnerability_Scale: Number,
    },
    required: [false],
  }
}, {timestamps: true});

const Product: mongoose.Model<ProductSchema> = mongoose.model("Product", Schema);

export default Product;
