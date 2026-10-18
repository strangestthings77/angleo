import { MailIcon, PhoneIcon } from '@/components/ui/Icon';
import { site } from '@/content/site';

export function ContactDetails() {
  const { contact } = site;
  return (
    <ul className="flex flex-col gap-2 text-base/7 text-foreground-muted">
      <li>
        <a
          href={`mailto:${contact.email}`}
          className="inline-flex items-center gap-3 hover:text-foreground"
        >
          <MailIcon className="text-foreground" />
          {contact.email}
        </a>
      </li>
      <li>
        <a
          href={contact.phoneHref}
          className="inline-flex items-center gap-3 hover:text-foreground"
        >
          <PhoneIcon className="text-foreground" />
          {contact.phone}
        </a>
      </li>
    </ul>
  );
}
