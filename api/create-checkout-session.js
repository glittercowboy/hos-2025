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

// Add reverse mapping for direct price IDs
const REVERSE_PRICE_MAP = {
    [process.env.STRIPE_PRICE_GROUP_SINGLE?.split('#')[0].trim()]: 'group-single',
    [process.env.STRIPE_PRICE_GROUP_THREE?.split('#')[0].trim()]: 'group-three',
    [process.env.STRIPE_PRICE_GROUP_SIX?.split('#')[0].trim()]: 'group-six',
    [process.env.STRIPE_PRICE_PREMIUM_SINGLE?.split('#')[0].trim()]: 'premium-single',
    [process.env.STRIPE_PRICE_PREMIUM_THREE?.split('#')[0].trim()]: 'premium-three',
    [process.env.STRIPE_PRICE_PREMIUM_SIX?.split('#')[0].trim()]: 'premium-six'
};

// Payment plan details
const PAYMENT_PLANS = {
    'group-three': { months: 3, description: 'Group 3-Month Plan' },
    'group-six': { months: 6, description: 'Group 6-Month Plan' },
    'premium-three': { months: 3, description: 'Premium 3-Month Plan' },
    'premium-six': { months: 6, description: 'Premium 6-Month Plan' }
};

// Valid coupon codes with their Stripe coupon IDs
// In production, you would likely store these in a database
const VALID_COUPONS = {
    'EARLYBIRD': {
        stripeId: 'promo_1R6G7yK5DsdBdIvwTgGBE3fT',
        expires: new Date('2024-04-28T23:59:59'),
        maxUses: 6,
        currentUses: 0 // In a real app, this would be stored in a database
    }
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
        // Safely extract priceId and couponCode
        const { priceId, couponCode } = req.body || {};
        console.log('Requested price ID:', priceId);
        console.log('Coupon code:', couponCode || 'None');

        // Check if this is a direct Stripe price ID
        let stripePriceId = priceId;
        let planKey = REVERSE_PRICE_MAP[priceId];
        
        // If not a direct price ID, use the friendly name mapping
        if (!planKey) {
            if (!PRICE_MAP[priceId]) {
                console.error('Invalid price ID:', priceId);
                return res.status(400).json({ error: 'Invalid price ID' });
            }
            stripePriceId = PRICE_MAP[priceId];
            planKey = priceId;
        }
        
        console.log('Using Stripe price ID:', stripePriceId);
        console.log('Plan key for metadata:', planKey);
        
        // Validate that we have a valid price ID
        if (!stripePriceId || stripePriceId.trim() === '') {
            console.error('Empty Stripe price ID after cleaning');
            return res.status(500).json({ error: 'Configuration error - invalid price ID' });
        }
        
        const isSubscription = planKey.includes('three') || planKey.includes('six');
        
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
            success_url: `${req.headers.origin}/?success=true&session_id={CHECKOUT_SESSION_ID}&priceId=${planKey}`,
            cancel_url: `${req.headers.origin}/?cancelled=true`,
            allow_promotion_codes: true,
        };

        // Handle coupon code if provided
        if (couponCode) {
            console.log('Processing coupon code:', couponCode);
            const coupon = VALID_COUPONS[couponCode];
            
            if (coupon) {
                // Check if coupon is expired
                const now = new Date();
                if (now > coupon.expires) {
                    console.log('Coupon expired:', couponCode);
                } 
                // Check if coupon has reached max uses
                else if (coupon.maxUses && coupon.currentUses >= coupon.maxUses) {
                    console.log('Coupon reached maximum usage limit:', couponCode);
                }
                else {
                    try {
                        // Verify the coupon exists in Stripe
                        console.log('Retrieving promotion code from Stripe:', coupon.stripeId);
                        const promoCode = await stripe.promotionCodes.retrieve(coupon.stripeId);
                        
                        if (promoCode && !promoCode.deleted) {
                            // Check if the promotion code is still valid according to Stripe
                            if (!promoCode.active) {
                                console.log('Promotion code is inactive in Stripe');
                            } 
                            else if (promoCode.max_redemptions && promoCode.times_redeemed >= promoCode.max_redemptions) {
                                console.log('Promotion code has reached maximum redemptions in Stripe');
                            }
                            else {
                                // Add promotion code to checkout session
                                console.log('Applying promotion code to checkout session:', promoCode.id);
                                sessionParams.discounts = [
                                    {
                                        promotion_code: promoCode.id,
                                    },
                                ];
                                
                                // In a real app, you would update the usage count in the database
                                // coupon.currentUses += 1;
                            }
                        }
                    } catch (couponError) {
                        console.error('Error applying coupon:', couponError.message);
                        // Continue without coupon if there's an error
                    }
                }
            } else {
                console.log('Invalid coupon code:', couponCode);
            }
        }

        console.log('Creating session with params:', JSON.stringify(sessionParams, null, 2));

        // For subscription plans, add metadata about plan duration
        if (isSubscription && PAYMENT_PLANS[planKey]) {
            console.log('Adding subscription data for:', planKey);
            // Add metadata to track the subscription limit
            sessionParams.subscription_data = {
                metadata: {
                    payment_limit: PAYMENT_PLANS[planKey].months,
                    plan_type: PAYMENT_PLANS[planKey].description
                }
            };
            
            // Instead of using cancel_at, we'll set up a webhook to cancel
            // after the specified number of payments in our Stripe dashboard
            console.log('Subscription will be limited to', PAYMENT_PLANS[planKey].months, 'payments');
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