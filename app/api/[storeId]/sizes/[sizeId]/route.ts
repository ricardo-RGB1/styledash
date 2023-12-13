import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";

import prismadb from "@/lib/prismadb";

/**
 * Retrieves the size with the specified sizeId.
 * @param req - The request object.
 * @param params - The parameters object containing the sizeId.
 * @returns A NextResponse object with the size data or an error response.
 */
export async function GET(
  req: Request,
  { params }: { params: { sizeId: string } }
) {
  try {
    if (!params.sizeId) {
      return new NextResponse("Size id is required", { status: 400 });
    }

    const size = await prismadb.size.findUnique({
      where: {
        id: params.sizeId,
      },
    });

    return NextResponse.json(size);
  } catch (error) {
    console.log("[SIZE_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

/**
 * Updates the size information for a specific store.
 * 
 * @param req - The incoming HTTP request object.
 * @param params - The parameters object containing the storeId and sizeId.
 * @returns A JSON response containing the updated size information.
 */
export async function PATCH(
  req: Request, // the incoming HTTP request object
  { params }: { params: { storeId: string; sizeId: string } } // the parameters object containing the storeId and sizeId
) {
  try {
    const { userId } = auth();
    const body = await req.json(); // get the request body

    const { name, value } = body;

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }
    if (!value) {
      return new NextResponse("Value is required", { status: 400 });
    }

    if (!params.sizeId) {
      return new NextResponse("Size id is required", { status: 400 });
    }

    // Check if the store id exists for the current user and store the result in a variable called storeBelongsToUser
    const storeBelongsToUser = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    });

    if (!storeBelongsToUser) {
      // Checks if the store id belongs to the current user
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const size = await prismadb.size.updateMany({
      where: {
        id: params.sizeId,
      },
      data: {
        name,
        value,
      },
    });

    return NextResponse.json(size); // return the updated size
  } catch (error) {
    console.log("[SIZE_PATCH]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}


/**
 * Deletes a size from a store.
 * 
 * @param req - The request object.
 * @param params - The parameters object containing the storeId and sizeId.
 * @returns A JSON response containing the deleted size.
 */
export async function DELETE(
  req: Request,
  { params }: { params: { storeId: string; sizeId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!params.sizeId) {
      return new NextResponse("Billboard id is required", { status: 400 });
    }

    // Check if the store id exists for the current user and store the result in a variable called storeBelongsToUser
    const storeBelongsToUser = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    });

    // Checks if the store id belongs to the current user
    if (!storeBelongsToUser) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

   
    const size = await prismadb.size.deleteMany({
      where: {
        id: params.sizeId, // delete the size with the specified sizeId
      },
    });

    return NextResponse.json(size); // return the deleted store
  } catch (error) {
    console.log("[SIZE_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
