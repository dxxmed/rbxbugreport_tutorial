import http from "http";
import dotenv from "dotenv";
import mongoose, { mongo } from "mongoose";
import Product, { ProductSchema } from "./Models/bugreports.ts";

dotenv.config()

const PORT: string | number = process.env.PORT || 5000;
const URI: string = process.env.URI as string;

function getBody(req: http.IncomingMessage): any | void {
  return new Promise((resolve: (value: any) => void, reject: (reason: any) => void): Promise<any> | void => {
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

const Server: http.Server = http.createServer(async (req: http.IncomingMessage, res: http.ServerResponse<http.IncomingMessage>): Promise<void> => {
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
            message: "Database Error! Couldn't fetch all products",
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
        } catch(err: any) {
            console.log(err);
            res.writeHead(500, {"Content-Type": "application/json"});
            res.end(JSON.stringify({
                message: "Database Error! The format is {\"Title\": string, \"Description\": string, etc}!",
            }));
        }
      }
      return;
  } else if (req.method === "DELETE") {
      if (req.url === "/bugreports") {
        try {
          const ParsedURL: URL = new URL(req.url, `https://${req.headers.host}`);
          const IdToDelete: string | null = ParsedURL.searchParams.get("id");
          const ProductToDelete: ProductSchema | null = await Product.findByIdAndDelete(IdToDelete);
          res.writeHead(200, {"Content-Type": "application/json"});
          res.end(JSON.stringify(ProductToDelete));
        } catch(err: any) {
        res.writeHead(404, {"Content-Type": "application/json"});
        res.end(JSON.stringify({
          message: "Product to delete was NOT FOUND or there was a database error!",
        }));
      }
    }
    return;
  }
  res.writeHead(404, {"Content-Type": "application/json"});
  res.end(JSON.stringify({
    message: "Server error",
  }));
});

mongoose.set("strictQuery", false);

mongoose.connect(URI).then(() => {
  Server.listen(PORT, (): void => {
    console.log(`Listening on PORT ${PORT}!`);
  });
}).catch((err: any): void => {
  console.log(err);
  Server.listen(PORT, () => {
    console.log(`[NO MONGODB ACCESS] Listening on PORT ${PORT}!`);
  });
});