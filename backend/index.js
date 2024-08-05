const http = require("http");
const path = require("path");
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const pool = require("./config/database.js");
const globalError = require("./middlewares/errorMiddleware.js");
const config = require('./utils/config.js');
const auth = require("./routes/auth.js");
const seller = require("./routes/seller.js");
const product = require('./routes/product.js');
const store = require('./routes/store.js');
const ApiError = require("./utils/ApiError.js");

const PORT = config.PORT;
const app = express();

app.use(
    cors({
        origin: "http://localhost:4000", // Update with your client's origin
        credentials: true,
    })
);

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
    console.log(`mode: ${config.NODE_ENV}`);
}

app.use('/api/auth',auth);
app.use('/api/seller',seller);
app.use('/api/product',product);
app.use('/api/store',store);

// For Unmounted Url
app.all("*", (req, res, next) => {
    next(new ApiError(`Can't find this route: ${req.originalUrl}`, 400));
});

  // Global error handling middleware for express
app.use(globalError);

const server = http.createServer(app);
server.listen(PORT, async () => {
    try {
        await pool.execute("SELECT 1");
        console.log(`Connected To Database `);
        console.log(`Server is Listening on PORT ${PORT}`);
    } catch (error) {
        console.log(error);
    }
});

  // Event => list =>callback(err)
  // Handle rejection outside express
  process.on("unhandledRejection", (err) => {
    console.error(`UnhandledRejection Errors: ${err.name} | ${err.message}`);
    // just in case of the current request
    server.close(() => {
      console.error(`Shutting down....`);
      process.exit(1);
    });
  });