// app/api/candidate/profile/putProfile/route.js
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectDB from '@/utils/db';
import Candidate from '@/models/candidate';

export async function PUT(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { userId, section, data } = await request.json();

    // Verify the user is updating their own profile
    if (userId !== session.user.id) {
      return NextResponse.json(
        { message: 'Forbidden' },
        { status: 403 }
      );
    }

    await connectDB();

    let update = {};
    const now = new Date();

    console.log(data)

    switch (section) {
      case 'personal':
        update = {
          firstName: data.firstName || '',
          lastName: data.lastName || '',
          phone: data.phone || '',
          location: data.location || '',
          updatedAt: now
        };
        break;

      case 'education':
        update = {
          education: data.map(edu => ({
            institution: edu.institution || '',
            degree: edu.degree || '',
            fieldOfStudy: edu.fieldOfStudy || '',
            location: edu.location || '',
            startDate: edu.startDate ? new Date(edu.startDate) : null,
            endDate: edu.endDate ? new Date(edu.endDate) : null,
            description: edu.description || ''
          })),
          updatedAt: now
        };
        break;

      case 'experience':
        update = {
          experience: data.map(exp => ({
            jobTitle: exp.jobTitle || '',
            companyName: exp.companyName || '',
            location: exp.location || '',
            employmentType: exp.employmentType || '',
            startDate: exp.startDate ? new Date(exp.startDate) : null,
            endDate: exp.endDate ? new Date(exp.endDate) : null,
            description: exp.description || ''
          })),
          updatedAt: now
        };
        break;

      case 'skills':
        update = {
          skills: data || [],
          updatedAt: now
        };
        break;

      case 'portfolioLinks':
        update = {
          socialLinks: {
            linkedin: data.linkedin || '',
            github: data.github || '',
            dribbble: data.dribbble || '',
            portfolio: data.portfolio || ''
          },
          updatedAt: now
        };
        break;

      case 'jobPreferences':
        update = {
          jobPreferences: {
            desiredTitle: data.desiredTitle || '',
            preferredLocations: data.preferredLocations || [],
            salaryExpectation: data.desiredSalary 
              ? parseInt(data.desiredSalary.replace(/\D/g, '')) 
              : null,
            employmentTypes: data.employmentTypes || [],
            industries: data.industries || []
          },
          updatedAt: now
        };
        break;

      default:
        return NextResponse.json(
          { message: 'Invalid section' },
          { status: 400 }
        );
    }

    const updatedCandidate = await Candidate.findOneAndUpdate(
      { authId: userId },
      { $set: update },
      { new: true, runValidators: true }
    );

    if (!updatedCandidate) {
      return NextResponse.json(
        { message: 'Candidate profile not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedCandidate);
  } catch (error) {
    console.error('Error updating candidate profile:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
