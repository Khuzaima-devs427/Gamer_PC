// app/page.tsx - Home Page with Server-Side Redirect
import { redirect } from 'next/navigation';

export default function HomePage() {
  redirect('/Gamer_PC');
  return null;
}