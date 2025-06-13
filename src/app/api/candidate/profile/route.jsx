import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import connectDB from '@/utils/db';
import Candidate from '@/models/candidate';
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
    const candidate = await Candidate.findOne({ authId: session.user.id });
    
    if (!candidate) {
      return NextResponse.json(
        { message: 'Candidate not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      imageUrl: candidate.profilePicture || null,
      name: `${candidate.firstName} ${candidate.lastName}` || null
    });
  } catch (error) {
    console.error('Error fetching candidate profile:', error);
    return NextResponse.json(
      { message: 'Server error' },
      { status: 500 }
    );
  }
}