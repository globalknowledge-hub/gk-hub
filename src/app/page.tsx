import { redirect } from 'next/navigation';

export default function Home() {
  // Use primary language 'en' as default. Avoid importing JSON during build.
  redirect('/en');
}
