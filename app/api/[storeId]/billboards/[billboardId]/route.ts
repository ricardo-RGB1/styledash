import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";

import prismadb from "@/lib/prismadb";


/**
 * Retrieves a billboard by its ID.
 * @param req - The request object.
 * @param params - The parameters object containing the billboard ID.
 * @returns A JSON response with the billboard data if successful, or an error response if unsuccessful.
 */
export async function GET(
    req: Request,
    { params }: { params: { billboardId: string } }
  ) {
    try {
      if (!params.billboardId) {
        return new NextResponse("Billboard id is required", { status: 400 });
      }
  
      const billboard = await prismadb.billboard.findUnique({
        where: {
          id: params.billboardId
        }
      });
    
      return NextResponse.json(billboard);
    } catch (error) {
      console.log('[BILLBOARD_GET]', error);
      return new NextResponse("Internal error", { status: 500 });
    }
  };


/**
 * Updates a billboard with the specified store ID and billboard ID.
 *
 * @param req - The incoming HTTP request object.
 * @param params - An object containing the store ID and billboard ID.
 * @returns A JSON response containing the updated billboard.
 */
export async function PATCH(
  req: Request, // the incoming HTTP request object
  { params }: { params: { storeId: string; billboardId: string } }
) {
  try {
    const { userId } = auth();
    const body = await req.json(); // get the request body

    const { label, imageUrl } = body;

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!label) {
      return new NextResponse("Label is required", { status: 400 });
    }
    if (!imageUrl) {
      return new NextResponse("Image is required", { status: 400 });
    }

    if (!params.billboardId) {
      return new NextResponse("Billboard id is required", { status: 400 });
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

    const billboard = await prismadb.billboard.updateMany({
      where: {
        id: params.billboardId,
      },
      data: {
        label,
        imageUrl,
      },
    });

    return NextResponse.json(billboard); // return the updated billboard
  } catch (error) {
    console.log("[BILLBOARD_PATCH]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

/**
 * Deletes a store.
 *
 * @param req - The request object.
 * @param params - The parameters object containing the storeId.
 * @returns A NextResponse object with the deleted store data.
 */
export async function DELETE(
  req: Request,
  { params }: { params: { storeId: string; billboardId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!params.billboardId) {
      return new NextResponse("Billboard id is required", { status: 400 });
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

    /**
     * Deletes a billboard from the database.
     *
     * @param billboard - The billboard to be deleted.
     * @returns A promise that resolves to the deleted billboard.
     */
    const billboard = await prismadb.billboard.deleteMany({
      where: {
        id: params.billboardId // delete the billboard with the specified billboardId
      },
    });

    return NextResponse.json(billboard); // return the deleted store
  } catch (error) {
    console.log("[BILLBOARD_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
