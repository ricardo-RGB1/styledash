import Stripe from 'stripe';

/**
 * The Stripe instance used for making API requests.
 * @remarks
 * This instance is initialized with the provided Stripe secret key and options.
 * @see {@link https://stripe.com/docs/api|Stripe API Documentation}
 */
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2023-10-16',
    typescript: true,
})