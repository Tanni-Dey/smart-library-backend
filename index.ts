import { MongoClient, ObjectId, ServerApiVersion } from "mongodb";
require("dotenv").config();
import express, { Application, Request, Response } from "express";
import cors from "cors";

const app: Application = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.1tyqf.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
} as object);

const run = async () => {
  try {
    const db = client.db("smart-library");
    const bookCollection = db.collection("books");

    app.get("/books", async (req: Request, res: Response) => {
      const findBooks = bookCollection.find({});
      const allBooks = await findBooks.toArray();
      res.send({ sucess: true, data: allBooks });
    });
    app.get("/book-details/:id", async (req: Request, res: Response) => {
      const id = req.params.id;
      const findBook = await bookCollection.findOne({ _id: new ObjectId(id) });
      res.send({ sucess: true, data: findBook });
    });
    app.post("/add-book", async (req: Request, res: Response) => {
      const newBook = req.body;
      const addBook = await bookCollection.insertOne(newBook);
      res.send({ sucess: true, data: addBook });
    });
  } finally {
  }
};

run().catch((err) => console.log(err));

app.get("/", (req: Request, res: Response) => {
  res.send("smart-library");
});

app.listen(port, () => {
  console.log(`smart-library app listening on port ${port}`);
});
