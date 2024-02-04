export const revalidate = 10;

import DarkModeToggle from '@/components/dark-mode-toggle';
import BookList from '@/components/book-list';
import AdminSection from '@/components/admin-section';

export default function Home() {
  return (
    <main className='flex min-h-screen flex-col items-center px-6 lg:px-24'>
      <nav className='w-full py-4 lg:pt-12 flex justify-between'>
        <div className='text-2xl font-bold'>내 도서관</div>
        <div className='flex items-center gap-2'>
          <AdminSection />
          <DarkModeToggle />
        </div>
      </nav>
      <BookList />
    </main>
  );
}
