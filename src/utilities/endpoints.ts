const endpoints = {
  user: {
    index: '/user',
    details: (username: string) => `/user/${username}`,
    notifications: '/user/notifications',
    followers: (username: string) => `/user/${username}/followers`,
    followings: (username: string) => `/user/${username}/followings`,
    follow: (username: string) => `/user/${username}/follow`,
    unfollow: (username: string) => `/user/${username}/unfollow`,
    block: (username: string) => `/user/${username}/block`,
    unblock: (username: string) => `/user/${username}/unblock`,
    profile: {
      index: '/user/profile',
      followers: '/user/profile/followers',
      followings: '/user/profile/followings',
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
