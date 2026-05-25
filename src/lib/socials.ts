export type SocialIconName = 'github' | 'rss' | 'x' | 'telegram';

export interface SocialLink {
  name: string;
  url: string;
  icon: SocialIconName;
}

/** Edit URLs here — used on home, nav, and mobile. */
export const socialLinks: SocialLink[] = [
  { name: 'GitHub', url: 'https://github.com/thomas-nick', icon: 'github' },
  { name: 'RSS', url: '/feed.xml', icon: 'rss' },
  { name: 'X', url: 'https://x.com/nthomas1999', icon: 'x' },
  { name: 'Telegram', url: 'https://t.me/nthomas1999', icon: 'telegram' },
];
