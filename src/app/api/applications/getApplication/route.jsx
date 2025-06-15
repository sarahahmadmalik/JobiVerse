import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import connectDB from '@/utils/db';
import Application from '@/models/application';
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
    const { searchParams } = new URL(request.url);
    const applicationId = searchParams.get('applicationId');
    
    if (!applicationId) {
      return NextResponse.json(
        { message: 'applicationId parameter is required' },
        { status: 400 }
      );
    }

    const application = await Application.findOne({ 
      _id: applicationId,
      candidateId: session.user.id // Ensure user can only access their own applications
    })
    .populate({
      path: 'jobDetails',
      populate: {
        path: 'recruiterInfo',
        select: 'companyName companyLogo',
        populate: {
          path: 'company',
          select: 'name logo'
        }
      }
    })
    .populate({
      path: 'documents.resume',
      select: 'fileName resumeLink'
    });

    if (!application) {
      return NextResponse.json(
        { message: 'Application not found or unauthorized' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: application
    });
  } catch (error) {
    console.error('Error fetching application:', error);
    return NextResponse.json(
      { message: 'Server error', error: error.message },
      { status: 500 }
    );
  }
}