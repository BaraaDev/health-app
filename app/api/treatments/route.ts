import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Treatment from '@/lib/models/Treatment';
import Visit from '@/lib/models/Visit';

// Add new treatment
export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    const { visitId, name, description, price, quantity } = await request.json();

    // Validate required fields
    if (!visitId || !name || !price) {
      return NextResponse.json(
        { error: 'All required fields must be provided' },
        { status: 400 }
      );
    }

    // Validate data
    const priceNum = parseFloat(price);
    if (isNaN(priceNum) || priceNum < 0) {
      return NextResponse.json(
        { error: 'Price must be a positive number' },
        { status: 400 }
      );
    }

    const quantityNum = quantity ? parseInt(quantity) : 1;
    if (isNaN(quantityNum) || quantityNum < 1) {
      return NextResponse.json(
        { error: 'Quantity must be a positive number' },
        { status: 400 }
      );
    }

    // Calculate total price
    const totalPrice = priceNum * quantityNum;

    // Check if visit exists
    const visit = await Visit.findById(visitId);
    if (!visit) {
      return NextResponse.json(
        { error: 'Visit not found' },
        { status: 404 }
      );
    }

    // Create treatment
    const treatment = new Treatment({
      visit: visitId,
      name: name.trim(),
      description: description?.trim(),
      price: priceNum,
      quantity: quantityNum,
      totalPrice: totalPrice
    });

    await treatment.save();

    // Update visit total amount
    const treatments = await Treatment.find({ visit: visitId });
    const totalAmount = treatments.reduce((sum, treatment) => sum + treatment.totalPrice, 0);
    
    visit.totalAmount = totalAmount;
    await visit.save();

    return NextResponse.json({
      message: 'Treatment added successfully',
      treatment,
      totalAmount
    });

  } catch (error: any) {
    console.error('Error adding treatment:', error);
    
    // Handle Mongoose validation errors
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map((err: any) => err.message);
      return NextResponse.json(
        { error: 'Invalid data', details: validationErrors },
        { status: 400 }
      );
    }

    // Handle database errors
    if (error.code === 11000) {
      return NextResponse.json(
        { error: 'Treatment already exists' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: 'Server error' },
      { status: 500 }
    );
  }
}

// Get treatments for a specific visit
export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(request.url);
    const visitId = searchParams.get('visitId');

    if (!visitId) {
      return NextResponse.json(
        { error: 'Visit ID is required' },
        { status: 400 }
      );
    }

    // Check if visit exists
    const visit = await Visit.findById(visitId);
    if (!visit) {
      return NextResponse.json(
        { error: 'Visit not found' },
        { status: 404 }
      );
    }

    const treatments = await Treatment.find({ visit: visitId }).sort({ createdAt: -1 });

    return NextResponse.json({ treatments });

  } catch (error: any) {
    console.error('Error fetching treatments:', error);
    return NextResponse.json(
      { error: 'Server error' },
      { status: 500 }
    );
  }
} 