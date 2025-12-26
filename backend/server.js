const dotenv = require("dotenv");
dotenv.config();
const app = require("./app");
const { poolPromise } = require("./config/db");

const port = process.env.PORT || 5000;

(async () => {
  await poolPromise; // ensures DB is ready before server starts
  app.listen(port, () => {
    console.log(`--- Server running on port ${port}`);
  });
})();
