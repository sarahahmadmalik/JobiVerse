import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import connectDB from '@/utils/db';
import Application from '@/models/application';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

// Create a new application
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
    const { jobId, candidateId, documents } = await request.json();

    // Verify the candidateId matches the logged-in user
    if (candidateId !== session.user.id) {
      return NextResponse.json(
        { message: 'Unauthorized - Candidate ID mismatch' },
        { status: 403 }
      );
    }

    // Check if application already exists
    const existingApplication = await Application.findOne({ jobId, candidateId });
    if (existingApplication) {
      return NextResponse.json(
        { message: 'You have already applied for this job' },
        { status: 400 }
      );
    }

    // Create new application
    const newApplication = new Application({
      jobId,
      candidateId,
      documents,
      status: 'Submitted'
    });

    await newApplication.save();
     await JobPost.findByIdAndUpdate(
      jobId,
      { $push: { applications: newApplication._id } },
      { new: true, session }
    );

    await session.commitTransaction();

    return NextResponse.json({
      success: true,
      data: newApplication
    });
  } catch (error) {
    console.error('Error creating application:', error);
    return NextResponse.json(
      { message: 'Server error', error: error.message },
      { status: 500 }
    );
  }
}

// Get applications (with query params for filtering)
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
    const { searchParams } = new URL(request.url);
    const candidateId = searchParams.get('candidateId');

    // Validate candidateId matches session user
    if (candidateId !== session.user.id) {
      return NextResponse.json(
        { message: 'Unauthorized - Can only view your own applications' },
        { status: 403 }
      );
    }

    // Fetch applications with full population
 const applications = await Application.find({ candidateId })
      .populate({
        path: 'jobDetails',
        populate: {
          path: 'recruiterInfo',
          select: 'companyName companyLogo', // Only get these fields from Recruiter
          populate: {
            path: 'company', // If recruiter has a company reference
            select: 'name logo' // Get these fields from Company
          }
        }
      })
    .populate({
        path: 'documents.resume', // Use the actual path from your schema
        select: 'fileName resumeLink'
      }).sort({ appliedAt: -1 });

    return NextResponse.json({
      success: true,
      count: applications.length,
      data: applications
    });
  } catch (error) {
    console.error('Error fetching applications:', error);
    return NextResponse.json(
      { message: 'Server error', error: error.message },
      { status: 500 }
    );
  }
}