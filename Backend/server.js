require("dotenv").config();

const app = require("./src/app");
const connectDb = require("./src/db/db");

const PORT = process.env.PORT || 3000;

async function startServer() {
  await connectDb();

  app.listen(PORT, () => {
    console.log(
      `Server running at http://localhost:${PORT}`
    );
  });
}

startServer();