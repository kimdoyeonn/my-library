import { db } from '@/lib/db';
import { Book as BookType } from '@prisma/client';
import axios from 'axios';
import Image from 'next/image';

const Book = ({ book }: { book: BookType }) => {
  return (
    <div className='relative overflow-hidden flex items-center flex-col gap-2'>
      <Image
        src={book.imageUrl ?? ''}
        alt={book.title}
        width={200}
        height={100}
        className='-z-10 aspect-book'
      />
      <div className='w-full'>
        <div className='font-semibold text-base'>{book.title}</div>
        <div className='text-xs'>By {book.author}</div>
      </div>
    </div>
  );
};

const BookList = async () => {
  const books = await db.book.findMany();

  return (
    <div className='grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 col-span-4 gap-4'>
      {books.map((book, idx) => (
        <Book key={idx} book={book} />
      ))}
    </div>
  );
};

export default BookList;
