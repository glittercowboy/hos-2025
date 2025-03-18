// /api/facebook-conversion.js
const axios = require('axios');
const crypto = require('crypto');

export default async function handler(req, res) {
    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }
    
    try {
        const { event_name, user_data } = req.body;
        
        // Hash user data (Facebook requires this for PII)
        const hashedData = {
            em: user_data.email ? [hashData(user_data.email.trim().toLowerCase())] : [],
            fn: user_data.name ? [hashData(user_data.name.split(' ')[0])] : []
        };
        
        // Set up CAPI request
        const pixelId = '1359094931888766';
        const accessToken = process.env.FB_ACCESS_TOKEN; // Set this in Vercel
        
        // Send to Facebook
        await axios.post(
            `https://graph.facebook.com/v17.0/${pixelId}/events`,
            {
                data: [{
                    event_name: event_name,
                    event_time: Math.floor(Date.now() / 1000),
                    action_source: 'website',
                    user_data: hashedData
                }]
            },
            {
                params: { access_token: accessToken }
            }
        );
        
        // Return success
        res.status(200).json({ success: true });
    } catch (error) {
        console.error('Error sending to Facebook CAPI:', error);
        // Still return success to client - don't block form submission
        res.status(200).json({ success: false, error: error.message });
    }
}

// Function to hash data for Facebook (SHA-256)
function hashData(data) {
    return crypto.createHash('sha256').update(data).digest('hex');
} 