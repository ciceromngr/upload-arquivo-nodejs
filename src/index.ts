import dotenv from 'dotenv'
dotenv.config()

import 'reflect-metadata'
import './database'

import express from 'express'
import morgan from 'morgan'
import path from 'path'
import { router } from './router'

const app = express()
const port = process.env.SERVER_PORT || 5000

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(morgan("dev"))
app.use(
    "/files",
    express.static(path.resolve(__dirname, "..", "tmp", "upload"))
  );
app.use(router)
app.listen(port, () => console.log(`> running at ${port}`))