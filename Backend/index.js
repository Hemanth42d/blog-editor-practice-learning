const express = require("express");
const mongoose = require("mongoose");
const blogModel = require("./blogModel");
const app = express();
const cors = require("cors");

mongoose
  .connect(
    "mongodb://admin:password@localhost:27017/blog_editor?authSource=admin"
  )
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.error("MongoDB connection error:", error));

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "http://localhost:5175",
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Backend is working...");
});

app.post("/blog", async (req, res) => {
  try {
    const { title, author, content } = req.body;

    if (!title || !author || !content) {
      return res.status(400).json({
        message:
          "Missing required fields: title, author, and content are required",
      });
    }

    const blog = await blogModel.create({
      title,
      author,
      content,
    });

    res.status(201).json({
      success: true,
      message: "Blog created successfully",
      data: blog,
    });
  } catch (error) {
    console.error("Error creating blog:", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong while creating the blog",
    });
  }
});

app.get("/getblog/:id", async (req, res) => {
  try {
    const id = "689f2d96fd449a58208dae45";

    const blog = await blogModel.findById(id);
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    res.status(200).json({
      success: true,
      data: blog,
    });
  } catch (error) {
    console.error("Error fetching blog:", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong while fetching the blog",
    });
  }
});

app.listen(3000, () => {
  console.log("Backend server listening on port 3000");
});
