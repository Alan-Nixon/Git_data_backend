import express from 'express'
import * as controller from '../Controllers/controller'

const Router = express.Router()

Router.get("/", controller.getGit)
Router.get("/getFollowersOfUser", controller.getFollowersOfUser)
Router.get('/isMutual', controller.isMutual)

export default Router 