import express from "express";

const app = express();
const PORT = 3000;

app.use(express.json());

app.get("/", (_req, res) => {
  res.json({
    message: "Crypto service is running"
  });
});

app.listen(PORT, () => {
  console.log(`Crypto service listening on http://localhost:${PORT}`);
});