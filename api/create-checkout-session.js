const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Map of price IDs to their corresponding Stripe price IDs
// Clean the price IDs by removing any comments or extra whitespace
const PRICE_MAP = {
    'group-single': process.env.STRIPE_PRICE_GROUP_SINGLE ? process.env.STRIPE_PRICE_GROUP_SINGLE.split('#')[0].trim() : '',
    'group-three': process.env.STRIPE_PRICE_GROUP_THREE ? process.env.STRIPE_PRICE_GROUP_THREE.split('#')[0].trim() : '',
    'group-six': process.env.STRIPE_PRICE_GROUP_SIX ? process.env.STRIPE_PRICE_GROUP_SIX.split('#')[0].trim() : '',
    'premium-single': process.env.STRIPE_PRICE_PREMIUM_SINGLE ? process.env.STRIPE_PRICE_PREMIUM_SINGLE.split('#')[0].trim() : '',
    'premium-three': process.env.STRIPE_PRICE_PREMIUM_THREE ? process.env.STRIPE_PRICE_PREMIUM_THREE.split('#')[0].trim() : '',
    'premium-six': process.env.STRIPE_PRICE_PREMIUM_SIX ? process.env.STRIPE_PRICE_PREMIUM_SIX.split('#')[0].trim() : ''
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

    // Debug environment variables (masked for security)
    console.log('Environment Variables (with comments):', {
        STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY ? `${process.env.STRIPE_SECRET_KEY.substring(0, 7)}...` : 'missing',
        STRIPE_PRICE_GROUP_SINGLE: process.env.STRIPE_PRICE_GROUP_SINGLE || 'missing',
        STRIPE_PRICE_GROUP_THREE: process.env.STRIPE_PRICE_GROUP_THREE || 'missing',
        STRIPE_PRICE_GROUP_SIX: process.env.STRIPE_PRICE_GROUP_SIX || 'missing',
        STRIPE_PRICE_PREMIUM_SINGLE: process.env.STRIPE_PRICE_PREMIUM_SINGLE || 'missing',
        STRIPE_PRICE_PREMIUM_THREE: process.env.STRIPE_PRICE_PREMIUM_THREE || 'missing',
        STRIPE_PRICE_PREMIUM_SIX: process.env.STRIPE_PRICE_PREMIUM_SIX || 'missing'
    });

    // Log cleaned price IDs
    console.log('Cleaned Price IDs:', PRICE_MAP);

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

        if (!priceId || !PRICE_MAP[priceId]) {
            console.error('Invalid price ID:', priceId);
            return res.status(400).json({ error: 'Invalid price ID' });
        }

        const stripePriceId = PRICE_MAP[priceId];
        console.log('Using Stripe price ID (cleaned):', stripePriceId);
        
        // Validate that we have a valid price ID
        if (!stripePriceId || stripePriceId.trim() === '') {
            console.error('Empty Stripe price ID after cleaning');
            return res.status(500).json({ error: 'Configuration error - invalid price ID' });
        }
        
        const isSubscription = priceId.includes('three') || priceId.includes('six');
        
        // Common checkout session parameters
        const sessionParams = {
            payment_method_types: ['card'],
            line_items: [
                {
                    price: stripePriceId,
                    quantity: 1,
                },
            ],
            mode: isSubscription ? 'subscription' : 'payment',
            success_url: `${req.headers.origin}/success.html?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${req.headers.origin}/cancel.html`,
        };

        console.log('Creating session with params:', JSON.stringify(sessionParams, null, 2));

        // For subscription plans, add metadata about plan duration
        if (isSubscription && PAYMENT_PLANS[priceId]) {
            console.log('Adding subscription data for:', priceId);
            // Add metadata to track the subscription limit
            sessionParams.subscription_data = {
                metadata: {
                    payment_limit: PAYMENT_PLANS[priceId].months,
                    plan_type: PAYMENT_PLANS[priceId].description
                }
            };
            
            // Instead of using cancel_at, we'll set up a webhook to cancel
            // after the specified number of payments in our Stripe dashboard
            console.log('Subscription will be limited to', PAYMENT_PLANS[priceId].months, 'payments');
        }

        // Create Checkout Session
        console.log('Creating checkout session...');
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