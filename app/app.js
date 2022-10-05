/*!
 * Premier's Awards Nomination web application (main)
 * File: app.js
 * Copyright(c) 2022 BC Gov
 * MIT Licensed
 */

"use strict";

const express = require("express");
const history = require("connect-history-api-fallback");
const path = require("path");
const cors = require("cors");

// Routers
const indexRouter = require("./routes/index.router");
const settingsRouter = require("./routes/settings.router");
const dataRouter = require("./routes/data.router");
const attachmentsRouter = require("./routes/attachments.router");
const secureRouter = require("./routes/user.router");
const frontendRouter = require("./routes/frontend.router");
const eventRegistrationRouter = require("./table_registration/routes/registration.router");
const tableRegRouter = require("./table_registration/routes/index-tableregistration.router");

// Database
const db = require("./db");
const mongoSanitize = require("express-mongo-sanitize");

// Handlers
const { notFoundHandler, globalHandler } = require("./error");
const cookieParser = require("cookie-parser");
const { authenticate } = require("./services/auth.services");
// const helmet = require('helmet');

/**
 * Express Security Middleware
 *
 * Hide Express usage information from public.
 * Use Helmet for security HTTP headers
 * - Strict-Transport-Security enforces secure (HTTP over SSL/TLS)
 *   connections to the server
 * - X-Frame-Options provides clickjacking protection
 * - X-XSS-Protection enables the Cross-site scripting (XSS)
 *   filter built into most recent web browsers
 * - X-Content-Type-Options prevents browsers from MIME-sniffing
 *   a response away from the declared _static-type
 *   Content-Security-Policy prevents a wide range of attacks,
 *   including Cross-site scripting and other cross-site injections
 *
 *   Online checker: http://cyh.herokuapp.com/cyh.
 */

const allowedOrigins =
  process.env.NODE_ENV === "local"
      ? [
          "http://localhost:3000",
          "http://localhost:3001",
          "http://localhost:3002",
          "http://localhost",
      ]
      : [process.env.APP_BASE_URL];

const corsConfig = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg =
        "The CORS policy for this site does not " +
        "allow access from the specified origin: \n" +
        origin;
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  methods: ["GET", "POST"],
  credentials: true,
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

/**
 * Frontend application (Vue) server
 */

const frontend = express();
frontend.disable("x-powered-by");
frontend.use(express.json());
frontend.use(express.urlencoded({ extended: true }));
frontend.use(cors(corsConfig));
frontend.use(history());
frontend.get("/", frontendRouter);
frontend.use("/", express.static(path.join(__dirname, "views")));
console.log("Serving frontend files at ", path.join(__dirname, "views"));

/**
 * Table Registration Component (Vue) server
 */

const tableReg = express();
tableReg.disable("x-powered-by");
tableReg.use(express.json());
tableReg.use(express.urlencoded({ extended: true }));
tableReg.use(cors(corsConfig));
tableReg.use(history());
tableReg.get("/", tableRegRouter);
tableReg.use(
  "/",
  express.static(path.join(__dirname, "table_registration/views"))
);
console.log(
  "Serving table registration files at ",
  path.join(__dirname, "table_registration/views")
);

/**
 * API server
 */

const api = express();
api.disable("x-powered-by");
// app.use(helmet({contentSecurityPolicy: false}));
api.use(express.json());
api.use(express.urlencoded({ extended: true }));
api.use(cors(corsConfig));

// parse cookies to store session data
api.use(cookieParser(process.env.COOKIE_SECRET || "testsecret"));

// log all requests
api.use(function timeLog(req, res, next) {
  const d = new Date();
  console.log("Request: ", req.method, req.path, d);
  next();
});

// authenticate user for all routes
api.all("*", authenticate);

// initialize routers for API calls
api.use("/", indexRouter);
indexRouter.use("/settings", settingsRouter);
indexRouter.use("/data", dataRouter);
indexRouter.use("/attachments", attachmentsRouter);
indexRouter.use("/users", secureRouter);
indexRouter.use("/tables", eventRegistrationRouter);

// sanitize db keys to prevent injection
api.use(mongoSanitize);

// handle generic errors
api.use(globalHandler);

// handle 404 errors
api.use(notFoundHandler);

// set port, listen for requests
frontend.listen(3000, () => {
  console.log(`Frontend server is running on port 3000.`);
});

tableReg.listen(3002, () => {
  console.log(`Table registration server is running on port 3002.`);
});

api.listen(3001, () => {
  console.log(`API server is running on port 3001.`);
  console.log(`Run mode: ${process.env.NODE_ENV}`);
  console.log(`Base URL: ${process.env.APP_BASE_URL}`);
});
