import express from "express"
import cors from 'cors'
import cookieParser from "cookie-parser"

const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))



app.use(express.json({limit: "50mb"}))
app.use(express.urlencoded({extended: true, limit: "50mb"}))
app.use(express.static("public"))
app.use(cookieParser())

//routes import
import authRouter from "./routes/auth.route.js"
import userRouter from "./routes/user.route.js"
import roleRouter from "./routes/role.route.js"
import permissionRouter from "./routes/permission.route.js"
import vehicleRouter from "./routes/vehicle.route.js"
import stsRouter from "./routes/sts.route.js"
import landfillRouter from "./routes/landfill.route.js"
import profileRouter from "./routes/profile.route.js"

app.use("/auth", authRouter);
app.use("/users", userRouter);
app.use("/rbac", roleRouter);
app.use("/rbac", permissionRouter)
app.use("/vehicle", vehicleRouter);
app.use("/sts", stsRouter);
app.use("/landfill", landfillRouter);
app.use("/profile", profileRouter);

export { app }
