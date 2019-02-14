const express = require("express"); // importing a CommonJS module

const PostsRouter = require("./routes/posts-router");

const UserRouter = require("./routes/user-router");

const server = express();

server.use(express.json());

server.use("/api/posts", PostsRouter);
server.use("/api/users", UserRouter);

server.get("/", async (req, res) => {
  res.send(`
    <h2>Blog Posts API</h>
    <p>Welcome to blog posts API</p>
  `);
});

server.listen(4000, () => {
  console.log("\n* Server Running on http://localhost:4000 *\n");
});
