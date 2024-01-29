import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const books = await db.book.findMany();
    return NextResponse.json({
      books,
    });
  } catch (error) {
    console.log('[BOOKS_GET]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { title, author, imageUrl, publisher } = await req.json();

    if (!title) {
      return new NextResponse('Book title missing', { status: 400 });
    }

    const book = await db.book.create({
      data: {
        title,
        author,
        imageUrl,
        publisher,
      },
    });

    return NextResponse.json(book);
  } catch (error) {
    console.log('[BOOKS_POST]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
