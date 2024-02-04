export const dynamic = 'force-dynamic';

import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const email = req.nextUrl.searchParams.get('email');
    const name = req.nextUrl.searchParams.get('name');

    if (!email) {
      return new NextResponse('email missing', { status: 400 });
    }

    if (!name) {
      return new NextResponse('name missing', { status: 400 });
    }

    const account = await db.account.findFirst({
      where: {
        email,
        name,
      },
    });

    if (!account) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    return NextResponse.json({
      account,
    });
  } catch (error) {
    console.log('[ACCOUNTS_GET]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
