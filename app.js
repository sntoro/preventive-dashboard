require("dotenv").config();
const http = require("http");
const https = require('https');
const fs = require('fs');

var privateKey  = fs.readFileSync('./certificate/aisin-indonesia.co.id.key', 'utf8');
var certificate = fs.readFileSync('./certificate/aisin-indonesia.co.id.crt', 'utf8');
var credentials = {key: privateKey, cert: certificate};

const express = require("express");
const sql = require("mssql");
const app = express();

const server = http.createServer(app);
// const secureServer = https.createServer(credentials, app);

const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});

app.use(express.static("public"));
app.set("view engine", "ejs");

const port = process.env.PORT;
const securePort = process.env.PORT_SECURE;
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

const sqlConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  server: process.env.DB_HOST,
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000,
  },
  options: {
    encrypt: false,
    enableArithAbort: true,
  },
};

setInterval(function () {
  sql.connect(sqlConfig, (err) => {
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

// secureServer.listen(securePort, function () {
//   console.log("running on:" + securePort);
// });
