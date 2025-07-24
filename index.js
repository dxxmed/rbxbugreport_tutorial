import http from "http";
import dotenv from "dotenv";
import mongoose from "mongoose";
import Product from "./Models/bugreports.js";

dotenv.config()

const PORT = process.env.PORT;
const URI = process.env.URI;
const HOST = "0.0.0.0";

console.log("THIS IS THE URI!")
console.log(URI);

const Server = http.createServer(async (req, res) => {
  if (req.method === "GET") {
    if (req.url === "/") {
      res.writeHead(200, {"Content-Type": "text/plain"});
      res.end("This is the home page!");
    } else if (req.url === "/bugreports") {
        try {
          const AllProducts = await Product.find({});
          res.writeHead(200, {"Content-Type": "application/json"});
          res.end(JSON.stringify(AllProducts));
        } catch(err) {
          console.log(err);
          res.writeHead(500, {"Content-Type": "application/json"});
          res.end(JSON.stringify({
            message: "Database Error!",
          }));
        }
    }
  } else if (req.method === "POST") {
      if (req.url === "/bugreports") {
        try {
          const NewProduct = await Product.create(req.body);
          res.writeHead(200, {"Content-Type": "application/json"});
          res.end(JSON.stringify(NewProduct));
        } catch(err) {
            console.log(err);
            res.writeHead(500, {"Content-Type": "application/json"});
            res.end(JSON.stringify({
                message: "Database Error!",
            }));
        }
      }
  } else if (req.method === "DELETE") {
      if (req.url === "/bugreports") {
        try {
          const { IdToDelete } = req.params;
          const ProductToDelete = await Product.findByIdAndDelete(IdToDelete);
          res.writeHead(200, {"Content-Type": "application/json"});
          res.end(JSON.stringify(ProductToDelete));
        } catch(err) {
        res.writeHead(404, {"Content-Type": "application/json"});
        res.end(JSON.stringify({
          message: "Product to delete was NOT FOUND!",
        }));
      }
    }
  }
});

mongoose.set("strictQuery", false);

mongoose.connect(URI).then(() => {
  Server.listen(PORT, HOST, () => {
    console.log(`Listening on PORT ${PORT}!`);
  })
}).catch(err => {
  console.log(err);
});