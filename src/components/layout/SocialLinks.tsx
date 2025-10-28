import { useTranslation } from 'react-i18next';
import { Github, Twitter, Youtube } from 'lucide-react';

interface SocialIconProps {
  icon: React.ReactNode;
  href: string;
}

function SocialIcon({ icon, href }: SocialIconProps) {
  return (
    <a
      href={href}
      className='p-3 rounded-lg bg-primary/20 hover:bg-primary/35 text-primary transition-all hover:scale-110 glow-effect'
    >
      {icon}
    </a>
  );
}

export default function SocialLinks() {
  return (
    <div className='flex gap-3'>
      <SocialIcon icon={<Twitter className='h-5 w-5' />} href='#' />
      <SocialIcon icon={<Youtube className='h-5 w-5' />} href='#' />
      <SocialIcon icon={<Github className='h-5 w-5' />} href='#' />
    </div>
  );
}