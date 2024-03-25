import dotenv from "dotenv"
import { app } from "./src/app.js";
import connectDB from "./src/db/index.js";

dotenv.config({
    path: './.env'
})



connectDB();

app.listen(process.env.PORT || 4000, () => {
  console.log(`⚙️ Server is running at port : ${process.env.PORT}`);
});


