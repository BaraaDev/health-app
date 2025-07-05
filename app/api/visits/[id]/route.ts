import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Visit from '@/lib/models/Visit';

// Update visit
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    
    const { id } = params;
    const { status, symptoms, diagnosis, notes } = await request.json();

    const visit = await Visit.findById(id);
    if (!visit) {
      return NextResponse.json(
        { error: 'Visit not found' },
        { status: 404 }
      );
    }

    // Update data
    if (status) visit.status = status;
    if (symptoms) visit.symptoms = symptoms;
    if (diagnosis) visit.diagnosis = diagnosis;
    if (notes) visit.notes = notes;

    await visit.save();

    // Return updated visit with related data
    const updatedVisit = await Visit.findById(id)
      .populate('patient', 'name email')
      .populate('doctor', 'name email specialization');

    return NextResponse.json({
      message: 'Visit updated successfully',
      visit: updatedVisit
    });

  } catch (error: any) {
    console.error('Error updating visit:', error);
    return NextResponse.json(
      { error: 'Server error' },
      { status: 500 }
    );
  }
}

// Patch visit (for status updates)
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    
    const { id } = params;
    const updateData = await request.json();

    const visit = await Visit.findById(id);
    if (!visit) {
      return NextResponse.json(
        { error: 'Visit not found' },
        { status: 404 }
      );
    }

    // Update only provided fields
    Object.keys(updateData).forEach(key => {
      if (updateData[key] !== undefined) {
        visit[key] = updateData[key];
      }
    });

    await visit.save();

    // Return updated visit with related data
    const updatedVisit = await Visit.findById(id)
      .populate('patient', 'name email')
      .populate('doctor', 'name email specialization');

    return NextResponse.json({
      message: 'Visit updated successfully',
      visit: updatedVisit
    });

  } catch (error: any) {
    console.error('Error updating visit:', error);
    return NextResponse.json(
      { error: 'Server error' },
      { status: 500 }
    );
  }
}

// Get specific visit
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    
    const { id } = params;

    const visit = await Visit.findById(id)
      .populate('patient', 'name email')
      .populate('doctor', 'name email specialization');

    if (!visit) {
      return NextResponse.json(
        { error: 'Visit not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ visit });

  } catch (error: any) {
    console.error('Error fetching visit:', error);
    return NextResponse.json(
      { error: 'Server error' },
      { status: 500 }
    );
  }
} 