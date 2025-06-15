import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectDB from '@/utils/db';
import Resume from '@/models/resume';
import Candidate from '@/models/candidate';

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { resumeId, jobId, jobTitle, resumeLink, content, fileName } = await request.json();
    console.log(resumeId, jobId, jobTitle, resumeLink, content)

    // Verify the user is saving their own resume
    const candidate = await Candidate.findOne({ authId: session.user.id });
    if (!candidate) {
      return NextResponse.json(
        { message: 'Forbidden' },
        { status: 403 }
      );
    }

    await connectDB();


    let resume;
    
    if (resumeId) {
      // Update existing resume
      resume = await Resume.findOneAndUpdate(
        { _id: resumeId, candidateId: session.user.id },
        {
          jobId,
          resumeLink,
          fileName,
          fileType: 'pdf',
          content
        },
        { new: true }
      );

      if (!resume) {
        return NextResponse.json(
          { message: 'Resume not found or not owned by user' },
          { status: 404 }
        );
      }
    } else {
      // Create new resume
      resume = new Resume({
        candidateId: session.user.id,
        jobId,
        resumeLink,
        fileName,
        content,
        fileType: 'pdf'
      });

      await resume.save();
    }

    return NextResponse.json(resume);
  } catch (error) {
    console.error('Error saving/updating resume:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();

    // Get candidate ID
    const candidate = await Candidate.findOne({ authId: session.user.id });
    if (!candidate) {
      return NextResponse.json(
        { message: 'Candidate profile not found' },
        { status: 404 }
      );
    }

    // Get all resumes for this candidate
    const resumes = await Resume.find({ candidateId: candidate._id });
    // console.log(resumes)
    return NextResponse.json(resumes);
  } catch (error) {
    console.error('Error fetching resumes:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}