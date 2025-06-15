import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectDB from '@/utils/db';
import Resume from '@/models/resume';
import Candidate from '@/models/candidate';

export async function GET(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { resumeId } = params;
    console.log(resumeId)

    await connectDB();

    // Verify the user is accessing their own resume
    const candidate = await Candidate.findOne({ authId: session.user.id });
    if (!candidate) {
      return NextResponse.json(
        { message: 'Forbidden' },
        { status: 403 }
      );
    }

    // Find the resume by ID and verify ownership
    const resume = await Resume.findOne({
      _id: resumeId,
      candidateId: session.user.id
    });

    if (!resume) {
      return NextResponse.json(
        { message: 'Resume not found or not owned by user' },
        { status: 404 }
      );
    }

    return NextResponse.json(resume);
  } catch (error) {
    console.error('Error fetching resume:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}