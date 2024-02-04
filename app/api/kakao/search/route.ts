import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const isbn = req.nextUrl.searchParams.get('isbn');

  try {
    const res = await fetch(
      `https://dapi.kakao.com/v3/search/book?query=${isbn}`,
      {
        headers: {
          Authorization: `KakaoAK ${process.env.KAKAO_REST_API_KEY}`,
        },
      }
    );
    const book = await res.json();
    return NextResponse.json({
      book: book.documents ?? [],
    });
  } catch (error) {
    console.log('[BOOKS_GET]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
