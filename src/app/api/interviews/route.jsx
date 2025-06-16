import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getZoomToken } from '@/utils/zoomAuth';
import Interview from '@/models/interview';
import Application from '@/models/application';
import JobPost from '@/models/jobpost';
import connectDB from '@/utils/db';
import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request) {
  await connectDB();
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const {
      jobId,
      recruiterId,
      candidateIds,
      startTime,
      duration,
      interviewers,
      notes,
      stage,
      location,
      address
    } = body;

    // Validate required fields
    const requiredFields = [
      'jobId', 'recruiterId', 'candidateIds', 'startTime', 
      'duration', 'interviewers', 'location'
    ];
    
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Additional validation for location-specific fields
    if (location !== 'zoom' && !address) {
      return NextResponse.json(
        { error: 'Address is required for in-office or onsite interviews' },
        { status: 400 }
      );
    }

    let zoomMeetingData = {};
    if (location === 'zoom') {
      // Get Zoom token
      const token = await getZoomToken();

      // Create Zoom meeting
      const zoomResponse = await axios.post(
        'https://api.zoom.us/v2/users/me/meetings',
        {
          topic: `Interview for Job ${jobId}`,
          type: 2, // Scheduled meeting
          start_time: new Date(startTime).toISOString(),
          duration,
          timezone: 'UTC',
          settings: {
            waiting_room: true,
            join_before_host: false,
            participant_video: true,
          },
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      zoomMeetingData = {
        zoomMeetingId: zoomResponse.data.id,
        joinUrl: zoomResponse.data.join_url,
        startUrl: zoomResponse.data.start_url
      };
    }

    // Save to database
    const interview = await Interview.create({
      ...zoomMeetingData,
      jobId,
      recruiterId,
      candidateIds,
      interviewers: interviewers.map(int => ({
        name: int.name,
        email: int.email.toLowerCase()
      })),
      startTime: new Date(startTime),
      duration,
      status: 'scheduled',
      location,
      address: location !== 'zoom' ? address : undefined,
      stage: stage || 'Technical',
      notes
    });

    // Update candidate statuses
    await Application.updateMany(
      { candidateId: { $in: candidateIds }, jobId },
      { 
        status: 'Interview',
        interviewId: interview._id,
        interviewStage: stage || 'Technical',
        ...(location === 'zoom' ? { zoomLink: interview.joinUrl } : { interviewLocation: address })
      }
    );

    return NextResponse.json(interview, { status: 201 });

  } catch (error) {
    console.error('Interview scheduling error:', error);

    if (axios.isAxiosError(error)) {
      return NextResponse.json(
        { error: 'Zoom API error', details: error.response?.data },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to schedule interview', details: error.message },
      { status: 500 }
    );
  }
}


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
    const userId = session.user.id; // Get user ID from session
    const userRole = session.user.role; // Assuming role is stored in session

    let query = {};
    
    if (userRole === 'recruiter') {
      // For recruiters, find interviews where they are listed as interviewers
      query['recruiterId'] = userId;
    } else if (userRole === 'candidate') {
      // For candidates, find interviews where they are listed as candidates
      query.candidateIds = userId;
    } else {
      return NextResponse.json(
        { message: 'Invalid user role' },
        { status: 400 }
      );
    }

    console.log(query)

    const interviews = await Interview.find(query)
      .populate({
        path: 'jobDetails',
        select: 'jobTitle' // Only populate necessary fields
      })
      .populate({
        path: 'candidates',
        select: 'firstName lastName email' // Only populate necessary fields
      })
      .populate({
        path: 'recruiterId',
        select: 'name email' // Only populate necessary fields
      })
      .sort({ startTime: 1 });

    return NextResponse.json(interviews);
  } catch (error) {
    console.error('Error fetching interviews:', error);
    return NextResponse.json(
      { message: 'Server error', error: error.message },
      { status: 500 }
    );
  }
}