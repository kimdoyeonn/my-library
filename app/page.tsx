import Image from 'next/image';
import Data from '@/data/books.json';

export default function Home() {
  return (
    <main className='flex min-h-screen flex-col items-center px-6 lg:px-24'>
      <nav className='w-full pt-4 lg:pt-12'>
        <div className='text-2xl font-bold'>내 도서관</div>
      </nav>
      <div className='grid grid-cols-4 col-span-4 gap-2'>
        {Data.books.map((book, idx) => (
          <div
            key={idx}
            className='relative overflow-hidden h-72 flex justify-center'
          >
            <Image
              src={book.image_url}
              alt={book.title}
              width={200}
              height={100}
              className='absolute -z-10 opacity-80'
            />
            <div className='h-20 m-2 w-full'>{book.title}</div>
          </div>
        ))}
      </div>
    </main>
  );
}
