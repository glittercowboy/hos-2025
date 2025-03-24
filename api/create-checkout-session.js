const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Map of price IDs to their corresponding Stripe price IDs
// You'll need to replace these with your actual Stripe price IDs
const PRICE_MAP = {
    'group-single': process.env.STRIPE_PRICE_GROUP_SINGLE,
    'group-three': process.env.STRIPE_PRICE_GROUP_THREE,
    'group-six': process.env.STRIPE_PRICE_GROUP_SIX,
    'premium-single': process.env.STRIPE_PRICE_PREMIUM_SINGLE,
    'premium-three': process.env.STRIPE_PRICE_PREMIUM_THREE,
    'premium-six': process.env.STRIPE_PRICE_PREMIUM_SIX
};

// Payment plan details
const PAYMENT_PLANS = {
    'group-three': { months: 3, description: 'Group 3-Month Plan' },
    'group-six': { months: 6, description: 'Group 6-Month Plan' },
    'premium-three': { months: 3, description: 'Premium 3-Month Plan' },
    'premium-six': { months: 6, description: 'Premium 6-Month Plan' }
};

module.exports = async (req, res) => {
    console.log('API Request received');

    // Debug environment variables
    console.log('Environment Variables:', {
        STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY ? `${process.env.STRIPE_SECRET_KEY.substring(0, 7)}...` : 'missing',
        STRIPE_PRICE_GROUP_SINGLE: process.env.STRIPE_PRICE_GROUP_SINGLE || 'missing',
        STRIPE_PRICE_GROUP_THREE: process.env.STRIPE_PRICE_GROUP_THREE || 'missing',
        STRIPE_PRICE_GROUP_SIX: process.env.STRIPE_PRICE_GROUP_SIX || 'missing',
        STRIPE_PRICE_PREMIUM_SINGLE: process.env.STRIPE_PRICE_PREMIUM_SINGLE || 'missing',
        STRIPE_PRICE_PREMIUM_THREE: process.env.STRIPE_PRICE_PREMIUM_THREE || 'missing',
        STRIPE_PRICE_PREMIUM_SIX: process.env.STRIPE_PRICE_PREMIUM_SIX || 'missing'
    });

    // Check if Stripe is initialized
    if (!process.env.STRIPE_SECRET_KEY) {
        console.error('Stripe secret key is missing');
        return res.status(500).json({ error: 'Stripe configuration is missing' });
    }

    if (req.method !== 'POST') {
        console.log('Method not allowed:', req.method);
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        // Safely extract priceId
        const { priceId } = req.body || {};
        console.log('Requested price ID:', priceId);

        if (!priceId) {
            console.error('No price ID provided in request');
            return res.status(400).json({ error: 'Price ID is required' });
        }

        // Create simple Stripe checkout session for testing
        const sessionParams = {
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: 'Heart of Sound Course - Test',
                        },
                        unit_amount: 10000, // $100.00 for testing
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `${req.headers.origin}/success.html?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${req.headers.origin}/payments.html`,
        };

        console.log('Creating simple test checkout session');
        const session = await stripe.checkout.sessions.create(sessionParams);
        console.log('Session created successfully:', session.id);

        res.status(200).json({ id: session.id });
    } catch (error) {
        console.error('Detailed error:', {
            message: error.message,
            type: error.type || 'unknown',
            stack: error.stack
        });
        
        res.status(500).json({ 
            error: 'Error creating checkout session',
            details: error.message
        });
    }
}; 