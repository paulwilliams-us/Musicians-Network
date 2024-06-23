import * as icon from '@mdi/js';
import { MenuAsideItem } from './interfaces';

const menuAside: MenuAsideItem[] = [
  {
    href: '/dashboard',
    icon: icon.mdiViewDashboardOutline,
    label: 'Dashboard',
  },

  {
    href: '/users/users-list',
    label: 'Users',
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    icon: icon.mdiAccountGroup ? icon.mdiAccountGroup : icon.mdiTable,
    permissions: 'READ_USERS',
  },
  {
    href: '/agents/agents-list',
    label: 'Agents',
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    icon: icon.mdiAccountTie ? icon.mdiAccountTie : icon.mdiTable,
    permissions: 'READ_AGENTS',
  },
  {
    href: '/applications/applications-list',
    label: 'Applications',
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    icon: icon.mdiFileDocument ? icon.mdiFileDocument : icon.mdiTable,
    permissions: 'READ_APPLICATIONS',
  },
  {
    href: '/availability/availability-list',
    label: 'Availability',
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    icon: icon.mdiCalendarClock ? icon.mdiCalendarClock : icon.mdiTable,
    permissions: 'READ_AVAILABILITY',
  },
  {
    href: '/event_organizers/event_organizers-list',
    label: 'Event organizers',
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    icon: icon.mdiCalendar ? icon.mdiCalendar : icon.mdiTable,
    permissions: 'READ_EVENT_ORGANIZERS',
  },
  {
    href: '/events/events-list',
    label: 'Events',
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    icon: icon.mdiCalendarCheck ? icon.mdiCalendarCheck : icon.mdiTable,
    permissions: 'READ_EVENTS',
  },
  {
    href: '/jobs/jobs-list',
    label: 'Jobs',
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    icon: icon.mdiBriefcase ? icon.mdiBriefcase : icon.mdiTable,
    permissions: 'READ_JOBS',
  },
  {
    href: '/musicians/musicians-list',
    label: 'Musicians',
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    icon: icon.mdiGuitarAcoustic ? icon.mdiGuitarAcoustic : icon.mdiTable,
    permissions: 'READ_MUSICIANS',
  },
  {
    href: '/rsvps/rsvps-list',
    label: 'Rsvps',
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    icon: icon.mdiAccountCheck ? icon.mdiAccountCheck : icon.mdiTable,
    permissions: 'READ_RSVPS',
  },
  {
    href: '/venues/venues-list',
    label: 'Venues',
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    icon: icon.mdiHomeCity ? icon.mdiHomeCity : icon.mdiTable,
    permissions: 'READ_VENUES',
  },
  {
    href: '/roles/roles-list',
    label: 'Roles',
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    icon: icon.mdiShieldAccountVariantOutline
      ? icon.mdiShieldAccountVariantOutline
      : icon.mdiTable,
    permissions: 'READ_ROLES',
  },
  {
    href: '/permissions/permissions-list',
    label: 'Permissions',
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    icon: icon.mdiShieldAccountOutline
      ? icon.mdiShieldAccountOutline
      : icon.mdiTable,
    permissions: 'READ_PERMISSIONS',
  },
  {
    href: '/profile',
    label: 'Profile',
    icon: icon.mdiAccountCircle,
  },
  {
    href: '/api-docs',
    target: '_blank',
    label: 'Swagger API',
    icon: icon.mdiFileCode,
    permissions: 'READ_API_DOCS',
  },
];

export default menuAside;
