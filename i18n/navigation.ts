import { createNavigation } from 'next-intl/navigation';
import { routing } from './routing';

// Navigation localisée (Link, redirect, hooks) dérivée du routing verrouillé.
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
