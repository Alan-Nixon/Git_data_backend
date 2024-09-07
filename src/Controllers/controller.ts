import { Request, Response } from 'express'
import { deleteRepoGitByUserId, getDataFromDb, getDataFromUrl, getFollowerLinkByUserId, getFollowersFromDb, getGitFrom, getUserRepo, saveRepo, saveToDb, updateUserDetails } from '../Repositary/Repositary'
import { dataGitInterface, repoImpType, userGitEssential } from '../Interfaces_types/interface-types';


export const getGit = async (req: Request, res: Response) => {
    try {
        const data = await getDataFromDb(req.query.repoName + "");
        if (data) {
            const repo = await getUserRepo(data._id + "")
            res.status(200).json({ status: true, data: { userRepo: data, repo }, message: "successs" })
        } else {
            const dataGit = await getGitFrom(req.query.repoName + "")
            if (dataGit) {
                res.status(200).json(await insertData(req.query.repoName + "", dataGit))
            } else {
                res.status(200).json({ status: false, data: null, message: "Unable to find repositary" })
            }
        }
    } catch (error: any) {
        console.log(error?.message ?? "Internal error occured")
        res.status(201).json({ status: false, message: error?.message ?? "Internal error occured", data: null })
    }
}


export const getFollowersOfUser = async (req: Request, res: Response) => {
    try {
        const { ownerId, ownerName } = req.query
        const followers = await getFollowersFromDb(ownerId + "", ownerName + "");
        res.status(200).json({ status: false, message: "success", data: followers || [] })
    } catch (error: any) {
        console.log(error?.message ?? "Internal error occured")
        res.status(201).json({ status: false, message: error?.message ?? "Internal error occured", data: null })
    }
}


export const isMutual = async (req: Request, res: Response) => {
    try {
        const query = JSON.parse(req.query.data as string)
        const mutualArray = await Promise.all(query.followerIds.map(async (item: string) => await updateFollowers(item, query.userName)))
        res.status(200).json({ status: true, message: "success", data: mutualArray })
    } catch (error: any) {
        console.log(error?.message ?? "Internal error occured")
        res.status(201).json({ status: false, message: error?.message ?? "Internal error occured", data: null })
    }
}

export const deleteRepoGit = async (req: Request, res: Response) => {
    try {
        await deleteRepoGitByUserId(req.query.userId + "")
        res.status(200).json({ status: true, message: "success", data: null })
    } catch (error: any) {
        console.log(error?.message ?? "Internal error occured")
        res.status(201).json({ status: false, message: error?.message ?? "Internal error occured", data: null })
    }
}

export const editDetails = async (req: Request, res: Response) => {
    try {
        const data = await updateUserDetails(req.body)
        console.log(data)
        res.status(200).json({ status: true, message: "success", data })
    } catch (error: any) {
        console.log(error?.message ?? "Internal error occured")
        res.status(201).json({ status: false, message: error?.message ?? "Internal error occured", data: null })
    }
}

//////////////////// helper functions ///////////////////// 


export async function insertData(name: string, dataGit: dataGitInterface) {
    if (dataGit?.userDetails) {
        const response = await saveToDb({
            Name: dataGit.userDetails?.login || "no name given",
            id: dataGit.userDetails?.id || "no id available",
            nodeId: dataGit.userDetails?.node_id || "no node id available",
            profileImg: dataGit.userDetails?.avatar_url || "https://i.sstatic.net/frlIf.png",
            followers: Number(dataGit.userDetails?.followers || 0),
            bio: dataGit.userDetails?.bio?.trim() || "Bio unavailable",
            repoUrl: dataGit.userDetails?.html_url || "link unavailable",
            folowersUrl: dataGit.userDetails?.followers_url || "link unavailable",
            followingUrl: dataGit.userDetails?.following_url || "link unavailable",
            gistsUrl: dataGit.userDetails?.gists_url || "link unavailable",
            location: dataGit.userDetails?.location || "location unavailable",
            blog: dataGit.userDetails?.blog || "blog unavailable",
            createdAt: dataGit.userDetails?.created_at || "created date unavailable",
            followersId: []
        });
        if (response) {
            if (dataGit.repos) {
                const repoArray = JSON.parse(JSON.stringify(dataGit.repos))
                const repo = repoArray.map((item: repoImpType) => ({
                    repoName: item.name || "Repo name unavailable",
                    ownerId: response[0]?._id + "",
                    ownerName: response[0]?.Name + "",
                    repoUrl: item.html_url || "Repo url unavailable",
                    description: item.description || "Description not provided",
                    forked: !!item.fork,
                    visibility: item.visibility || "public",
                    defaultBranch: item.default_branch || "main"
                }))
                await saveRepo(repo.length > 0 ? repo : [])
                const data = await getDataFromDb(name);
                return { status: true, data: { userRepo: data || dataGit.userDetails, repo }, message: "success" }
            } else {
                return { status: false, data: null, message: "Unable to find repositary" }
            }
        } else {
            return { status: false, data: null, message: "Error occured while inserting" }
        }
    } else {
        return { status: false, data: null, message: "no such git repositary" }
    }
}

const updateFollowers = async (followerId: string, userName: string) => {
    try {
        const followerLink = await getFollowerLinkByUserId(followerId)
        const followers = await getDataFromUrl(followerLink);
        return !!followers.find((item: userGitEssential) => item.login === userName)
    } catch (error: any) {
        console.log(error)
    }
}