import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const PORT = 8081;
const __filename = fileURLToPath(import.meta.url); //identifies what file is
const __dirname = path.dirname(__filename); //discerning what file's root dir is

const app = express();
app.use(express.json()); //makes serving jsons easier
app.use(express.static(path.join(__dirname, "public"))); //makes serving static
// files like htmls easier

app.post("/submit", (req, res) => {
  console.log(req.body);
  res.json({
    a: 16,
    taco: "delicious",
  });
});

app.post("/start/meta", (req, res) => {
  console.log(req.body);
  res.json({
    width: 255,
    height: 404,
    name: "Alabama",
  });
});

app.post("/start/img", (req, res) => {
  console.log(req.body);
  res.sendFile("AlabamaCounty.png", {
    root: path.join(__dirname, "public"),
  });
});

const server = app.listen(PORT, () => {
  console.log(`server listening at port ${server.address().port}`);
}); //running the server
