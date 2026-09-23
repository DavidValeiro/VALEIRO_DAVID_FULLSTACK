import {NextResponse} from 'next/server';

export async function GET(request) {
    return NextResponse.json({number: Math.floor(Math.random() * 100)});
}