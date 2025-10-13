import { convertToValidSlug } from './link';

const routes = {
  home: '/',
  login: '/login',
  internalError: '/internal-error',
  logout: '/logout',
  aboutUs: '/about-us',
  register: '/register',
  landing: '/landing',
  blog: {
    index: '/blog',
    tag: (slug: string) => `/blog/posts?tag=${slug}`,
    posts: {
      index: '/blog/posts',
      edit: (slug: string) => `/blog/posts/${slug}`,
    },
  },
  products: {
    index: '/products',
    ofCategory: (slug: string) => `/products/${slug}`,
  },
  cart: {
    index: '/cart',
    payment: {
      index: '/cart/payment',
    },
  },
  profile: {
    index: '/profile',
    edit: '/profile/edit',
    orders: '/profile/orders',
    recents: '/profile/recents',
    addresses: '/profile/addresses',
    favorites: '/profile/favorites',
  },
};

export default routes;
