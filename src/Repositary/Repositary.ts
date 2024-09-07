import axios from 'axios'
import { userModel } from '../db/gitData';
import { repoModel } from '../db/repositaryModel';
import { editUserType, gitType, repoType, userGitEssential } from '../Interfaces_types/interface-types';
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

export const deleteRepoGitByUserId = async (userId: string) => {
    try {
        await userModel.findByIdAndDelete(userId)
        await repoModel.deleteMany({ ownerId: userId })
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

        if (data?.followersId.length === 0) {

            const insertedUsers = await getAndInsertFollowers(data.folowersUrl)
            if (insertedUsers && insertedUsers.length > 0) {
                data.followersId = insertedUsers.map(item => item?._id + "")
                data.followers = insertedUsers.length + "" || data.followers
                await data.save()
            }
            return insertedUsers || []
        } else {
            return await Promise.all(data?.followersId?.map(async (item) => await userModel.findById(item)) || []);
        }
    } catch (error: any) {
        console.log(error.message ?? "Internal server error")
        return null
    }
}

export const getFollowerLinkByUserId = async (userId: string) => {
    try {
        return (await userModel.findById(userId))?.folowersUrl || ""
    } catch (error: any) {
        return ""
    }
}

export const updateUserDetails = async(data: editUserType) => {
    try {
        console.log(data)
        const userData = await userModel.findById(data._id);
        if(userData) {
            userData.location = data.location === "undefined" ?  userData.location : data.location
            userData.bio = data.bio === "undefined" ?  userData.bio : data.bio
            userData.blog = data.blog === "undefined" ?  userData.blog : data.blog
            await userData.save();
            return userData
        }
        return null
    } catch (error: any) {
        console.log(error)
        return null
    }
}



///////////////// helpers ////////////////////

const getAndInsertFollowers = async (fetchUrl: string) => {
    try {
        const followers = await getDataFromUrl(fetchUrl);
        const data = await Promise.all(followers.map(async (item: userGitEssential) => ({ userDetails: item, repos: await getDataFromUrl(item.followers_url) })))
        return await Promise.all(data.map(async (item) => (await insertData(item.userDetails.login, item))?.data?.userRepo));
    } catch (error: any) {
        console.log(error.message ?? "Internal server error")
    }
}