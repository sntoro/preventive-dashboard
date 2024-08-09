require("dotenv").config();
const https = require("https");

const fs = require("fs");
var privateKey = fs.readFileSync(process.env.CERTIFICATE_KEY,"utf8");
var certificate = fs.readFileSync(process.env.CERTIFICATE_CRT,"utf8");
var credentials = { key: privateKey, cert: certificate };

const express = require("express");
const app = (module.exports.app = express());

const server = https.createServer(credentials, app);
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});

const sql = require("mssql");
const config = require("./config").config;

app.use(express.static("public"));
app.set("view engine", "ejs");

const port = process.env.PORT;
const interval = process.env.INTERVAL;

app.get("/", function (req, res) {
  res.sendStatus(200);
});

app.get("/diesstamping", function (req, res) {
  res.render("diesstamping", {
    data: {
      type: "DIESSTAMPING",
    },
  });
});

app.get("/diesdoorframe", function (req, res) {
  res.render("diesdoorframe", {
    data: {
      type: "DIESDOORFRAME",
    },
  });
});

app.get("/mold", function (req, res) {
  res.render("mold", {
    data: {
      type: "MOLD",
    },
  });
});

app.get("/jig", function (req, res) {
  res.render("jig", {
    data: {
      type: "JIG",
    },
  });
});

setInterval(function () {
  sql.connect(config, (err) => {
    if (err) {
      console.log(err);
      return;
    }

    new sql.Request()
      .input("CHR_TOOL_TYPE", sql.VarChar, "JIG")
      .execute("DB_SAMARA.dbo.zsp_get_preventive_mte", (err, result) => {
        if (err) {
          console.log(err);
          return;
        }
        // console.log(result.recordset);
        io.emit("data_preventive_jig", result.recordset);
      });

    new sql.Request()
      .input("CHR_TOOL_TYPE", sql.VarChar, "MOLD")
      .execute("DB_SAMARA.dbo.zsp_get_preventive_mte", (err, result) => {
        if (err) {
          console.log(err);
          return;
        }
        // console.log(result.recordset);
        io.emit("data_preventive_mold", result.recordset);
      });

    new sql.Request()
      .input("CHR_TOOL_TYPE", sql.VarChar, "DIESDOORFRAME")
      .execute("DB_SAMARA.dbo.zsp_get_preventive_mte", (err, result) => {
        if (err) {
          console.log(err);
          return;
        }
        // console.log(result.recordset);
        io.emit("data_preventive_diesdoorframe", result.recordset);
      });

    new sql.Request()
      .input("CHR_TOOL_TYPE", sql.VarChar, "DIESSTAMPING")
      .execute("DB_SAMARA.dbo.zsp_get_preventive_mte", (err, result) => {
        if (err) {
          console.log(err);
          return;
        }
        // console.log(result.recordset);
        io.emit("data_preventive_diesstamping", result.recordset);
      });
  });

  sql.on("error", (err) => {
    console.error(err);
  });
}, interval);

io.on("connection", function (socket) {
  // console.log(socket);
});

server.listen(port, function () {
  console.log("running on:" + port);
});

