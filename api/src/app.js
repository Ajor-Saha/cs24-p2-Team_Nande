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

app.use("/auth", authRouter);
app.use("/users", userRouter);
app.use("/rbac", roleRouter);
app.use("/rbac", permissionRouter)

export { app }
