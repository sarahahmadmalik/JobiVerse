import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import connectDB from '@/utils/db';
import Recruiter from '@/models/recruiter';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET(request) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    return NextResponse.json(
      { message: 'Unauthorized' },
      { status: 401 }
    );
  }

  await connectDB();

  try {
    const recruiter = await Recruiter.findOne({ authId: session.user.id });
    
    if (!recruiter) {
      return NextResponse.json(
        { message: 'Recruiter not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      imageUrl: recruiter.company?.logo || null,
      name: recruiter.company?.name || null
    });
  } catch (error) {
    console.error('Error fetching recruiter profile:', error);
    return NextResponse.json(
      { message: 'Server error' },
      { status: 500 }
    );
  }
}