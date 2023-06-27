import express from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";

import usersRouter from "./routes/users.router.js";
import petsRouter from "./routes/pets.router.js";
import adoptionsRouter from "./routes/adoption.router.js";
import sessionsRouter from "./routes/sessions.router.js";
import swaggerDoc from "swagger-jsdoc";
import swaggerUiExpress from "swagger-ui-express";

import path from "path";
import { fileURLToPath } from "url";
import logger from "./logger/loggerConfig.js";
import addLogger from "./middleware/loggerMiddleware.js";
import dotenv from "dotenv";
import handlebars from "express-handlebars";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8081;
const connection = mongoose.connect(process.env.MONGO_URL);

app.engine("handlebars", handlebars.engine());
app.set("views", `${__dirname}/views`);
app.set("view engine", "handlebars");

const swaggerOpts = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Documentación de Adoptame",
      description: "Api pensada para adopción de mascotas",
    },
  },
  apis: [`${__dirname}/docs/**/*.yaml`],
};

app.use(addLogger);
const specs = swaggerDoc(swaggerOpts);
app.use("/api/docs", swaggerUiExpress.serve, swaggerUiExpress.setup(specs));

app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.render("index", {});
});
app.use("/api/users", usersRouter);
app.use("/api/pets", petsRouter);
app.use("/api/adoptions", adoptionsRouter);
app.use("/api/sessions", sessionsRouter);

app.listen(PORT, () => logger.info(`Listening on ${PORT}`));
