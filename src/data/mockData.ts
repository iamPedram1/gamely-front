import { PostProps, TagProps, CategoryProps, GameProps, UserProps } from '@/types/blog';

export const mockTags: TagProps[] = [
  { id: '1', title: 'RPG', slug: 'rpg' },
  { id: '2', title: 'Action', slug: 'action' },
  { id: '3', title: 'Strategy', slug: 'strategy' },
  { id: '4', title: 'Indie', slug: 'indie' },
  { id: '5', title: 'Multiplayer', slug: 'multiplayer' },
  { id: '6', title: 'Open World', slug: 'open-world' },
];

export const mockCategories: CategoryProps[] = [
  { id: '1', title: 'Reviews', slug: 'reviews' },
  { id: '2', title: 'News', slug: 'news' },
  { id: '3', title: 'Guides', slug: 'guides' },
  { id: '4', title: 'Interviews', slug: 'interviews' },
];

export const mockGames: GameProps[] = [
  {
    id: '1',
    title: 'Starfield Chronicles',
    slug: 'starfield-chronicles',
    coverImage:
      'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=800&q=80',
    description: 'An epic space exploration RPG',
    releaseDate: '2024-03-15',
  },
  {
    id: '2',
    title: 'Shadow Realm',
    slug: 'shadow-realm',
    coverImage:
      'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=800&q=80',
    description: 'Dark fantasy action adventure',
    releaseDate: '2024-02-20',
  },
  {
    id: '3',
    title: 'Cyber Nexus',
    slug: 'cyber-nexus',
    coverImage:
      'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&q=80',
    description: 'Futuristic cyberpunk strategy game',
    releaseDate: '2024-01-10',
  },
];

export const mockUsers: UserProps[] = [
  {
    id: '1',
    name: 'Alex Morgan',
    email: 'alex.morgan@gamehub.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
    bio: 'Senior game reviewer with 10 years of experience',
    role: 'admin',
    status: 'active',
    createdAt: '2023-01-15T10:00:00Z',
  },
  {
    id: '2',
    name: 'Sarah Chen',
    email: 'sarah.chen@gamehub.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    bio: 'Strategy game specialist and guide writer',
    role: 'author',
    status: 'active',
    createdAt: '2023-02-20T14:30:00Z',
  },
  {
    id: '3',
    name: 'Mike Johnson',
    email: 'mike.j@example.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike',
    bio: 'Gaming enthusiast',
    role: 'user',
    status: 'active',
    createdAt: '2023-03-10T09:15:00Z',
  },
  {
    id: '4',
    name: 'Emma Wilson',
    email: 'emma.w@example.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma',
    bio: 'Indie game lover',
    role: 'user',
    status: 'blocked',
    createdAt: '2023-04-05T16:45:00Z',
  },
];

export const mockPosts: PostProps[] = [
  {
    id: '1',
    title: 'Starfield Chronicles: A Deep Dive into Space Exploration',
    slug: 'starfield-chronicles-deep-dive',
    excerpt:
      'Exploring the vast universe of Starfield Chronicles and what makes it a groundbreaking RPG experience.',
    content: `# Starfield Chronicles: A Deep Dive into Space Exploration

Starfield Chronicles has taken the gaming world by storm with its unprecedented approach to space exploration. In this comprehensive review, we'll explore what makes this game a must-play for RPG enthusiasts.

## The Vast Universe

The game features over 1000 procedurally generated planets, each with unique ecosystems and civilizations. The attention to detail is remarkable, from the atmospheric effects to the diverse alien species you'll encounter.

## Gameplay Mechanics

The combat system blends traditional RPG elements with innovative space combat mechanics. Players can customize their ships, recruit crew members, and engage in both ground and space battles.

## Verdict

Starfield Chronicles sets a new standard for space RPGs. With its engaging story, deep customization options, and breathtaking visuals, it's a game that will keep you exploring for hundreds of hours.`,
    coverImage:
      'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=800&q=80',
    author: mockUsers[0],
    publishedAt: '2024-03-20T10:00:00Z',
    tags: [mockTags[0], mockTags[5]],
    category: mockCategories[0],
    game: mockGames[0],
    comments: [
      {
        id: '1',
        username: 'GameFan123',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=GameFan',
        content:
          "Great review! I've been playing for 50 hours and still discovering new things.",
        createdAt: '2024-03-21T14:30:00Z',
      },
      {
        id: '2',
        username: 'SpaceExplorer',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Space',
        content:
          "The ship customization is incredible. Best space game I've played!",
        createdAt: '2024-03-21T16:45:00Z',
      },
    ],
  },
  {
    id: '2',
    title: 'Shadow Realm: Mastering the Dark Arts',
    slug: 'shadow-realm-mastering-dark-arts',
    excerpt:
      "A comprehensive guide to mastering combat and magic in Shadow Realm's challenging world.",
    content: `# Shadow Realm: Mastering the Dark Arts

Shadow Realm presents players with one of the most challenging combat systems in recent memory. This guide will help you master the dark arts and survive the treacherous realm.

## Combat Fundamentals

Understanding the parry and dodge mechanics is crucial. Timing is everything in Shadow Realm, and mastering these basics will make even the toughest bosses manageable.

## Magic System

The game features a deep magic system with over 50 spells. Combining different elements creates powerful synergies that can turn the tide of battle.

## Boss Strategies

Each boss requires a unique approach. Study their patterns, exploit weaknesses, and don't be afraid to experiment with different builds.`,
    coverImage:
      'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=800&q=80',
    author: mockUsers[1],
    publishedAt: '2024-03-18T15:30:00Z',
    tags: [mockTags[1], mockTags[0]],
    category: mockCategories[2],
    game: mockGames[1],
    comments: [],
  },
  {
    id: '3',
    title: 'Cyber Nexus: The Future of Strategy Gaming',
    slug: 'cyber-nexus-future-strategy',
    excerpt:
      'How Cyber Nexus is revolutionizing the strategy genre with its innovative mechanics.',
    content: `# Cyber Nexus: The Future of Strategy Gaming

Cyber Nexus brings fresh ideas to the strategy genre, combining traditional RTS elements with modern innovations.

## Innovative Mechanics

The game introduces a unique "neural network" system where your decisions affect the AI behavior of both allies and enemies.

## Multiplayer Excellence

The competitive scene is thriving, with balanced factions and regular updates keeping the meta fresh.

## Visual Design

The cyberpunk aesthetic is stunning, with neon-lit cities and detailed unit designs that bring the world to life.`,
    coverImage:
      'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&q=80',
    author: mockUsers[0],
    publishedAt: '2024-03-15T09:00:00Z',
    tags: [mockTags[2], mockTags[4]],
    category: mockCategories[0],
    game: mockGames[2],
    comments: [
      {
        id: '3',
        username: 'StrategyPro',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Strategy',
        content: 'The neural network system is genius! Adds so much depth.',
        createdAt: '2024-03-16T11:20:00Z',
      },
    ],
  },
];