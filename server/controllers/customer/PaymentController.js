const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Create a payment intent 
exports.createPaymentIntent = async (req, res) => {
    try {
        const { amount, currency, description, shipping } = req.body;

        if (!amount || !currency) {
            return res.status(400).send({ message: 'Amount and currency are required' });
        }

        if (!shipping || !shipping.name || !shipping.address) {
            return res.status(400).send({ message: 'Shipping name and address are required for export transactions.' });
        }

        // Create payment intent
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount * 100, // Stripe expects amount in the smallest currency unit
            currency: currency.toLowerCase(),
            automatic_payment_methods: {
                enabled: true,
            },
            description: description || 'E-commerce transaction', // Optional description
            shipping: {
                name: shipping.name, // Customer's name
                address: {
                    line1: shipping.address.line1,
                    line2: shipping.address.line2 || '', 
                    city: shipping.address.city,
                    state: shipping.address.state,
                    postal_code: shipping.address.postalCode,
                    country: shipping.address.country,
                },
            },
        });

        res.send({
            clientSecret: paymentIntent.client_secret,
        });
    } catch (error) {
        console.error('Error creating payment intent:', error);
        res.status(500).send({ message: 'Server error' });
    }
};
