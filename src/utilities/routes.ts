const routes = {
  home: '/',
  login: '/login',
  passwordRecovery: '/password-recovery',
  register: '/register',
  games: {
    index: '/games',
    details: (slug: string) => '/games/' + slug,
  },
  users: {
    details: (username: string) => '/user/' + username,
    followers: (username: string) => `/user/${username}/followers`,
    followings: (username: string) => `/user/${username}/followings`,
  },
  profile: {
    index: '/profile',
    blockList: '/profile/block-list',
    followers: '/profile/followers',
    followings: '/profile/followings',
  },
  posts: {
    index: '/posts',
    details: (slug: string) => '/posts/' + slug,
  },
  tags: {
    index: '/tags',
    details: (slug: string) => '/tags/' + slug,
  },
  categories: {
    index: '/categories',
    details: (slug: string) => '/categories/' + slug,
  },
  dashboard: {
    comments: '/dashboard/comments',
    games: {
      index: '/dashboard/games',
      add: '/dashboard/games/add',
      edit: (id: string) => '/dashboard/games/' + id,
    },
    posts: {
      index: '/dashboard/posts',
      add: '/dashboard/posts/add',
      edit: (id: string) => '/dashboard/posts/' + id,
    },
    bans: {
      index: '/dashboard/bans',
    },
    tags: {
      index: '/dashboard/tags',
      add: '/dashboard/tags/add',
      edit: (id: string) => '/dashboard/tags/' + id,
    },
    users: {
      index: '/dashboard/users',
      edit: (id: string) => '/dashboard/users/' + id,
    },
    reports: '/dashboard/reports',
    categories: {
      index: '/dashboard/categories',
      add: '/dashboard/categories/add',
      edit: (id: string) => '/dashboard/categories/' + id,
    },
  },
};

export default routes;
