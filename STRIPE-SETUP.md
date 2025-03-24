# Stripe Setup Instructions

This document explains how to set up your Stripe account to work with the Heart of Sound Course payment page.

## 1. Create Stripe Account

If you don't already have a Stripe account:
1. Go to [stripe.com](https://stripe.com) and click "Start now"
2. Complete the signup process

## 2. Get API Keys

1. Log in to your Stripe Dashboard
2. Go to [Developers > API keys](https://dashboard.stripe.com/apikeys)
3. Your **Publishable Key** and **Secret Key** will be displayed
4. Make sure you're in the correct mode:
   - **Test Mode**: For testing the integration (test cards only)
   - **Live Mode**: For accepting real payments (switch when ready to go live)

## 3. Create Products and Prices

You need to create two products with multiple pricing options in Stripe:

### Group Offering

1. Go to [Products > Add Product](https://dashboard.stripe.com/products/create)
2. Enter product details:
   - **Name**: "Heart of Sound - Group Offering"
   - **Description**: "Group course offering with multiple payment options"

3. Create the first price (single payment):
   - Click "Add Price"
   - **Pricing model**: Standard pricing
   - **Price**: $4,000.00 USD
   - **One-time**: Selected
   - Click "Add Price"
   - Copy the Price ID (starts with `price_`) and paste it in `.env` for `STRIPE_PRICE_GROUP_SINGLE`

4. Create the second price (3-month plan):
   - Click "Add another price"
   - **Pricing model**: Standard pricing
   - **Price**: $1,360.00 USD
   - **Recurring**: Selected
   - **Billing period**: Monthly
   - Click "Add Price"
   - Copy the Price ID and paste it in `.env` for `STRIPE_PRICE_GROUP_THREE`

5. Create the third price (6-month plan):
   - Click "Add another price"
   - **Pricing model**: Standard pricing
   - **Price**: $685.00 USD
   - **Recurring**: Selected 
   - **Billing period**: Monthly
   - Click "Add Price"
   - Copy the Price ID and paste it in `.env` for `STRIPE_PRICE_GROUP_SIX`

### Premium Offering

1. Go to [Products > Add Product](https://dashboard.stripe.com/products/create)
2. Enter product details:
   - **Name**: "Heart of Sound - Premium Offering"
   - **Description**: "Premium course offering with multiple payment options"

3. Create the first price (single payment):
   - Click "Add Price"
   - **Pricing model**: Standard pricing
   - **Price**: $5,500.00 USD
   - **One-time**: Selected
   - Click "Add Price"
   - Copy the Price ID and paste it in `.env` for `STRIPE_PRICE_PREMIUM_SINGLE`

4. Create the second price (3-month plan):
   - Click "Add another price"
   - **Pricing model**: Standard pricing
   - **Price**: $1,860.00 USD
   - **Recurring**: Selected
   - **Billing period**: Monthly
   - Click "Add Price"
   - Copy the Price ID and paste it in `.env` for `STRIPE_PRICE_PREMIUM_THREE`

5. Create the third price (6-month plan):
   - Click "Add another price"
   - **Pricing model**: Standard pricing
   - **Price**: $935.00 USD
   - **Recurring**: Selected
   - **Billing period**: Monthly
   - Click "Add Price"
   - Copy the Price ID and paste it in `.env` for `STRIPE_PRICE_PREMIUM_SIX`

## 4. Update Environment Variables

1. Open your `.env` file
2. Replace all the placeholder values with the actual Price IDs you created
3. Make sure your Stripe API keys are correctly set

## 5. Testing the Integration

To test the payment flow:
1. Use these [test card numbers](https://stripe.com/docs/testing#cards):
   - Successful payment: `4242 4242 4242 4242`
   - Declined payment: `4000 0000 0000 0002`
2. Use any future expiration date
3. Use any 3-digit CVC
4. Use any name and valid postal code (e.g., `90210` for US)

## 6. Going Live

When you're ready to accept real payments:
1. Complete your Stripe account setup (provide business details, bank information, etc.)
2. Switch to Live mode in Stripe Dashboard
3. Update your environment variables to use the live API keys
4. Test a small real payment to confirm everything works

## Important Notes on Payment Plans

- For the 3-month and 6-month payment plans, our implementation automatically sets the subscription to cancel after the specified number of payments
- The first payment will be charged immediately, and subsequent payments will be charged monthly
- The customer will be charged the specified amount for exactly 3 or 6 months (including the initial payment)
- Stripe doesn't natively support "X payments only" plans, but our implementation handles this through the Stripe API with automatic cancellation 