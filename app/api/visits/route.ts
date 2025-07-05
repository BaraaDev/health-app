import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Visit from '@/lib/models/Visit';
import User from '@/lib/models/User';

// Create new visit
export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    const { patientId, doctorId, date } = await request.json();

    // Validate required data
    if (!patientId || !doctorId || !date) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Check if patient and doctor exist
    const [patient, doctor] = await Promise.all([
      User.findById(patientId),
      User.findById(doctorId)
    ]);

    if (!patient || !doctor) {
      return NextResponse.json(
        { error: 'Patient or doctor not found' },
        { status: 404 }
      );
    }

    if (doctor.role !== 'doctor') {
      return NextResponse.json(
        { error: 'Selected user is not a doctor' },
        { status: 400 }
      );
    }

    // Extract time from date string
    const dateObj = new Date(date);
    const timeString = dateObj.toTimeString().split(' ')[0]; // Get HH:MM:SS

    // Check for existing visit at the same time
    const existingVisit = await Visit.findOne({
      doctor: doctorId,
      date: dateObj,
      status: { $in: ['scheduled', 'in-progress'] }
    });

    if (existingVisit) {
      return NextResponse.json(
        { error: 'Doctor has another appointment at this time' },
        { status: 400 }
      );
    }

    // Create visit
    const visit = new Visit({
      patient: patientId,
      doctor: doctorId,
      date: dateObj,
      time: timeString,
      status: 'scheduled'
    });

    await visit.save();

    // Return visit with patient and doctor data
    const populatedVisit = await Visit.findById(visit._id)
      .populate('patient', 'name email')
      .populate('doctor', 'name email specialization');

    return NextResponse.json({
      message: 'Appointment booked successfully',
      visit: populatedVisit
    });

  } catch (error: any) {
    console.error('Error creating visit:', error);
    return NextResponse.json(
      { error: 'Server error' },
      { status: 500 }
    );
  }
}

// Get all visits
export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(request.url);
    const doctorName = searchParams.get('doctorName');
    const patientName = searchParams.get('patientName');
    const visitId = searchParams.get('visitId');
    const status = searchParams.get('status');
    const patientId = searchParams.get('patientId');
    const doctorId = searchParams.get('doctorId');

    let query: any = {};

    // Add search conditions
    if (visitId) {
      query._id = visitId;
    }

    if (status) {
      query.status = status;
    }

    if (patientId) {
      query.patient = patientId;
    }

    // Filter by doctor ID - this ensures doctors only see their own appointments
    if (doctorId) {
      query.doctor = doctorId;
    }

    let visits = await Visit.find(query)
      .populate('patient', 'name email phone')
      .populate('doctor', 'name email specialization')
      .sort({ date: -1 });

    // Filter by doctor or patient name (only if not already filtered by ID)
    if (doctorName && !doctorId) {
      visits = visits.filter(visit => 
        visit.doctor.name.toLowerCase().includes(doctorName.toLowerCase())
      );
    }

    if (patientName) {
      visits = visits.filter(visit => 
        visit.patient.name.toLowerCase().includes(patientName.toLowerCase())
      );
    }

    return NextResponse.json({ visits });

  } catch (error: any) {
    console.error('Error fetching visits:', error);
    return NextResponse.json(
      { error: 'Server error' },
      { status: 500 }
    );
  }
} 