import dotenv from 'dotenv'
import express from 'express'
import cors from 'cors'
dotenv.config('../.env')

const app = express()
app.use(cors())
app.use(express.json())
const PORT = process.env.PORT || 8080

app.get('/',(req,res)=>res.send(`Server is running on port ${PORT}`))

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT} `)
})

