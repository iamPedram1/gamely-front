const endpoints = {
  user: {
    index: '/user',
    notifications: '/user/notifications',
    details: (username: string) => `/user/${username}`,
    followers: (username: string) => `/user/follows/${username}/followers`,
    followings: (username: string) => `/fuser/ollows/${username}/followings`,
    follow: (username: string) => `/user/follows/${username}/follow`,
    unfollow: (username: string) => `/user/follows/${username}/unfollow`,
    block: (username: string) => `/user/blocks/${username}/block`,
    unblock: (username: string) => `/user/blocks/${username}/unblock`,
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
  reports: '/reports',
  games: '/games',
  favoriteGames: {
    ofUser: (username: string) => `/user/${username}/favorite-games`,
    favorite: (gameId: string) => `/user/favorite-games/${gameId}`,
  },
  categories: '/categories',
  management: {
    tags: '/management/tags',
    games: '/management/games',
    posts: '/management/posts',
    users: '/management/users',
    reports: '/management/reports',
    comments: '/management/comments',
    categories: '/management/categories',
  },
};

export default endpoints;
