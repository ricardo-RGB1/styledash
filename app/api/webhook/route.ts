import Stripe from 'stripe'; 
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';

import { stripe } from '@/lib/stripe';
import prismadb from '@/lib/prismadb';


/**
 * Handles the POST request for the webhook route.
 * 
 * @param req - The request ob ject.
 * @returns A NextResponse object.
 */
export async function POST(req:  Request) {
    // using text() instead of json() to get the raw body of the request because Stripe sends the webhook as a raw body instead of JSON
    const body = await req.text(); 
    // get the Stripe-Signature header from the request headers
    const signature = headers().get("Stripe-Signature") as string; 

    let event: Stripe.Event; // declare an event variable of type Stripe.Event


    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!
        )
    } catch (error: any) {
        return new NextResponse(`Webhook Error: ${error.message}`, {status: 400});
    }

    // get the session object from the event
    const session = event.data.object as Stripe.Checkout.Session; 

    // get the address object from the session object
    const address = session?.customer_details?.address;

    const addressComponents = [
        address?.line1,
        address?.line2,
        address?.postal_code,
        address?.city,
        address?.state,
        address?.country
    ]; 
    
    const addressString = addressComponents.filter(Boolean).join(', '); // filter out any empty strings and join the array into a string


    // if the event type is checkout.session.completed then update the order in the database
    if (event.type === 'checkout.session.completed') { 
        const order = await prismadb.order.update({ 
            where: { 
                id: session?.metadata?.orderId, 
            }, 
            data: {
                isPaid: true,
                address: addressString,
                phone: session?.customer_details?.phone || ''
            }, 
            include: {
                orderItems: true,
            }
        });

        // get the product ids from the order items
        const productIds = order.orderItems.map((orderItem) => orderItem.productId); 

        await prismadb.product.updateMany({
            where: { // update all products where the id is in the productIds array
                id: {
                    in: [...productIds]
                }
            },
            data: {
                isArchived: true
            }
        });
    }

    return new NextResponse(null, {status: 200});
} 