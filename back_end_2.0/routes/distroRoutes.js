const pool = require("../db/db");
var fs = require("fs");
const { default: axios } = require("axios");
request = require("request");
request = require("axios");

const download_image = (url, image_path) =>
  axios({
    url,
    responseType: "stream",
  }).then(
    (response) =>
      new Promise((resolve, reject) => {
        response.data
          .pipe(fs.createWriteStream(image_path))
          .on("finish", () => resolve())
          .on("error", (e) => reject(e));
        console.log("FILE SAVED");
      })
  );

const getPicture = async (wikipage) => {
  try {
    var text = "SELECT * from img_cache WHERE wikipage = $1";
    var values = [wikipage];
    const cache_result = await pool.query(text, values);
    cachetime = Date.now();

    if (cache_result.rows[0]) {
      //ako ima  u cache-u
      console.log("ima cache");

      if (Date.now() - cache_result.rows[0].cachetime > 10000) {
        console.log("novi cache");
        try {
          text = "UPDATE img_cache SET cachetime = $2 WHERE wikipage = $1;";
          values = [wikipage, cachetime];
          var newCache = await pool.query(text, values);
          console.log("insert cache ok!");
          await axios
            .get(
              "https://en.wikipedia.org/api/rest_v1/page/summary/" + wikipage
            )
            .then(async (res) => {
              url = res.data.originalimage.source;
              await axios({
                url,
                responseType: "stream",
              }).then(
                (response) =>
                  new Promise((resolve, reject) => {
                    response.data
                      .pipe(
                        fs.createWriteStream("./cache/" + wikipage + ".png")
                      )
                      .on("finish", () => resolve())
                      .on("error", (e) => reject(e));
                    console.log("FILE SAVED");
                  })
              );
              return wikipage + ".png";
            });
        } catch (e) {
          console.log("insert cache not ok!");
          console.log(e);
        }
      } else {
        return wikipage + ".png";
      }
    } else {
      // ako nema u cache-u
      console.log("nema cache");

      try {
        text = "INSERT INTO img_cache (wikipage, cachetime) VALUES($1, $2);";
        values = [wikipage, cachetime];
        var newCache = await pool.query(text, values);
        console.log("insert cache ok!");
        await axios
          .get("https://en.wikipedia.org/api/rest_v1/page/summary/" + wikipage)
          .then(async (res) => {
            url = res.data.originalimage.source;
            await axios({
              url,
              responseType: "stream",
            }).then(
              (response) =>
                new Promise((resolve, reject) => {
                  response.data
                    .pipe(fs.createWriteStream("./cache/" + wikipage + ".png"))
                    .on("finish", () => resolve())
                    .on("error", (e) => reject(e));
                  console.log("FILE SAVED");
                })
            );
            return wikipage + ".png";
          });
      } catch (e) {
        console.log("insert cache not ok!");
        console.log(e);
      }
    }
  } catch (e) {
    console.log(e);
  }
  return wikipage + ".png";
};

module.exports = function (app) {
  app.get("/api/v1/distribution", async (req, res) => {
    try {
      const distros = await pool.query("SELECT * from distribucije_linuxa");
      res.status(200).json({
        status: "Success",
        message: "Fetched distributions",
        response: distros.rows,
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).json({
        status: "Error",
        message: "Fetching distros failed",
        response: null,
      });
    }
  });

  app.get("/api/v1/distribution/:id", async (req, res) => {
    try {
      var text = "SELECT * from distribucije_linuxa WHERE id = $1";
      var values = [req.params.id];
      const distros = await pool.query(text, values);

      wikipage = distros.rows[0].wikipage;
      console.log(wikipage);

      distros.rows[0].links = {
        picture: "/api/v1/distribution/" + req.params.id + "/picture",
        supportedde: "/api/v1/distribution/" + req.params.id + "/supportedde",
        originaldevelopers:
          "/api/v1/distribution/" + req.params.id + "/originaldevelopers",
        basename: "/api/v1/distribution/" + req.params.id + "/basename",
      };

      distros.rows[0]["@context"] = {};
      distros.rows[0]["@context"]["@vocab"] = "https://schema.org/";
      distros.rows[0]["@context"]["yearofcreation"] = "yearBuilt";
      distros.rows[0]["@context"]["homepage"] = "WebPage";

      res.status(200).json({
        status: "Success",
        message: "Fetched distribution",
        response: distros.rows[0],
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).json({
        status: "Error",
        message: "Fetching distro failed",
        response: null,
      });
    }
  });

  app.get("/api/v1/distribution/:id/supportedde", async (req, res) => {
    try {
      var text = "SELECT * FROM distribucije_linuxa  WHERE id =  $1";
      var values = [req.params.id];
      var dist = await pool.query(text, values);

      if (!dist.rows[0]) {
        res.status(400).json({
          status: "Error",
          message:
            "Bad request, entry with id: " + req.params.id + " doesn't exist.",
          response: null,
        });
      }
      var text = "SELECT * from distribucije_linuxa WHERE id = $1";
      var values = [req.params.id];
      const distros = await pool.query(text, values);
      links = {
        supportedde: "/api/v1/distribution/" + req.params.id + "/supportedde",
        originaldevelopers:
          "/api/v1/distribution/" + req.params.id + "/originaldevelopers",
        basename: "/api/v1/distribution/" + req.params.id + "/basename",
      };
      res.status(200).json({
        status: "Success",
        message: "Fetched distribution supported desktop environments ",
        response: { supportedde: distros.rows[0].supportedde, links: links },
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).json({
        status: "Error",
        message: "Fetching distribution supported desktop environments failed",
        response: null,
      });
    }
  });

  app.get("/api/v1/distribution/:id/picture", async (req, res) => {
    try {
      var text = "SELECT * FROM distribucije_linuxa  WHERE id =  $1";
      var values = [req.params.id];
      var dist = await pool.query(text, values);

      if (!dist.rows[0]) {
        res.status(400).json({
          status: "Error",
          message:
            "Bad request, entry with id: " + req.params.id + " doesn't exist.",
          response: null,
        });
      }

      var text = "SELECT * from distribucije_linuxa WHERE id = $1";
      var values = [req.params.id];
      const distros = await pool.query(text, values);

      wikipage = distros.rows[0].wikipage;
      console.log(wikipage);
      imgPath = getPicture(wikipage).then((img_p) => {
        res
          .status(200)
          .sendFile(
            "/home/ajdin/Documents/or-labs/back_end_2.0/cache/" + img_p
          );
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({
        status: "Error",
        message: "Fetching distribution supported desktop environments failed",
        response: null,
      });
    }
  });

  app.get("/api/v1/distribution/:id/basename", async (req, res) => {
    try {
      var text = "SELECT * FROM distribucije_linuxa  WHERE id =  $1";
      var values = [req.params.id];
      var dist = await pool.query(text, values);

      if (!dist.rows[0]) {
        res.status(400).json({
          status: "Error",
          message:
            "Bad request, entry with id: " + req.params.id + " doesn't exist.",
          response: null,
        });
      }
      var text = "SELECT * from distribucije_linuxa WHERE id = $1";
      var values = [req.params.id];
      const distros = await pool.query(text, values);
      links = {
        supportedde: "/api/v1/distribution/" + req.params.id + "/supportedde",
        originaldevelopers:
          "/api/v1/distribution/" + req.params.id + "/originaldevelopers",
        basename: "/api/v1/distribution/" + req.params.id + "/basename",
      };
      res.status(200).json({
        status: "Success",
        message: "Fetched distribution base name",
        response: { basename: distros.rows[0].basename, links: links },
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).json({
        status: "Error",
        message: "Fetching distro base name failed",
        response: null,
      });
    }
  });

  app.get("/api/v1/distribution/:id/originaldevelopers", async (req, res) => {
    try {
      //Check if it exists
      var text = "SELECT * FROM distribucije_linuxa  WHERE id =  $1";
      var values = [req.params.id];
      var dist = await pool.query(text, values);

      if (!dist.rows[0]) {
        res.status(400).json({
          status: "Error",
          message:
            "Bad request, entry with id: " + req.params.id + " doesn't exist.",
          response: null,
        });
      }
      var text =
        "SELECT * from distribucije_linuxa NATURAL JOIN originaldevelopers WHERE distribucije_linuxa.id = $1";
      var values = [req.params.id];
      const distros = await pool.query(text, values);
      res.status(200).json({
        status: "Success",
        message: "Fetched distribution original developers",
        response: {
          originaldevelopers: distros.rows[0].originaldevelopers,
          links: links,
        },
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).json({
        status: "Error",
        message: "Fetching distro base name failed",
        response: null,
      });
    }
  });

  app.post("/api/v1/distribution", async (req, res) => {
    try {
      //Check if it exists
      var text =
        "SELECT * FROM distribucije_linuxa  WHERE distributionname =  $1";
      var values = [req.body.distributionname];
      var dist = await pool.query(text, values);

      if (dist.rows[0]) {
        res.status(400).json({
          status: "Error",
          message:
            "Bad request, entry with primary key: " +
            req.body.distributionname +
            " exists. ",
          response: null,
        });
      }

      //add new dist
      text =
        "INSERT INTO distribucije_linuxa (distributionname, basename, releasetype, packagemanager, supportedarch, yearofcreation, homepage, distrowatchrank, targetuse, supportedde, wikipage) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11);";
      values = [
        req.body.distributionname,
        req.body.basename,
        req.body.releasetype,
        req.body.packagemanager,
        req.body.supportedarch,
        req.body.yearofcreation,
        req.body.homepage,
        req.body.distrowatchrank,
        req.body.targetuse,
        req.body.supportedde,
        req.body.wikipage,
      ];
      var newDist = await pool.query(text, values);

      //return new dist
      text = "SELECT * FROM distribucije_linuxa  WHERE distributionname =  $1";
      values = [req.body.distributionname];
      var dist = await pool.query(text, values);
      res.status(200).json({
        status: "Success",
        message: "Added a new distribution",
        response: dist.rows[0],
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).json({
        status: "Error",
        message: "Insert failed",
        response: null,
      });
    }
  });

  app.delete("/api/v1/distribution/:id", async (req, res) => {
    try {
      //check if a dist exists with that id
      var text = "SELECT * FROM distribucije_linuxa  WHERE id =  $1";
      var values = [req.params.id];
      var dist = await pool.query(text, values);

      if (!dist.rows[0]) {
        res.status(400).json({
          status: "Error",
          message:
            "Bad request, entry with primary key: " +
            req.body.distributionname +
            " doesn't exists. ",
          response: null,
        });
      }

      //delete it
      text = "DELETE FROM distribucije_linuxa WHERE id = $1";
      values = [req.params.id];
      var deleted = await pool.query(text, values);
      res.status(200).json({
        status: "Success",
        message: "Deleted distribution",
        response: null,
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).json({
        status: "Error",
        message: "Fetching distros failed",
        response: null,
      });
    }
  });

  app.put("/api/v1/distribution/:id", async (req, res) => {
    try {
      //Check if it exists
      var text = "SELECT * FROM distribucije_linuxa  WHERE id =  $1";
      var values = [req.params.id];
      var dist = await pool.query(text, values);

      if (!dist.rows[0]) {
        res.status(400).json({
          status: "Error",
          message:
            "Bad request, entry with primary key: " +
            req.params.id +
            " doesn't exist",
          response: null,
        });
      }

      //edit values

      if (req.body.distributionname) {
        text =
          "UPDATE distribucije_linuxa SET distributionname = $1 WHERE id = $2";
        values = [req.body.distributionname, req.params.id];
        var dist = await pool.query(text, values);
      }
      if (req.body.basename) {
        text = "UPDATE distribucije_linuxa SET basename = $1 WHERE id = $2";
        values = [req.body.basename, req.params.id];
        var dist = await pool.query(text, values);
      }
      if (req.body.releasetype) {
        text = "UPDATE distribucije_linuxa SET releasetype = $1 WHERE id = $2";
        values = [req.body.releasetype, req.params.id];
        var dist = await pool.query(text, values);
      }
      if (req.body.packagemanager) {
        text =
          "UPDATE distribucije_linuxa SET packagemanager = $1 WHERE id = $2";
        values = [req.body.packagemanager, req.params.id];
        var dist = await pool.query(text, values);
      }
      if (req.body.supportedarch) {
        text =
          "UPDATE distribucije_linuxa SET supportedarch = $1 WHERE id = $2";
        values = [req.body.supportedarch, req.params.id];
        var dist = await pool.query(text, values);
      }
      if (req.body.yearofcreation) {
        text =
          "UPDATE distribucije_linuxa SET yearofcreation = $1 WHERE id = $2";
        values = [req.body.yearofcreation, req.params.id];
        var dist = await pool.query(text, values);
      }
      if (req.body.homepage) {
        text = "UPDATE distribucije_linuxa SET homepage = $1 WHERE id = $2";
        values = [req.body.homepage, req.params.id];
        var dist = await pool.query(text, values);
      }
      if (req.body.distrowatchrank) {
        text =
          "UPDATE distribucije_linuxa SET distrowatchrank = $1 WHERE id = $2";
        values = [req.body.distrowatchrank, req.params.id];
        var dist = await pool.query(text, values);
      }
      if (req.body.targetuse) {
        text = "UPDATE distribucije_linuxa SET targetuse = $1 WHERE id = $2";
        values = [req.body.targetuse, req.params.id];
        var dist = await pool.query(text, values);
      }
      if (req.body.supportedde) {
        text = "UPDATE distribucije_linuxa SET supportedde = $1 WHERE id = $2";
        values = [req.body.supportedde, req.params.id];
        var dist = await pool.query(text, values);
      }
      if (req.body.wikipage) {
        text = "UPDATE distribucije_linuxa SET wikipage = $1 WHERE id = $2";
        values = [req.body.wikipage, req.params.id];
        var dist = await pool.query(text, values);
      }

      //return new dist
      text = "SELECT * FROM distribucije_linuxa  WHERE id =  $1";
      values = [req.params.id];
      var dist = await pool.query(text, values);
      res.status(200).json({
        status: "Success",
        message: "Updated distribution info",
        response: dist.rows[0],
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).json({
        status: "Error",
        message: "Fetching distros failed",
        response: null,
      });
    }
  });
};
