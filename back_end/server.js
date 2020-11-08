const express = require("express");
const cors = require("cors");
const app = express();
app.use(cors());
const port = 3001;

const { Pool } = require("pg");
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "orlab1",
  password: "ajdinajdin",
  port: 5432,
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/api/v1/dist", (req, res) => {
  console.log(req.query);
  pgQuery = "SELECT * FROM distribucije_linuxa";
  if (req.query.searchQuery != "" && req.query.searchType == "wildcard") {
    searchQuery = req.query.searchQuery;
    pgQuery =
      pgQuery +
      ` WHERE 
    distributionname LIKE '%${searchQuery}%' OR 
    basename LIKE '%${searchQuery}%'  OR 
    homepage LIKE '%${searchQuery}%' OR 
    packagemanager LIKE '%${searchQuery}%' OR
    releasetype LIKE '%${searchQuery}%' OR
    supportedarch LIKE '%${searchQuery}%' OR
    targetuse LIKE '%${searchQuery}%' OR
    wikipage LIKE '%${searchQuery}%' OR
    yearofcreation LIKE '%${searchQuery}%' OR
    distrowatchrank::text LIKE '%${searchQuery}%'
    `;
  } else if (
    req.query.searchQuery != "" &&
    req.query.searchType == "distribution"
  ) {
    searchQuery = req.query.searchQuery;
    pgQuery =
      pgQuery +
      ` WHERE 
    distributionname LIKE '%${searchQuery}%' 
    `;
  } else if (req.query.searchQuery != "" && req.query.searchType == "base") {
    searchQuery = req.query.searchQuery;
    pgQuery =
      pgQuery +
      ` WHERE 
    basename LIKE '%${searchQuery}%' 
    `;
  }
  pgQuery = pgQuery + ";";
  //console.log(pgQuery);
  pool.query(pgQuery, (error, results) => {
    if (error) {
      throw error;
    }
    //console.log(results.rows);
    res.status(200).json(results.rows);
  });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
