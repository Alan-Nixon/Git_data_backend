import mongoose, { Document } from 'mongoose'


export interface gitDataType extends Document {
    Name: string,
    id: number,
    nodeId: string,
    profileImg: string,
    followers: string,
    bio: string,
    repoUrl: string,
    folowersUrl: string,
    followingUrl: string
    gistsUrl: string
    location: string
    blog: string,
    createdAt: string
    followersId: string[] | []
}

const gitDataSchema = new mongoose.Schema<gitDataType>({
    Name: {
        type: String,
        required: true
    },
    id: {
        type: Number,
        required: true
    },
    nodeId: {
        type: String,
        required: true
    },
    profileImg: {
        type: String,
        required: true
    },
    followers: {
        type: String,
        required: true
    },
    bio: {
        type: String,
        required: true
    },
    repoUrl: {
        type: String,
        required: true
    },
    folowersUrl: {
        type: String,
        required: true
    },
    followingUrl: {
        type: String,
        required: true
    },
    gistsUrl: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    blog: {
        type: String,
        required: true
    },
    createdAt: {
        type: String,
        required: true
    },
    followersId: {
        type: [String],
        default: [],
        required: true
    }
})

export const userModel = mongoose.model("gitSchema", gitDataSchema)

// {
//     login: 'Alan-Nixon',
//     id: 136670282,
//     node_id: 'U_kgDOCCVsSg',
//     avatar_url: 'https://avatars.githubusercontent.com/u/136670282?v=4',
//     gravatar_id: '',
//     url: 'https://api.github.com/users/Alan-Nixon',
//     html_url: 'https://github.com/Alan-Nixon',
//     followers_url: 'https://api.github.com/users/Alan-Nixon/followers',
//     following_url: 'https://api.github.com/users/Alan-Nixon/following{/other_user}',
//     gists_url: 'https://api.github.com/users/Alan-Nixon/gists{/gist_id}',
//     starred_url: 'https://api.github.com/users/Alan-Nixon/starred{/owner}{/repo}',
//     subscriptions_url: 'https://api.github.com/users/Alan-Nixon/subscriptions',
//     organizations_url: 'https://api.github.com/users/Alan-Nixon/orgs',
//     repos_url: 'https://api.github.com/users/Alan-Nixon/repos',
//     events_url: 'https://api.github.com/users/Alan-Nixon/events{/privacy}',
//     received_events_url: 'https://api.github.com/users/Alan-Nixon/received_events',
//     type: 'User',
//     site_admin: false,
//     name: 'alan nixon',
//     company: null,
//     blog: '',
//     location: null,
//     email: null,
//     hireable: null,
//     bio: 'MERN developer \r\n',
//     twitter_username: null,
//     public_repos: 21,
//     public_gists: 0,
//     followers: 3,
//     following: 4,
//     created_at: '2023-06-15T03:50:56Z',
//     updated_at: '2024-08-10T08:09:40Z'
//   }