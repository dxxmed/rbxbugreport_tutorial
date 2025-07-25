import http from "http";
import dotenv from "dotenv";
import mongoose from "mongoose";
import Product from "./Models/bugreports.js";

dotenv.config()

const PORT = process.env.PORT || 5000;
const URI = process.env.URI;

console.log("THIS IS THE URI!")
console.log(URI);

function getBody(req) {
  return new Promise((resolve, reject) => {
    let Body = "";
    req.on("data", (chunk) => {
      Body += chunk;
    });
    req.on("end", () => {
      try {
        resolve(JSON.parse(Body));
      } catch(err) {
        reject(err);
      }
    });
    req.on("error", reject);
  });
};

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
    return;
  } else if (req.method === "POST") {
      if (req.url === "/bugreports") {
        try {
          const Body = await getBody(req);
          const NewProduct = await Product.create(Body);
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
      return;
  } else if (req.method === "DELETE") {
      if (req.url === "/bugreports") {
        try {
          const ParsedURL = new URL(req.url, `https://${req.headers.host}`);
          const IdToDelete = ParsedURL.searchParams.get("id");
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
    return;
  }
  res.writeHead(404, {"Content-Type": "application/json"});
  res.end(JSON.stringify({
    message: "Server error. That's all we know.",
  }));
});

mongoose.set("strictQuery", false);

mongoose.connect(URI).then(() => {
  Server.listen(PORT, () => {
    console.log(`Listening on PORT ${PORT}!`);
  })
}).catch(err => {
  console.log(err);
});