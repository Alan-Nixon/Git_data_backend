
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
};

export type gitType = {
    Name: string,
    id: string,
    nodeId: string
    profileImg: string
    followers: number
    bio: string,
    repoUrl: string
    folowersUrl: string
    followingUrl: string
    gistsUrl: string
    location: string
    blog: string,
    createdAt: string
    followersId: string[] | []
}

export type userGitEssential = {
    _id:string
    login: string
    id: string
    node_id: string
    avatar_url: string
    followers: number
    bio: string
    html_url: string
    followers_url: string
    following_url: string
    gists_url: string
    location: string
    blog: string,
    created_at: string
    followersId: string[] | []
}

export interface dataGitInterface {
    userDetails: null | userGitEssential,
    repos: repoType[] | null
}

export type editUserType = {
    _id: string,
    location: string,
    bio: string,
    blog: string
}