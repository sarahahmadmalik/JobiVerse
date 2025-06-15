import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import connectDB from '@/utils/db';
import JobPost from '@/models/jobpost';
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

    const jobPosts = await JobPost.find({isOpen: true})
      .sort({ postedAt: -1 })
      .populate('recruiterInfo')
      // .populate('applications');

      console.log(jobPosts)
    return NextResponse.json(jobPosts);
  } catch (error) {
    console.error('Error fetching job posts:', error);
    return NextResponse.json(
      { message: 'Server error' },
      { status: 500 }
    );
  }
}
