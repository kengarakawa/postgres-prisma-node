import express from "express"

const app = express()

const port = process.env.PORT || 3000 

app.use(express.json())

import userRoutes  from "./routes/userRoute"


app.use("/users" , userRoutes)

app.listen(port , () => {
    console.log(`Running on port ${port}`)
})    