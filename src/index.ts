import http from "http";
import dotenv from "dotenv";
import mongoose, { mongo } from "mongoose";
import Product, { ProductSchema } from "./Models/bugreports.js";

dotenv.config()

const PORT = process.env.PORT || 5000;
const URI = process.env.URI as string;

function getBody(req: http.IncomingMessage): any | void {
  return new Promise((resolve, reject) => {
    let Body = "";
    req.on("data", (chunk: any) => {
      Body += chunk;
    });
    req.on("end", () => {
      try {
        resolve(JSON.parse(Body));
      } catch(err: any) {
        reject(err);
      }
    });
    req.on("error", reject);
  });
};

const Server = http.createServer(async (req: http.IncomingMessage, res: http.ServerResponse<http.IncomingMessage>) => {
  if (req.method === "GET") {
    if (req.url === "/") {
      res.writeHead(200, {"Content-Type": "text/plain"});
      res.end("This is the home page!");
    } else if (req.url === "/bugreports") {
        try {
          const AllProducts: ProductSchema[] = await Product.find({});
          res.writeHead(200, {"Content-Type": "application/json"});
          res.end(JSON.stringify(AllProducts));
        } catch(err) {
          console.log(err);
          res.writeHead(500, {"Content-Type": "application/json"});
          res.end(JSON.stringify({
            message: `Database Error! Couldn't fetch products. ${err}`,
          }));
        }
    }
    return;
  } else if (req.method === "POST") {
      if (req.url === "/bugreports") {
        try {
          const Body: any | void = await getBody(req);
          const NewProduct: ProductSchema = await Product.create(Body);
          res.writeHead(200, {"Content-Type": "application/json"});
          res.end(JSON.stringify(NewProduct));
        } catch(err) {
            console.log(err);
            res.writeHead(500, {"Content-Type": "application/json"});
            res.end(JSON.stringify({
                message: `Database error! ${err}`,
            }));
        }
      }
      return;
  } else if (req.method === "DELETE") {
      if (req.url.match(/\/bugreports\/(\w+)/)) {
        try {
          const IdToDelete = req.url.split("/")[2];

          console.log(`ID that's gonna be deleted: ${IdToDelete}!`);

          const ProductToDelete: ProductSchema | null = await Product.findByIdAndDelete(IdToDelete);

          if (!ProductToDelete) {
            res.writeHead(404, {"Content-Type": "application/json"});
            res.end(JSON.stringify({
              message: "Product to delete doesn't exist!",
            }));
            return;
          }

          res.writeHead(200, {"Content-Type": "application/json"});
          res.end(JSON.stringify(ProductToDelete));
        } catch(err) {
        res.writeHead(500, {"Content-Type": "application/json"});
        res.end(JSON.stringify({
          message: `Database error! ${err}`,
        }));
      }
    }
    return;
  } else if (req.method === "PUT") {
    if (req.url.match(/\/bugreports\/(\w+)/)) {
      try {
        const Body: any | void = await getBody(req);
        const IdToPut = req.url.split("/")[2];

        console.log(`Id that's gonna get it's data changed: ${IdToPut}!`);

        const ProductToPut: mongoose.Query<mongoose.Document<ProductSchema>, mongoose.Document<ProductSchema>> | null = Product.findByIdAndUpdate(IdToPut, Body);

        if (!ProductToPut) {
          res.writeHead(404, {"Content-Type": "application/json"});
          res.end(JSON.stringify({
            message: "Product to put doesn't exist!",
          }));
          return;
        }

        res.writeHead(200, {"Content-Type": "application/json"});
        res.end(JSON.stringify(ProductToPut));
      } catch(err) {
        res.writeHead(500, {"Content-Type": "application/json"});
        res.end(JSON.stringify({
          message: `Database error! ${err}`,
        }));
      }
    }
    return;
  }
  res.writeHead(404, {"Content-Type": "application/json"});
  res.end(JSON.stringify({
    message: "Route not found!",
  }));
});

mongoose.set("strictQuery", false);

mongoose.connect(URI).then(() => {
  Server.listen(PORT, (): void => {
    console.log(`Listening on PORT ${PORT}!`);
  });
}).catch((err) => {
  // console.log(err);
  Server.listen(PORT, () => {
    console.log(`[NO MONGODB ACCESS] Listening on PORT ${PORT}!`);
  });
});