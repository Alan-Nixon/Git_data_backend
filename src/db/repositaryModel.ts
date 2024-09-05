import mongoose from 'mongoose'

export type repoType = {
    repoName: string,
    ownerId: string,
    ownerName: string
    repoUrl: string,
    description: string,
    forked: boolean,
    visibility: string,
    defaultBranch: string
}

export type repoImpType = {
    html_url: string;
    description: string;
    fork: any;
    visibility: string;
    default_branch: string;
    name: string;
    // name: string;
    // html_url: string;
    // description?: string; 
    // fork: boolean;
    // visibility?: string;
    // default_branch?: string; 
};


interface repoInterface extends Document {
    repoName: string,
    ownerId: string,
    ownerName: string
    repoUrl: string,
    description: string,
    forked: boolean,
    visibility: string,
    defaultBranch: string
}

const repoSchema = new mongoose.Schema<repoInterface>({
    repoName: { type: String, required: true },
    ownerId: { type: String, required: true },
    ownerName: { type: String, required: true },
    defaultBranch: { type: String, required: true },
    repoUrl: { type: String, required: true },
    description: { type: String, required: true },
    forked: { type: Boolean, required: true },
    visibility: { type: String, required: true }
})

export const repoModel = mongoose.model("repos", repoSchema)