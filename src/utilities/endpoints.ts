const endpoints = {
  user: {
    index: '/user',
    notifications: '/notifications',
    details: (username: string) => `/user/${username}`,
    followers: (username: string) => `/follows/${username}/followers`,
    followings: (username: string) => `/follows/${username}/followings`,
    follow: (username: string) => `/follows/${username}/follow`,
    unfollow: (username: string) => `/follows/${username}/unfollow`,
    block: (username: string) => `/blocks/${username}/block`,
    unblock: (username: string) => `/blocks/${username}/unblock`,
    blocks: '/blocks',
    profile: {
      index: '/user/profile',
      followers: '/follows/followers',
      followings: '/follows/followings',
    },
  },
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    tokenRefresh: '/auth/token/refresh',
    tokenRevoke: '/auth/token/revoke',
    recoverPassword: '/auth/recover-password',
    changePassword: '/auth/change-password',
  },
  tags: '/tags',
  posts: '/posts',
  games: '/games',
  categories: '/categories',
  management: {
    tags: '/management/tags',
    games: '/management/games',
    categories: '/management/categories',
    posts: '/management/posts',
    users: '/management/users',
    comments: '/management/comments',
  },
};

export default endpoints;
