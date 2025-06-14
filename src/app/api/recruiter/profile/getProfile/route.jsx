import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Recruiter from "@/models/recruiter";
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
    const recruiter = await Recruiter.findOne({ authId: session.user.id });
    
    if (!recruiter) {
      return NextResponse.json(
        { message: 'Recruiter not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({

      email: session.user.email || '',
      phone: recruiter.company?.contact?.phone || '',
      avatar: recruiter.company?.logo || '', 
      
      company: {
        name: recruiter.company?.name || '',
        industry: recruiter.company?.industry || '',
        size: recruiter.company?.size || '',
        founded: recruiter.company?.foundedYear?.toString() || '',
        location: recruiter.company?.location || '',
        hqLocation: recruiter.company?.hqLocation || '',
        specialties: recruiter.company?.specialties || [],
        logo: recruiter.company?.logo || '',
        description: recruiter.company?.description || '',
        website: recruiter.company?.website || '',
        socialLinks: recruiter.company?.socialLinks || {
          facebook: '',
          twitter: '',
          instagram: '',
          linkedin: ''
        }
      },
      
      branding: {
        logo: recruiter.company?.logo || '',
        description: recruiter.company?.description || '',
        website: recruiter.company?.website || '',
        linkedin: recruiter.company?.socialLinks?.linkedin || '',
        twitter: recruiter.company?.socialLinks?.twitter || ''
      },
      
      // Contact Info
      contact: {
        primaryEmail: session.user.email || '',
        phone: recruiter.company?.contact?.phone || '',
        address: recruiter.company?.contact?.address || '',
        hrEmail: recruiter.company?.contact?.hrEmail || '',
        generalEmail: recruiter.company?.contact?.generalEmail || ''
      },
      
      isOnboarded: recruiter.isOnboarded || false
    });
  } catch (error) {
    console.error('Error fetching recruiter profile:', error);
    return NextResponse.json(
      { message: 'Server error' },
      { status: 500 }
    );
  }
}