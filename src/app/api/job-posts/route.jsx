import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import connectDB from '@/utils/db';
import JobPost from '@/models/jobpost';
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

    const jobPosts = await JobPost.find({ recruiterId: recruiter._id })
      .sort({ postedAt: -1 })
      .populate('recruiterInfo')
      // .populate('applications');

    return NextResponse.json(jobPosts);
  } catch (error) {
    console.error('Error fetching job posts:', error);
    return NextResponse.json(
      { message: 'Server error' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
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

    const jobData = await request.json();
    const newJobPost = new JobPost({
      ...jobData,
      recruiterId: recruiter._id
    });

    const savedJobPost = await newJobPost.save();
    
    // Update recruiter's jobPosts array
    await Recruiter.findByIdAndUpdate(
      recruiter._id,
      { $push: { jobPosts: savedJobPost._id } }
    );

    return NextResponse.json(savedJobPost, { status: 201 });
  } catch (error) {
    console.error('Error creating job post:', error);
    return NextResponse.json(
      { message: 'Server error', error: error.message },
      { status: 500 }
    );
  }
}
