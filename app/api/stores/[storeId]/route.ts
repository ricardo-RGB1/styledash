import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";

import prismadb from "@/lib/prismadb";


/**
 * Updates a store with the specified storeId.
 * 
 * @param req - The request object.
 * @param params - The parameters object containing the storeId.
 * @returns A promise that resolves to the updated store.
 */
export async function PATCH( 
  req: Request, // the incoming HTTP request object
  { params }: { params: { storeId: string } }
) {
  try {
    const { userId } = auth();
    const body = await req.json(); // get the request body

    const { name } = body; 

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }

    if (!params.storeId) {
      return new NextResponse("Store id is required", { status: 400 });
    }


    /**
     * Updates the store with the specified storeId and userId.
     * 
     * @param {string} params.storeId - The ID of the store to update.
     * @param {string} userId - The ID of the user who owns the store.
     * @param {string} name - The new name for the store.
     * @returns {Promise<Store>} - A promise that resolves to the updated store.
     */
    const store = await prismadb.store.updateMany({ 
      where: {
        id: params.storeId,
        userId,
      },
      data: {
        name
      }
    });
  
    return NextResponse.json(store); // return the updated store
  } catch (error) { 
    console.log('[STORE_PATCH]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};


/**
 * Deletes a store.
 * 
 * @param req - The request object.
 * @param params - The parameters object containing the storeId.
 * @returns A NextResponse object with the deleted store data.
 */
export async function DELETE(
  req: Request, 
  { params }: { params: { storeId: string } } 
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    if (!params.storeId) {
      return new NextResponse("Store id is required", { status: 400 });
    }

    /**
     * Deletes a store from the database.
     *
     * @param store - The store object to be deleted.
     * @returns A promise that resolves to the deleted store.
     */
    const store = await prismadb.store.deleteMany({
      where: {
        id: params.storeId, // delete the store with the specified storeId
        userId
      }
    });
  
    return NextResponse.json(store); // return the deleted store
  } catch (error) {
    console.log('[STORE_DELETE]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};




