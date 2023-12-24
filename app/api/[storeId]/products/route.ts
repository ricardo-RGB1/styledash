import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";

import prismadb from "@/lib/prismadb";

/**
 * Creates a new product in the database.
 *
 * @param req - The request object.
 * @param params - The parameters object containing the storeId.
 * @returns A JSON response with the created product.
 * @throws If there is an error during the creation process.
 */
export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const { userId } = auth();
    const body = await req.json(); // Parses the request body as JSON

    const {
      name,
      price,
      categoryId,
      colorId,
      sizeId,
      images,
      isFeatured,
      isArchived,
    } = body;

    // Loop through the body object and check if the values are empty
    for (let [key, value] of Object.entries(body)) {
      if (key !== "isArchived" && key !== "isFeatured" && !value) {
        return new NextResponse(
          `${key.charAt(0).toUpperCase() + key.slice(1)} is required`,
          { status: 400 }
        );
      }
    }

    if (!userId) {
      // Checks if the user is authenticated
      return new NextResponse("Unathenticated", { status: 401 });
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

    // Creates a new product in the database
    const product = await prismadb.product.create({
      data: {
        name,
        price,
        isFeatured,
        isArchived,
        categoryId,
        colorId,
        sizeId,
        storeId: params.storeId,
        images: {
          createMany: {
            // Creates many images
            data: [
              // The data to be created
              ...images.map((image: { url: string }) => image), // Maps through the images array and returns the url
            ],
          },
        },
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.log("[PRODUCTS_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const { searchParams } = new URL(req.url);
    const categoryId = searchParams.get("categoryId") || undefined;
    const colorId = searchParams.get("colorId") || undefined;
    const sizeId = searchParams.get("sizeId") || undefined;
    const isFeatured = searchParams.get("isFeatured");

    if (!params.storeId) {
      return new NextResponse("Store id is required", { status: 400 });
    }

    const products = await prismadb.product.findMany({
      where: {
        storeId: params.storeId,
        categoryId,
        colorId,
        sizeId,
        isFeatured: isFeatured ? true : undefined,
        isArchived: false,
      },
      include: {
        images: true,
        category: true,
        color: true,
        size: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(products);
  } catch (error) {
    console.log("[PRODUCTS_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
