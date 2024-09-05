import express from 'express'
import * as controller from '../Controllers/controller'

const Router = express.Router()

Router.get("/", controller.getGit)

export default Router 