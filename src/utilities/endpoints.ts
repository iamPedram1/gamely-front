const endpoints = {
  profile: '/user/profile',
  notifications: '/user/notifications',
  login: '/auth/login',
  register: '/auth/register',
  tokenRefresh: '/auth/token/refresh',
  tokenRevoke: '/auth/token/revoke',
  recoverPassword: '/auth/recover-password',
  changePassword: '/auth/change-password',
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
