const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const  url= "mongodb+srv://ziyobekxasanov06:4aHqPVTxJ0j41DmA@cluster0.xhzreig.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(url)
  .then(() => console.log("MongoDB ga ulandi"))
  .catch((err) => {
    console.error("MongoDB ulanishda xatolik:", err);
    process.exit(1);
  });

const productSchema = new mongoose.Schema({
  title: String,
  price: Number,
  image: String,
});

const Product = mongoose.model("Product", productSchema);

app.get("/products", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (e) {
    res.status(500).json({ error: "Serverda xatolik yuz berdi" });
  }
});

app.post("/products", async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (e) {
    res.status(500).json({ error: "Mahsulot qo'shishda xatolik" });
  }
});

app.get("/products/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: "Mahsulot topilmadi" });
    res.json(product);
  } catch (e) {
    res.status(500).json({ error: "Serverda xatolik yuz berdi" });
  }
});

app.patch("/products/:id", async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedProduct) return res.status(404).json({ error: "Mahsulot topilmadi" });
    res.json(updatedProduct);
  } catch (e) {
    res.status(500).json({ error: "Yangilashda xatolik yuz berdi" });
  }
});

app.delete("/products/:id", async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Mahsulot topilmadi" });
    res.json({ message: "Mahsulot o'chirildi" });
  } catch (e) {
    res.status(500).json({ error: "O'chirishda xatolik yuz berdi" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server ${PORT} portda ishlamoqda`);
});
