require("dotenv").config();
var http = require("http");
var express = require("express");
const sql = require("mssql");
const app = express();
var server = http.createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});
// const EventEmitter = require("events");
// const eventEmitter = new EventEmitter();
// eventEmitter.setMaxListeners(10);
require('events').EventEmitter.defaultMaxListeners = 15;

app.use(express.static("public"));
app.set("view engine", "ejs");

const port = process.env.PORT;
const interval = process.env.INTERVAL;

app.get("/", function (req, res) {
  res.sendStatus(200);
});

app.get("/dies", function (req, res) {
  res.render("mte-dies", {
    data: {
      part: "DIES",
    },
  });
});

app.get("/doorframe", function (req, res) {
  res.render("mte-doorframe", {
    data: {
      part: "DOORFRAME",
    },
  });
});

app.get("/machine", function (req, res) {
  res.render("mte-machine", {
    data: {
      part: "MACHINE",
    },
  });
});

app.get("/jig", function (req, res) {
  res.render("mte-jig", {
    data: {
      part: "JIG",
    },
  });
});

app.get("/mold", function (req, res) {
  res.render("mte-mold", {
    data: {
      part: "MOLD",
    },
  });
});

app.get("/diesmold", function (req, res) {
  res.render("mte-dies-mold", {
    data: {
      part: "DIESMOLD",
    },
  });
});

app.get("/electrode", function (req, res) {
  res.render("mte-electrode", {
    data: {
      part: "ELECTRODE",
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

    new sql.Request().execute(
      "MTE.zsp_get_preventive_mte_mold",
      (err, result) => {
        if (err) {
          console.log(err);
          return;
        }
        io.emit("data_prev_mold", result.recordset);
      }
    );

    new sql.Request().execute(
      "MTE.zsp_get_preventive_mte_dies",
      (err, result) => {
        if (err) {
          console.log(err);
          return;
        }
        io.emit("data_prev_dies", result.recordset);
      }
    );

    new sql.Request().execute(
      "MTE.zsp_get_preventive_mte_df",
      (err, result) => {
        if (err) {
          console.log(err);
          return;
        }
        io.emit("data_prev_df", result.recordset);
      }
    );

    new sql.Request().execute(
      "MTE.zsp_get_preventive_mte_machine",
      (err, result) => {
        if (err) {
          console.log(err);
          return;
        }
        io.emit("data_prev_machine", result.recordset);
      }
    );

    new sql.Request().execute(
      "MTE.zsp_get_preventive_mte_jig",
      (err, result) => {
        if (err) {
          console.log(err);
          return;
        }
        io.emit("data_prev_jig", result.recordset);
      }
    );

    new sql.Request().execute(
      "MTE.zsp_get_preventive_mte_electrode",
      (err, result) => {
        if (err) {
          console.log(err);
          return;
        }
        io.emit("data_prev_electrode", result.recordset);
      }
    );
  });

  sql.on("error", (err) => {
    console.error(err);
  });
}, interval);

io.on("connection", function (socket) {});

server.listen(port, function () {
  console.log("running on:" + port);
});
