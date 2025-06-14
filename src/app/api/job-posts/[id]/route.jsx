import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import connectDB from '@/utils/db';
import JobPost from '@/models/jobpost';
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
    const jobPost = await JobPost.findById(params.id)
      .populate('recruiterId')
      .populate('applications');

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
    const updatedJobPost = await JobPost.findByIdAndUpdate(
      params.id,
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
    await Recruiter.updateOne(
      { jobPosts: params.id },
      { $pull: { jobPosts: params.id } }
    );

    const deletedJobPost = await JobPost.findByIdAndDelete(params.id);

    if (!deletedJobPost) {
      return NextResponse.json(
        { message: 'Job post not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: 'Job post deleted successfully' }
    );
  } catch (error) {
    console.error('Error deleting job post:', error);
    return NextResponse.json(
      { message: 'Server error', error: error.message },
      { status: 500 }
    );
  }
}