import express, {Request, Response} from "express"
require("dotenv").config()

const app = express()

app.get("/", (req: Request, res: Response) => {
    res.send("Hello World")
})

app.listen(process.env.PORT || 3000, () => {
    console.log("Server is Running")
})
