import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Recruiter from "@/models/recruiter";
import connectDB from "@/utils/db";
import { NextResponse } from "next/server";

export async function PUT(request) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    return NextResponse.json(
      { message: 'Unauthorized' },
      { status: 401 }
    );
  }

  await connectDB();

  try {
    const { userId, section, data } = await request.json();

    // Validate user ownership
    if (userId !== session.user.id) {
      return NextResponse.json(
        { message: 'Forbidden' },
        { status: 403 }
      );
    }

    // Validate section
    const validSections = ['company', 'branding', 'contact'];
    if (!validSections.includes(section)) {
      return NextResponse.json(
        { message: 'Invalid section' },
        { status: 400 }
      );
    }

    let updateData = {};

    if (section === 'company') {
      updateData = {
        'company.name': data.name || '',
        'company.industry': data.industry || '',
        'company.size': data.size || '',
        'company.foundedYear': data.founded ? parseInt(data.founded) : null,
        'company.location': data.location || '',
        'company.hqLocation': data.hqLocation || '',
        'company.description': data.description || '',
        'company.website': data.website || '',
        'company.specialties': Array.isArray(data.specialties) 
          ? data.specialties 
          : (data.specialties?.split(',').map(s => s.trim()) || []),
        'company.logo': data.logo || '',
        'company.socialLinks.facebook': data.socialLinks?.facebook || '',
        'company.socialLinks.twitter': data.socialLinks?.twitter || '',
        'company.socialLinks.instagram': data.socialLinks?.instagram || '',
        'company.socialLinks.linkedin': data.socialLinks?.linkedin || ''
      };
    } 
    else if (section === 'branding') {
      updateData = {
        'company.logo': data.logo || '',
        'company.description': data.description || '',
        'company.website': data.website || '',
        'company.socialLinks.linkedin': data.linkedin || '',
        'company.socialLinks.twitter': data.twitter || ''
      };
    } 
    else if (section === 'contact') {
      updateData = {
        'company.contact.hrEmail': data.hrEmail || '',
        'company.contact.generalEmail': data.generalEmail || '',
        'company.contact.address': data.address || '',
        'company.contact.phone': data.phone || ''
      };
    }

    const updatedRecruiter = await Recruiter.findOneAndUpdate(
      { authId: userId },
      { $set: updateData },
      { new: true, upsert: true }
    );

    return NextResponse.json(updatedRecruiter);
  } catch (error) {
    console.error('Error updating recruiter profile:', error);
    return NextResponse.json(
      { message: 'Server error' },
      { status: 500 }
    );
  }
}