import logger from "../logger/loggerConfig.js";

const addLogger = (req, res, next) => {
  req.logger = logger;
  req.logger.info(
    `${req.method} call from ${req.url} at ${new Date().toLocaleDateString()}`
  );
  next();
};

export default addLogger;
