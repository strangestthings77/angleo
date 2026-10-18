import { MailIcon, PhoneIcon } from '@/components/ui/Icon';
import { site } from '@/content/site';

export function ContactList({ inverse = false }: { inverse?: boolean }) {
  const { contact } = site;
  const link = `inline-flex min-h-11 items-center gap-3 transition-colors duration-200 ${inverse ? 'text-background hover:text-accent-light' : 'text-foreground hover:text-accent'}`;
  const icon = inverse ? 'text-accent-light' : 'text-accent';

  return (
    <ul className="flex flex-col text-base">
      <li>
        <a href={`mailto:${contact.email}`} className={link}>
          <MailIcon size={18} className={icon} />
          {contact.email}
        </a>
      </li>
      <li>
        <a href={contact.phoneHref} className={link}>
          <PhoneIcon size={18} className={icon} />
          {contact.phone}
        </a>
      </li>
    </ul>
  );
}
