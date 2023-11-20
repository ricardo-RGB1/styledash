import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';

import prismadb from '@/lib/prismadb';

/**
 * Handles the POST request for creating a new store.
 * @param req - The request object.
 * @returns A NextResponse object with the created store data or an error response.
 */
export async function POST(
  req: Request,
) {
  try {
    const { userId } = auth();
    const body = await req.json(); // Parses the request body as JSON

    const { name } = body; // Destructures the name from the request body

    if (!userId) { // Checks if the user is authenticated
      return new NextResponse("Unauthorized", { status: 403 });
    }

    if (!name) { // Checks if the name is provided
      return new NextResponse("Name is required", { status: 400 }); 
    }


    const store = await prismadb.store.create({
      data: { 
        name,
        userId,
      }
    }); // Creates a new store using the prismadb library
  
    return NextResponse.json(store);
  } catch (error) {
    console.log('[STORES_POST]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
}; 