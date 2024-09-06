import axios from 'axios'
import { userModel } from '../db/gitData';
import { repoModel } from '../db/repositaryModel';
import { gitType, repoType, userGitEssential } from '../Interfaces_types/interface-types';
import { insertData } from '../Controllers/controller';


export const getGitFrom = async (gitName: string) => {
    try {
        const { data } = await axios.get(`https://api.github.com/users/${gitName}`);
        if (data?.repos_url) {
            return { userDetails: data, repos: await getDataFromUrl(data?.repos_url + "") }
        }
        return null
    } catch (error: any) {
        console.log(error.message ?? "Internal server error")
        return null
    }
}

export const getDataFromUrl = async (url: string) => {
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
        return await userModel.findOne({ Name: name })
    } catch (error: any) {
        console.log(error.message ?? "Internal server error")
        return null
    }
}

export const getUserRepo = async (userId: string) => {
    try {
        return await repoModel.find({ ownerId: userId })
    } catch (error: any) {
        console.log(error.message ?? "Internal server error")
        return null
    }
}

export const saveToDb = async (Data: gitType) => {
    try {
        if (await userModel.findOne({ Name: Data.Name })) {
            return null
        } else {
            return await userModel.insertMany(Data)
        }
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

export const getFollowersFromDb = async (ownerId: string, ownerName: string) => {
    try {
        const data = await userModel.findById(ownerId);
        console.log(data?.followersId)
        if (data?.followersId.length === 0) {
            getAndInsertFollowers(data.folowersUrl)
        } else {
            // if it is in dabse
            const fol = data?.followersId.map(async item => await userModel.findById(item))
            console.log(fol)
            // const followers = await Promise.all(fol)
        }
    } catch (error: any) {
        console.log(error.message ?? "Internal server error")
        return null
    }
}



///////////////// helpers ////////////////////

const getAndInsertFollowers = async (fetchUrl: string) => {
    try {
        const followers = await getDataFromUrl(fetchUrl);
        const data = await Promise.all(followers.map(async (item: userGitEssential) => ({
            userDetails: item,
            repos: await getDataFromUrl(item.followers_url)
        })))
        const response = await Promise.all(data.map(async (item) => insertData(item.userDetails.login, item)))
        console.log(response)
    } catch (error: any) {
        console.log(error.message ?? "Internal server error")
    }
}