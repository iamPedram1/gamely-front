import { Link } from 'react-router-dom';

// Props
interface FooterLinkProps {
  to: string;
  label: string;
}

// Render
export default function FooterLink({ to, label }: FooterLinkProps) {
  return (
    <li>
      <Link
        to={to}
        className='text-muted-foreground hover:text-primary transition-colors flex items-center gap-2'
      >
        <span className='w-1 h-1 rounded-full bg-primary' />
        {label}
      </Link>
    </li>
  );
}
