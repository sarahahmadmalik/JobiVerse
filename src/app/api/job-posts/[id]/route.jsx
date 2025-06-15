import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import connectDB from '@/utils/db';
import JobPost from '@/models/jobpost';
import Recruiter from '@/models/recruiter';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET(request, { params }) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    return NextResponse.json(
      { message: 'Unauthorized' },
      { status: 401 }
    );
  }

  await connectDB();

  try {
     const { id } = await params;
    const jobPost = await JobPost.findById(id)
      .populate('recruiterInfo')
      // .populate('applicationDetails');

    if (!jobPost) {
      return NextResponse.json(
        { message: 'Job post not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(jobPost);
  } catch (error) {
    console.error('Error fetching job post:', error);
    return NextResponse.json(
      { message: 'Server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    return NextResponse.json(
      { message: 'Unauthorized' },
      { status: 401 }
    );
  }

  await connectDB();

  try {
    const jobData = await request.json();
    console.log(jobData)
    const { id } = await params;
    const updatedJobPost = await JobPost.findByIdAndUpdate(
      id,
      jobData,
      { new: true }
    );

    if (!updatedJobPost) {
      return NextResponse.json(
        { message: 'Job post not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedJobPost);
  } catch (error) {
    console.error('Error updating job post:', error);
    return NextResponse.json(
      { message: 'Server error', error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    return NextResponse.json(
      { message: 'Unauthorized' },
      { status: 401 }
    );
  }

  await connectDB();

  try {
    // Remove job post reference from recruiter
     const { id } = await params;
    await Recruiter.updateOne(
      { jobPosts: id },
      { $pull: { jobPosts: id } }
    );

    const deletedJobPost = await JobPost.findByIdAndDelete(id);

    if (!deletedJobPost) {
      return NextResponse.json(
        { message: 'Job post not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: 'Job post deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting job post:', error);
    return NextResponse.json(
      { message: 'Server error', error: error.message },
      { status: 500 }
    );
  }
}