import app from "./api/routes/routes.js";

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
    return res.status(200).json({});
  }
});

app.use((errors, req, res, next) => {
  errors.statusCode = errors.statusCode || 500;
  errors.status = errors.status || "error";
  if (errors.joi) {
    return res.status(400).json({ error: error.joi.message });
  } else {
    res.status(errors.statusCode).json({
      status: errors.status,
      message: errors.message,
    });
  }
});

app.use((req, res, next) => {
  const error = new Error("not found");
  error.status = 404;
  next(error);
});


export default app;
