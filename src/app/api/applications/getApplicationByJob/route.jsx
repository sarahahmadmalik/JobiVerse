import { NextResponse } from 'next/server';
import Application from '@/models/application';
import Auth from '@/models/auth';
import Candidate from '@/models/candidate';
import Resume from '@/models/resume';
import connectDB from '@/utils/db';

export const GET = async (request) => {
  try {
    await connectDB();
    
    // Get jobId from query parameters
    const { searchParams } = new URL(request.url);
    const jobId = searchParams.get('jobId');
    
    if (!jobId) {
      return NextResponse.json(
        { error: 'Job ID is required' },
        { status: 400 }
      );
    }

    // 1. Find all applications for this job
    const applications = await Application.find({ jobId })
      .populate('documents.resume', 'fileName resumeLink')
      .lean();

    // 2. Get unique candidateIds (authIds)
    const authIds = [...new Set(applications.map(app => app.candidateId))];

    // 3. Fetch auth emails and candidate names
    const authWithCandidates = await Auth.aggregate([
      { $match: { _id: { $in: authIds } } },
      {
        $lookup: {
          from: "candidates",
          localField: "_id",
          foreignField: "authId",
          as: "candidate"
        }
      },
      { $unwind: "$candidate" },
      {
        $project: {
          _id: 1,
          email: 1,
          name: { $concat: ["$candidate.firstName", " ", "$candidate.lastName"] }
        }
      }
    ]);

    // 4. Create authId → candidate details map
    const authMap = {};
    authWithCandidates.forEach(auth => {
      authMap[auth._id.toString()] = {
        email: auth.email,
        name: auth.name
      };
    });

    // 5. Enrich applications with candidate details
    const enrichedApplications = applications.map(app => ({
      ...app,
      candidateDetails: authMap[app.candidateId.toString()] || null
    }));

    return NextResponse.json(enrichedApplications);
  } catch (error) {
    console.error('Error fetching applications:', error);
    return NextResponse.json(
      { error: 'Failed to fetch applications' },
      { status: 500 }
    );
  }
};