import { redirect } from 'next/navigation';
import hubConfig from '../../hub-master-config.json';

export default function Home() {
  const defaultLang = (hubConfig?.project_metadata?.primary_language as string) || 'en';
  // Server-side redirect to the default locale route
  redirect(`/${defaultLang}`);
}
