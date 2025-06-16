import { NextResponse } from 'next/server';
import Application from '@/models/application';
import connectDB from '@/utils/db';

export const PATCH = async (request) => {
  try {
    await connectDB();
    
    const { ids, status } = await request.json();

    if (!ids || !ids.length || !status) {
      return NextResponse.json(
        { error: 'Application IDs and status are required' },
        { status: 400 }
      );
    }

    // Validate status
    const validStatuses = ['Submitted', 'Shortlisted', 'Interview', 'Rejected', 'Hired'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status value' },
        { status: 400 }
      );
    }

    // Update all applications
    const result = await Application.updateMany(
      { _id: { $in: ids } },
      { status },
      { new: true }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: 'No applications found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      updatedCount: result.modifiedCount
    });
  } catch (error) {
    console.error('Error updating applications status:', error);
    return NextResponse.json(
      { error: 'Failed to update applications status' },
      { status: 500 }
    );
  }
};