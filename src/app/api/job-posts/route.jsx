import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import connectDB from '@/utils/db'
import JobPost from '@/models/jobpost'
import Recruiter from '@/models/recruiter'
import Application from '@/models/application'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

export async function GET (request) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  await connectDB()

  try {
    const recruiter = await Recruiter.findOne({ authId: session.user.id })

    if (!recruiter) {
      return NextResponse.json(
        { message: 'Recruiter not found' },
        { status: 404 }
      )
    }

     // 2. Get all job posts for this recruiter
    const jobPosts = await JobPost.find({ recruiterId: recruiter._id })
      .sort({ postedAt: -1 })
      .populate('recruiterInfo')
      .lean();

    // 3. Get all job post IDs
    const jobPostIds = jobPosts.map(job => job._id);

    // 4. Find all applications for these job posts
    const applications = await Application.find({
      jobId: { $in: jobPostIds }
    })
    .populate('candidateDetails', 'name email')
    // .populate('documents.resume', 'fileName resumeLink')
    .lean();

    // 5. Group applications by jobId
    const applicationsByJobId = applications.reduce((acc, application) => {
      const jobId = application.jobId.toString();
      acc[jobId] = acc[jobId] || [];
      acc[jobId].push(application);
      return acc;
    }, {});

    // 6. Combine job posts with their applications
    const jobPostsWithApplications = jobPosts.map(jobPost => ({
      ...jobPost,
      applications: applicationsByJobId[jobPost._id.toString()] || []
    }));

    return NextResponse.json(jobPostsWithApplications);
  } catch (error) {
    console.error('Error fetching job posts:', error)
    return NextResponse.json({ message: 'Server error' }, { status: 500 })
  }
}

export async function POST (request) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  await connectDB()

  try {
    const recruiter = await Recruiter.findOne({ authId: session.user.id })

    if (!recruiter) {
      return NextResponse.json(
        { message: 'Recruiter not found' },
        { status: 404 }
      )
    }

    const jobData = await request.json()
    const newJobPost = new JobPost({
      ...jobData,
      recruiterId: recruiter._id
    })

    const savedJobPost = await newJobPost.save()

    // Update recruiter's jobPosts array
    await Recruiter.findByIdAndUpdate(recruiter._id, {
      $push: { jobPosts: savedJobPost._id }
    })

    return NextResponse.json(savedJobPost, { status: 201 })
  } catch (error) {
    console.error('Error creating job post:', error)
    return NextResponse.json(
      { message: 'Server error', error: error.message },
      { status: 500 }
    )
  }
}
