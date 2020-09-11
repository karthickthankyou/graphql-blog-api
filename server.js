const express = require("express")
const dotenv = require("dotenv")

const { connectDB } = require("./db")
const app = express()
dotenv.config()

connectDB()

app.get("/", (req, res) => {
  res.json({ msg: "hello world" })
})

app.listen(process.env.PORT, () => {
  console.log(`App running on PORT ${process.env.PORT}`)
})
