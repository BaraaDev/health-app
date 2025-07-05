import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Treatment from '@/lib/models/Treatment';
import Visit from '@/lib/models/Visit';

// Delete treatment
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    
    const { id } = params;

    const treatment = await Treatment.findById(id);
    if (!treatment) {
      return NextResponse.json(
        { error: 'Treatment not found' },
        { status: 404 }
      );
    }

    const visitId = treatment.visit;

    await Treatment.findByIdAndDelete(id);

    // Update visit total amount
    const treatments = await Treatment.find({ visit: visitId });
    const totalAmount = treatments.reduce((sum, treatment) => sum + treatment.totalPrice, 0);
    
    await Visit.findByIdAndUpdate(visitId, { totalAmount });

    return NextResponse.json({
      message: 'Treatment deleted successfully',
      totalAmount
    });

  } catch (error: any) {
    console.error('Error deleting treatment:', error);
    return NextResponse.json(
      { error: 'Server error' },
      { status: 500 }
    );
  }
}

// Update treatment
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    
    const { id } = params;
    const { name, description, price, quantity } = await request.json();

    const treatment = await Treatment.findById(id);
    if (!treatment) {
      return NextResponse.json(
        { error: 'Treatment not found' },
        { status: 404 }
      );
    }

    // Validate data
    if (price !== undefined) {
      const priceNum = parseFloat(price);
      if (isNaN(priceNum) || priceNum < 0) {
        return NextResponse.json(
          { error: 'Price must be a positive number' },
          { status: 400 }
        );
      }
    }

    if (quantity !== undefined) {
      const quantityNum = parseInt(quantity);
      if (isNaN(quantityNum) || quantityNum < 1) {
        return NextResponse.json(
          { error: 'Quantity must be a positive number' },
          { status: 400 }
        );
      }
    }

    // Update data
    const updateData: any = {};
    if (name) updateData.name = name.trim();
    if (description !== undefined) updateData.description = description.trim();
    if (price !== undefined) updateData.price = parseFloat(price);
    if (quantity !== undefined) updateData.quantity = parseInt(quantity);

    // Calculate new total price
    const newPrice = updateData.price !== undefined ? updateData.price : treatment.price;
    const newQuantity = updateData.quantity !== undefined ? updateData.quantity : treatment.quantity;
    updateData.totalPrice = newPrice * newQuantity;

    const updatedTreatment = await Treatment.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    // Update visit total amount
    const treatments = await Treatment.find({ visit: treatment.visit });
    const totalAmount = treatments.reduce((sum, t) => sum + t.totalPrice, 0);
    
    await Visit.findByIdAndUpdate(treatment.visit, { totalAmount });

    return NextResponse.json({
      message: 'Treatment updated successfully',
      treatment: updatedTreatment,
      totalAmount
    });

  } catch (error: any) {
    console.error('Error updating treatment:', error);
    return NextResponse.json(
      { error: 'Server error' },
      { status: 500 }
    );
  }
}

// Get specific treatment
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    
    const { id } = params;

    const treatment = await Treatment.findById(id);
    if (!treatment) {
      return NextResponse.json(
        { error: 'Treatment not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ treatment });

  } catch (error: any) {
    console.error('Error fetching treatment:', error);
    return NextResponse.json(
      { error: 'Server error' },
      { status: 500 }
    );
  }
} 