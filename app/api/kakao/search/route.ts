import axios from 'axios';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const isbn = req.nextUrl.searchParams.get('isbn');

  try {
    const book = await axios.get('https://dapi.kakao.com/v3/search/book', {
      headers: {
        Authorization: `KakaoAK ${process.env.KAKAO_REST_API_KEY}`,
      },
      params: {
        query: isbn,
      },
    });
    return NextResponse.json({
      book: book.data.documents ?? [],
    });
  } catch (error) {
    console.log('[BOOKS_GET]', process.env.KAKAO_REST_API_KEY, error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
