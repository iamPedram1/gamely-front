import FooterLink from '@/components/layout/FooterLink';

interface FooterColumnProps {
  title: string;
  links: Array<{ to: string; label: string }>;
}

export default function FooterColumn(props: FooterColumnProps) {
  // Props
  const { title, links } = props;

  // Render
  return (
    <div className='space-y-4'>
      <h4 className='font-bold text-lg uppercase tracking-wide'>{title}</h4>
      <ul className='space-y-3 text-sm'>
        {links.map((link, index) => (
          <FooterLink key={index} to={link.to} label={link.label} />
        ))}
      </ul>
    </div>
  );
}
