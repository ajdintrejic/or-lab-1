const express = require("express");
const cors = require("cors");
const pool = require("./db/db");
const app = express();
app.use(cors());
const port = 3001;

app.use(express.json()); // Parse JSON bodies (as sent by API clients)
app.use(express.urlencoded());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/test", async (req, res) => {
  try {
    const test = await pool.query("SELECT NOW()");
    res.status(200).json({
      status: "Success",
      message: "Fetched test route",
      response: test.rows,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      status: "Error",
      message: "Fetching test route failed",
      response: null,
    });
  }
});

require("./routes/distroRoutes")(app);

// ############ Error routes ############
app.get("*", function (req, res) {
  res.status(404).json({
    status: "Error",
    message: "Route not found",
    response: null,
  });
});

app.post("*", function (req, res) {
  res.status(404).json({
    status: "Error",
    message: "Route not found",
    response: null,
  });
});

app.delete("*", function (req, res) {
  res.status(404).json({
    status: "Error",
    message: "Route not found",
    response: null,
  });
});

app.put("*", function (req, res) {
  res.status(404).json({
    status: "Error",
    message: "Route not found",
    response: null,
  });
});

// ############ Overrideanje za stvari kao PATCH ############

app.all("*", function (req, res) {
  res.status(501).json({
    status: "Error",
    message: "Method not implemented",
    response: null,
  });
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
