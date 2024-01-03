import Stripe from 'stripe';

import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe'; 
import prismadb from "@/lib/prismadb";

/**
 * CORS headers for API requests.
 * Required for CORS support to work.
 */
const corseHeaders = {
    "Access-Control-Allow-Origin": "*", // Required for CORS support to work
    "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization"
}; 


/**
 * OPTIONS method for the checkout route.
 * @returns {Promise<NextResponse>} The response object.
 */
export function OPTIONS(): Promise<NextResponse> {
    return Promise.resolve(NextResponse.json({ }, {headers: corseHeaders})); 
}

/**
 * Handles the POST request for the checkout route.
 * 
 * @param req - The request object.
 * @param params - The parameters object containing the storeId.
 * @returns A JSON response containing the session URL for the Stripe Checkout.
 */
export async function POST(
    req: Request,
    {params}: {params: {storeId: string}}
) {
    const { productIds } = await req.json();

    if(!productIds || productIds.length === 0 ) {
        return new NextResponse("Product IDs are required", {status: 400});
    }

    const products = await prismadb.product.findMany({ 
        where: { // find all products where the id is in the productIds array
            id: {
                in: productIds
            }
        }
    });

    // create an empty array of line items
    const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = []; 

    // For each product, add a line item to the array of line items
    products.forEach((product) => { 
        line_items.push({
            quantity: 1,
            price_data: {
                currency: 'USD',
                product_data: {
                    name: product.name,
                },
                unit_amount: product.price.toNumber() * 100,
            }
        });
    })


    // Create a new order in the database
    const order = await prismadb.order.create({ 
        data: {
            storeId: params.storeId,
            isPaid: false,
            orderItems: {
                create: productIds.map((productId: string) => ({
                    product: { // create a new order item for each product
                        connect: { // connect the product to the order item
                            id: productId // connect the product by its id
                        }
                    }
                }))
            }
        }
    })

    // Create a new Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
        line_items,
        mode: 'payment',
        billing_address_collection: 'required',
        phone_number_collection: {
            enabled: true
        },
        success_url: `${process.env.FRONTEND_STORE_URL}/cart?success=1`,
        cancel_url: `${process.env.FRONTEND_STORE_URL}/cart?canceled=1`,
        metadata: {
            orderId: order.id // add the order id from above (or the database) to the Stripe Checkout Session
        }
    });

    return NextResponse.json({url: session.url}, {headers: corseHeaders}); // return the session url to the client

}




// corseHeaders explained:  (Cross-Origin Resource Sharing)
// Here's a breakdown of each property:

// "Access-Control-Allow-Origin": "*": This allows any domain to access the resource. The * means all origins are allowed. In a production environment, you'd typically restrict this to specific domains for security reasons.

// "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS": This specifies the HTTP methods that are allowed when accessing the resource. In this case, GET, POST, PUT, DELETE, and OPTIONS requests are permitted.

// "Access-Control-Allow-Headers": "Content-Type, Authorization": This allows the client to send the specified headers. Here, Content-Type and Authorization headers are allowed.

// These headers are typically used in the response of a preflight request (an OPTIONS request) to indicate which HTTP methods, origins, and headers are allowed in the actual request.