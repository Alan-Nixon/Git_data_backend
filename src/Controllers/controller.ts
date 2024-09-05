import { Request, Response } from 'express'
import { getDataFromDb, getGitFrom, saveRepo, saveToDb } from '../Repositary/Repositary'
import { repoImpType, repoType } from '../db/repositaryModel';
import { userGitEssential } from '../db/gitData';


export const getGit = async (req: Request, res: Response) => {
    try {
        const data = await getDataFromDb(req.query.repoName + "");
        if (data) {
            console.log(data);
            res.status(200).json({ status: true, data, message: "successs" })
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

async function insertData(name: string, dataGit: { userDetails: null | userGitEssential, repos: repoType[] | null }) {
    if (dataGit?.userDetails) {
        const response = await saveToDb({
            Name: dataGit.userDetails?.login ?? "no name given",
            id: dataGit.userDetails?.id ?? "no id available",
            nodeId: dataGit.userDetails?.node_id ?? "no node id available",
            profileImg: dataGit.userDetails?.avatar_url ?? "https://i.sstatic.net/frlIf.png",
            followers: dataGit.userDetails?.followers ?? 0,
            bio: dataGit.userDetails?.bio?.trim() ?? "Bio unavailable",
            repoUrl: dataGit.userDetails?.html_url ?? "link unavailable",
        });
        if (response) {
            if (dataGit.repos) {
                const repoArray = JSON.parse(JSON.stringify(dataGit.repos))
                const repo = repoArray.map((item: repoImpType) => ({
                    repoName: item.name + "" ?? "Repo name unavailable",
                    ownerId: response[0]?._id + "",
                    ownerName: response[0]?.Name + "",
                    repoUrl: item.html_url ?? "Repo url unavailable",
                    description: item.description ?? "Description not provided",
                    forked: !!item.fork,
                    visibility: item.visibility ?? "public",
                    defaultBranch: item.default_branch ?? "main"
                }))
                await saveRepo(repo.length > 0 ? repo : [])
                const data = await getDataFromDb(name);
                return { status: true, data: data ?? dataGit.userDetails, message: "success" }
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