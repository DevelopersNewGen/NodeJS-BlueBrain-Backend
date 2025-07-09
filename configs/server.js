"use strict";
import { dbConnection } from "./mongo.js";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import apiLimiter from "../src/middlewares/rate-limit-validator.js";
import authRoutes from "../src/auth/auth.routes.js";
import subjectRoutes from "../src/subject/subject.routes.js";
import userRoutes from "../src/user/user.routes.js";
import reportRoutes from "../src/report/report.routes.js";
import applicationRoutes from "../src/application/application.routes.js";
import {createDefaultAdmin, createDefaultSubject} from "./default-data.js";
import materialRoutes from "../src/material/material.routes.js";

const middlewares = (app) => {
  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());
  app.use(cors());
  app.use(helmet());
  app.use(morgan("dev"));
  app.use(apiLimiter);
};

const routes = (app) => {
  app.use("/BlueBrain/v1/auth", authRoutes);
  app.use("/BlueBrain/v1/subjects", subjectRoutes);
  app.use("/BlueBrain/v1/users", userRoutes);
  app.use("/BlueBrain/v1/reports", reportRoutes);
  app.use("/BlueBrain/v1/applications", applicationRoutes);
  app.use("/BlueBrain/v1/materials", materialRoutes);
};

const conectarDB = async () => {
  try {
    await dbConnection();
  } catch (err) {
    console.log(`Database connection failed: ${err}`);
    process.exit(1);
  }
};

export const initServer = () => {
  const app = express();
  try {
    middlewares(app);
    conectarDB();
    createDefaultAdmin();
    createDefaultSubject();
    routes(app);
    const port = process.env.PORT;
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (err) {
    console.log(`Server init failed: ${err}`);
  }
};
