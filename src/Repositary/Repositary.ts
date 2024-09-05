import axios from 'axios'
import { GitSchema, gitType } from '../db/gitData';
import { repoModel, repoType } from '../db/repositaryModel';


export const getGitFrom = async (gitName: string) => {
    try {
        const { data } = await axios.get(`https://api.github.com/users/${gitName}`);
        if (data?.repos_url) {
            return { userDetails: data, repos: await getRepo(data?.repos_url + "") }
        }
        return null
    } catch (error: any) {
        console.log(error.message ?? "Internal server error")
        return null
    }
}

export const getRepo = async (url: string) => {
    try {
        const { data } = await axios.get(url);
        return data
    } catch (error: any) {
        console.log(error.message ?? "Internal server error")
        return []
    }
}


export const getDataFromDb = async (name: string) => {
    try {
        return await GitSchema.findOne({ Name: name })
    } catch (error: any) {
        console.log(error.message ?? "Internal server error")
        return null
    }
}

export const saveToDb = async (Data: gitType) => {
    try {
        return await GitSchema.insertMany(Data)
    } catch (error: any) {
        console.log(error.message ?? "Internal server error")
        return null
    }
}

export const saveRepo = async (repo: repoType[] | []) => {
    try {
        if (repo.length !== 0) {
            return await repoModel.insertMany(repo)
        } else {
            return null
        }
    } catch (error: any) {
        console.log(error.message ?? "Internal server error")
        return null
    }
}