import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Candidate from "@/models/candidate";
import connectDB from "@/utils/db";
import { NextResponse } from "next/server";

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
    const candidate = await Candidate.findOne({ authId: session.user.id }).lean();
    
    if (!candidate) {
      return NextResponse.json(
        { message: 'Candidate profile not found' },
        { status: 404 }
      );
    }

    // Helper function to format dates and remove empty fields
    const formatDate = (date) => {
      return date ? date.toISOString().split('T')[0] : undefined;
    };

    // // Helper function to clean objects of undefined/null fields
    // const cleanObject = (obj) => {
    //   return Object.fromEntries(
    //     Object.entries(obj)
    //       .filter(([_, v]) => v !== undefined && v !== null && v !== '')
    //       .map(([k, v]) => [k, typeof v === 'object' ? v : v])
    //   );
    // };

    // Build response object
    const responseData = {
      personal: {
        firstName: candidate.firstName,
        lastName: candidate.lastName,
        fullName: candidate.firstName && candidate.lastName 
          ? `${candidate.firstName} ${candidate.lastName}` 
          : undefined,
        email: session.user.email,
        phone: candidate.phone,
        location: candidate.location,
        avatar: session.user.image || candidate.picture
      },
      experience: candidate.experience?.map(exp => ({
        jobTitle: exp.jobTitle,
        companyName: exp.companyName,
        location: exp.location,
        employmentType: exp.employmentType,
        startDate: formatDate(exp.startDate),
        endDate: formatDate(exp.endDate),
        description: exp.description,
        currentlyWorking: exp.endDate ? false : true
      })).filter(exp => Object.keys(exp).length > 0),
      education: candidate.education?.map(edu => ({
        degree: edu.degree,
        fieldOfStudy: edu.fieldOfStudy,
        institution: edu.institution,
        location: edu.location,
        startDate: formatDate(edu.startDate),
        endDate: formatDate(edu.endDate),
        description: edu.description
      })).filter(edu => Object.keys(edu).length > 0),
      skills: candidate.skills?.length ? candidate.skills : undefined,
      socialLinks: {
        linkedin: candidate.socialLinks?.linkedin,
        github: candidate.socialLinks?.github,
        portfolio: candidate.socialLinks?.portfolio,
        dribbble: candidate.socialLinks?.dribbble
      },
      jobPreferences: {
        desiredTitle: candidate.jobPreferences?.desiredTitle,
        preferredLocations: candidate.jobPreferences?.preferredLocations?.length 
          ? candidate.jobPreferences.preferredLocations 
          : undefined,
        industries: candidate.jobPreferences?.industries?.length 
          ? candidate.jobPreferences.industries 
          : undefined,
        salaryExpectation: candidate.jobPreferences?.salaryExpectation,
        employmentTypes: candidate.jobPreferences?.employmentTypes?.length 
          ? candidate.jobPreferences.employmentTypes 
          : undefined
      },
      isOnboarded: candidate.isOnboarded
    };

    return NextResponse.json(responseData);
  } catch (error) {
    console.error('Error fetching candidate profile:', error);
    return NextResponse.json(
      { message: 'Server error' },
      { status: 500 }
    );
  }
}