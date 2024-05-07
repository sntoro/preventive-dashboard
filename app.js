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
      part: "DIESSTAMPING",
    },
  });
});

app.get("/diesdoorframe", function (req, res) {
  res.render("diesdoorframe", {
    data: {
      part: "DIESDOORFRAME",
    },
  });
});

app.get("/mold", function (req, res) {
  res.render("mold", {
    data: {
      part: "MOLD",
    },
  });
});

app.get("/jig", function (req, res) {
  res.render("jig", {
    data: {
      part: "JIG",
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

    new sql.Request().query(
      "SELECT CHR_TOOL_CODE, CHR_TOOL_NAME, CHR_MODEL, \n\
        CASE WHEN INT_ACTUAL_STROKE_H_MINUS_1 >= INT_STD_STROKE THEN 'Must Preventive' \n\
            WHEN INT_ACTUAL_STROKE_H_MINUS_1 >= INT_STD_STROKE * 80/100 THEN 'Preventive Soon' \n\
            WHEN INT_ACTUAL_STROKE_H_MINUS_1 >= INT_STD_STROKE * 60/100 THEN 'On Monitoring' \n\
            ELSE 'No Need Preventive' END AS CHR_STATUS_PREVENTIVE, \n\
        CASE WHEN INT_ACTUAL_STROKE_H_MINUS_1 >= INT_STD_STROKE THEN 1 \n\
            WHEN INT_ACTUAL_STROKE_H_MINUS_1 >= INT_STD_STROKE * 80/100 THEN 2 \n\
            WHEN INT_ACTUAL_STROKE_H_MINUS_1 >= INT_STD_STROKE * 60/100 THEN 3 \n\
            ELSE 4 END AS ORDER_STATUS_PREVENTIVE, INT_ACTUAL_STROKE_H_MINUS_1, INT_STD_STROKE \n\
        FROM DB_SAMARA.dbo.TM_TOOL WHERE CASE WHEN INT_ACTUAL_STROKE_H_MINUS_1 >= INT_STD_STROKE THEN 'Must Preventive' \n\
            WHEN INT_ACTUAL_STROKE_H_MINUS_1 >= INT_STD_STROKE * 80/100 THEN 'Preventive Soon' \n\
            WHEN INT_ACTUAL_STROKE_H_MINUS_1 >= INT_STD_STROKE * 60/100 THEN 'On Monitoring' \n\
            ELSE 'No Need Preventive' END IN ('Must Preventive','Preventive Soon','On Monitoring') \n\
            AND CHR_TOOL_TYPE = 'DIESSTAMPING' \n\
            ORDER BY ORDER_STATUS_PREVENTIVE",
      (err, result) => {
        if (err) {
          console.log(err);
          return;
        }
        // console.log(result.recordset);
        io.emit("prev_diesstamping", result.recordset);
      }
    );

    new sql.Request().query(
      "SELECT CHR_TOOL_CODE, CHR_TOOL_NAME, CHR_MODEL, \n\
        CASE WHEN INT_ACTUAL_STROKE_H_MINUS_1 >= INT_STD_STROKE THEN 'Must Preventive' \n\
            WHEN INT_ACTUAL_STROKE_H_MINUS_1 >= INT_STD_STROKE * 80/100 THEN 'Preventive Soon' \n\
            WHEN INT_ACTUAL_STROKE_H_MINUS_1 >= INT_STD_STROKE * 60/100 THEN 'On Monitoring' \n\
            ELSE 'No Need Preventive' END AS CHR_STATUS_PREVENTIVE, \n\
        CASE WHEN INT_ACTUAL_STROKE_H_MINUS_1 >= INT_STD_STROKE THEN 1 \n\
            WHEN INT_ACTUAL_STROKE_H_MINUS_1 >= INT_STD_STROKE * 80/100 THEN 2 \n\
            WHEN INT_ACTUAL_STROKE_H_MINUS_1 >= INT_STD_STROKE * 60/100 THEN 3 \n\
            ELSE 4 END AS ORDER_STATUS_PREVENTIVE, INT_ACTUAL_STROKE_H_MINUS_1, INT_STD_STROKE \n\
        FROM DB_SAMARA.dbo.TM_TOOL WHERE CASE WHEN INT_ACTUAL_STROKE_H_MINUS_1 >= INT_STD_STROKE THEN 'Must Preventive' \n\
            WHEN INT_ACTUAL_STROKE_H_MINUS_1 >= INT_STD_STROKE * 80/100 THEN 'Preventive Soon' \n\
            WHEN INT_ACTUAL_STROKE_H_MINUS_1 >= INT_STD_STROKE * 60/100 THEN 'On Monitoring' \n\
            ELSE 'No Need Preventive' END IN ('Must Preventive','Preventive Soon','On Monitoring') \n\
            AND CHR_TOOL_TYPE = 'DIESDOORFRAME' \n\
            ORDER BY ORDER_STATUS_PREVENTIVE",
      (err, result) => {
        if (err) {
          console.log(err);
          return;
        }
        // console.log(result.recordset);
        io.emit("prev_diesdoorframe", result.recordset);
      }
    );

    new sql.Request().query(
      "SELECT CHR_TOOL_CODE, CHR_TOOL_NAME, CHR_MODEL, \n\
        CASE WHEN INT_ACTUAL_STROKE_H_MINUS_1 >= INT_STD_STROKE THEN 'Must Preventive' \n\
            WHEN INT_ACTUAL_STROKE_H_MINUS_1 >= INT_STD_STROKE * 80/100 THEN 'Preventive Soon' \n\
            WHEN INT_ACTUAL_STROKE_H_MINUS_1 >= INT_STD_STROKE * 60/100 THEN 'On Monitoring' \n\
            ELSE 'No Need Preventive' END AS CHR_STATUS_PREVENTIVE, \n\
        CASE WHEN INT_ACTUAL_STROKE_H_MINUS_1 >= INT_STD_STROKE THEN 1 \n\
            WHEN INT_ACTUAL_STROKE_H_MINUS_1 >= INT_STD_STROKE * 80/100 THEN 2 \n\
            WHEN INT_ACTUAL_STROKE_H_MINUS_1 >= INT_STD_STROKE * 60/100 THEN 3 \n\
            ELSE 4 END AS ORDER_STATUS_PREVENTIVE, INT_ACTUAL_STROKE_H_MINUS_1, INT_STD_STROKE \n\
        FROM DB_SAMARA.dbo.TM_TOOL WHERE CASE WHEN INT_ACTUAL_STROKE_H_MINUS_1 >= INT_STD_STROKE THEN 'Must Preventive' \n\
            WHEN INT_ACTUAL_STROKE_H_MINUS_1 >= INT_STD_STROKE * 80/100 THEN 'Preventive Soon' \n\
            WHEN INT_ACTUAL_STROKE_H_MINUS_1 >= INT_STD_STROKE * 60/100 THEN 'On Monitoring' \n\
            ELSE 'No Need Preventive' END IN ('Must Preventive','Preventive Soon','On Monitoring') \n\
            AND CHR_TOOL_TYPE = 'MOLD' \n\
            ORDER BY ORDER_STATUS_PREVENTIVE",
      (err, result) => {
        if (err) {
          console.log(err);
          return;
        }
        // console.log(result.recordset);
        io.emit("prev_mold", result.recordset);
      }
    );

    new sql.Request().query(
      "SELECT CHR_TOOL_CODE, CHR_TOOL_NAME, CHR_MODEL, \n\
        CASE WHEN INT_ACTUAL_STROKE_H_MINUS_1 >= INT_STD_STROKE THEN 'Must Preventive' \n\
            WHEN INT_ACTUAL_STROKE_H_MINUS_1 >= INT_STD_STROKE * 80/100 THEN 'Preventive Soon' \n\
            WHEN INT_ACTUAL_STROKE_H_MINUS_1 >= INT_STD_STROKE * 60/100 THEN 'On Monitoring' \n\
            ELSE 'No Need Preventive' END AS CHR_STATUS_PREVENTIVE, \n\
        CASE WHEN INT_ACTUAL_STROKE_H_MINUS_1 >= INT_STD_STROKE THEN 1 \n\
            WHEN INT_ACTUAL_STROKE_H_MINUS_1 >= INT_STD_STROKE * 80/100 THEN 2 \n\
            WHEN INT_ACTUAL_STROKE_H_MINUS_1 >= INT_STD_STROKE * 60/100 THEN 3 \n\
            ELSE 4 END AS ORDER_STATUS_PREVENTIVE, INT_ACTUAL_STROKE_H_MINUS_1, INT_STD_STROKE \n\
        FROM DB_SAMARA.dbo.TM_TOOL WHERE CASE WHEN INT_ACTUAL_STROKE_H_MINUS_1 >= INT_STD_STROKE THEN 'Must Preventive' \n\
            WHEN INT_ACTUAL_STROKE_H_MINUS_1 >= INT_STD_STROKE * 80/100 THEN 'Preventive Soon' \n\
            WHEN INT_ACTUAL_STROKE_H_MINUS_1 >= INT_STD_STROKE * 60/100 THEN 'On Monitoring' \n\
            ELSE 'No Need Preventive' END IN ('Must Preventive','Preventive Soon','On Monitoring') \n\
            AND CHR_TOOL_TYPE = 'JIG' \n\
            ORDER BY ORDER_STATUS_PREVENTIVE",
      (err, result) => {
        if (err) {
          console.log(err);
          return;
        }
        // console.log(result.recordset);
        io.emit("prev_jig", result.recordset);
      }
    );

  });

  sql.on("error", (err) => {
    console.error(err);
  });
}, interval);

io.on("connection", function (socket) {
  console.log(socket)
});

server.listen(port, function () {
  console.log("running on:" + port);
});
