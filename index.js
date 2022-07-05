import express from "express";
//Main Route
import router from "./router.js";

const app = express();

app.use(express.json())

app.use("/", router);

app.listen(3000);