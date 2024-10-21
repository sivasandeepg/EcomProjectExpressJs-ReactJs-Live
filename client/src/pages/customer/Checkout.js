import React, { useEffect, useState } from 'react';
import { getCart } from '../../services/customer/CartService';
import { getAddresses, addAddress } from '../../services/customer/AddressService';
import { createOrder } from '../../services/customer/OrderService';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios'; // For handling payment intent creation
import '../../styles/Checkout.css';

const stripePromise = loadStripe('pk_test_51P06YiSJT0hyyPRN9a4h2MPxCE6c3YAM97VkYKIgO0mwA1TmcwaBG2judxVPTRDr3n3u6677oKmHtfuzBDBCim6a00Vt9tyhVp');

const Checkout = () => {
    const [shippingAddress, setShippingAddress] = useState(null);
    const [newAddress, setNewAddress] = useState({
        fullName: 'SivaSandeep',
        phoneNumber: '9876543210',
        addressLine1: 'fIRST lINE',
        addressLine2: 'sECOND sTREET',
        city: 'HYD',
        state: 'TS',
        postalCode: '524201',
        country: 'IN', 
    });
    const [addresses, setAddresses] = useState([]);
    const [paymentMethod, setPaymentMethod] = useState('Online');
    const [orderSummary, setOrderSummary] = useState({ items: [], total: 0 });
    const [isProcessing, setIsProcessing] = useState(false); // Track payment processing
    const [showAddressInput, setShowAddressInput] = useState(false); // Track new address input visibility

    const stripe = useStripe();
    const elements = useElements();

    useEffect(() => {
        const fetchCart = async () => {
            try {
                const cartData = await getCart();
                const total = calculateTotal(cartData.items);
                setOrderSummary({
                    items: cartData.items.map(item => ({
                        ...item,
                        vendor: item.vendor // Ensure vendor is included in each item
                    })),
                    total: total,
                });
            } catch (error) {
                console.error('Failed to fetch cart:', error);
            }
        };

        const fetchAddresses = async () => {
            try {
                const addressesData = await getAddresses();
                console.log('Fetched addresses:', addressesData); // Check if addresses are coming in
                setAddresses(addressesData);
                if (addressesData.length > 0) {
                    setShippingAddress(addressesData[0]); // Automatically set the first address as default
                }
            } catch (error) {
                console.error('Failed to fetch addresses:', error);
            }
        };

        fetchCart();
        fetchAddresses();
    }, []); 

    const calculateTotal = (items) => {
        return items.reduce((total, item) => total + item.priceAtAddTime * item.quantity, 0);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewAddress({ ...newAddress, [name]: value });
    };

    const handlePaymentMethodChange = (e) => {
        setPaymentMethod(e.target.value);
    };

    const handleSelectAddress = (address) => {
        setShippingAddress(address);
        setShowAddressInput(false); // Hide address input when selecting existing address
    };

    // Add new address
    const handleAddAddress = async (e) => {
        e.preventDefault();
        try {
            const createdAddress = await addAddress(newAddress); // Add address via API
            setAddresses((prev) => [...prev, createdAddress]); // Update address list
            setShippingAddress(createdAddress); // Set new address as the selected shipping address
            setNewAddress({ // Reset form
                fullName: '',
                phoneNumber: '',
                addressLine1: '',
                addressLine2: '',
                city: '',
                state: '',
                postalCode: '',
                country: '',
            });
            setShowAddressInput(false); // Hide input fields after adding the address
        } catch (error) {
            console.error('Failed to add address:', error);
        }
    };

    // Stripe Payment handling
    const handlePayment = async () => {
        if (!stripe || !elements) {
            return; // Stripe.js has not loaded yet
        }
        setIsProcessing(true);
        try {
            // Create the payment intent on the server with shipping details
            const response = await axios.post('http://localhost:5000/api/payment/create-payment-intent', {
                amount: orderSummary.total * 100, // Amount in smallest currency unit
                currency: 'INR',  // Currency
                description: `Purchase of ${orderSummary.items.length} item(s)`,
                shipping: {
                    name: shippingAddress.fullName,
                    address: {
                        line1: shippingAddress.addressLine1,
                        line2: shippingAddress.addressLine2,
                        city: shippingAddress.city,
                        state: shippingAddress.state,
                        postalCode: shippingAddress.postalCode,
                        country: shippingAddress.country,
                    }
                }
            });

            const clientSecret = response.data.clientSecret;

            // Confirm the payment using the `clientSecret`
            const result = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: elements.getElement(CardElement),
                    billing_details: {
                        name: shippingAddress.fullName,
                        address: {
                            line1: shippingAddress.addressLine1,
                            line2: shippingAddress.addressLine2,
                            city: shippingAddress.city,
                            state: shippingAddress.state,
                            postal_code: shippingAddress.postalCode,
                            country:'IN',
                        },
                    },
                },
            });

            if (result.error) {
                console.error('Payment failed:', result.error.message);
                alert(`Payment failed: ${result.error.message}`);
            } else if (result.paymentIntent.status === 'succeeded') {
                console.log('Payment succeeded:', result.paymentIntent);

                // Proceed with creating the order
                const orderData = {
                    items: orderSummary.items.map(item => ({
                        product: item.product,
                        quantity: item.quantity,
                        priceAtAddTime: item.priceAtAddTime,
                        discount: item.discount || 0,
                        vendor: item.vendor,
                        trackingInfo: {
                            trackingNumber: item.trackingNumber || '',
                            carrier: item.carrier || '',
                            trackingUrl: item.trackingUrl || '',
                        },
                        deliveryDate: item.deliveryDate || null
                    })),
                    total: orderSummary.total,
                    shippingAddress,
                    paymentIntentId: result.paymentIntent.id,
                };

                const createdOrder = await createOrder(orderData);
                window.location.href = `/success/${createdOrder.order._id}`;
            } else if (result.paymentIntent.status === 'requires_action') {
                // 3D Secure authentication is required
                console.log('3D Secure or additional authentication is required.');
                alert('Please complete the authentication process.');
            }
        } catch (error) {
            console.error('Error processing payment:', error);
            window.location.href = '/failure';
        } finally {
            setIsProcessing(false);
        }
    };

    // Handle form submission and validation
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!shippingAddress) {
            alert('Please select or add a shipping address before proceeding.');
            return;
        }
        if (paymentMethod === 'Online') {
            handlePayment();
        } else {
            // Handle cash on delivery logic here
        }
    };

    return (
                <div className="checkout-page">
                    <h3>Checkout</h3>
                    <form onSubmit={handleSubmit} className="checkout-form">
                        <div className="address-payment-container">
                            <div className="address-section">
                                <h4>Select Shipping Address</h4>
                                <div>
                                    <input 
                                        type="radio" 
                                        name="addressOption" 
                                        id="existing-address" 
                                        checked={!showAddressInput} 
                                        onChange={() => setShowAddressInput(false)} 
                                    />
                                    <label className="radio-label" htmlFor="existing-address">Select Existing Address</label>
    
                                    <input 
                                        type="radio" 
                                        name="addressOption" 
                                        id="new-address" 
                                        checked={showAddressInput} 
                                        onChange={() => setShowAddressInput(true)} 
                                    />
                                    <label className="radio-label" htmlFor="new-address">Add New Address</label>
                                </div>
    
                                {!showAddressInput && addresses.length > 0 ? (
                                    <div className="address-list">
                                        {addresses.map((address) => (
                                            <div key={address._id} className={`address-item ${address === shippingAddress ? 'selected' : ''}`}>
                                                <input 
                                                    type="radio" 
                                                    name="address" 
                                                    value={address._id} 
                                                    checked={address === shippingAddress} 
                                                    onChange={() => handleSelectAddress(address)} 
                                                />
                                                <p>{address.fullName}</p>
                                                <p>{address.addressLine1}, {address.city}, {address.state}, {address.postalCode}, {address.country}</p>
                                                <p>{address.phoneNumber}</p>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    showAddressInput && (
                                        <div>
                                            <h3>Add New Address</h3>
                                            <input type="text" name="fullName" placeholder="Full Name" onChange={handleChange} required />
                                            <input type="text" name="phoneNumber" placeholder="Phone Number" onChange={handleChange} required />
                                            <input type="text" name="addressLine1" placeholder="Address Line 1" onChange={handleChange} required />
                                            <input type="text" name="addressLine2" placeholder="Address Line 2" onChange={handleChange} />
                                            <input type="text" name="city" placeholder="City" onChange={handleChange} required />
                                            <input type="text" name="state" placeholder="State" onChange={handleChange} required />
                                            <input type="text" name="postalCode" placeholder="Postal Code" onChange={handleChange} required />
                                            <input type="text" name="country" value='IN' placeholder="Country" onChange={handleChange} disabled />
                                            <button type="button" onClick={handleAddAddress}>Add Address</button>
                                        </div>
                                    )
                                )}
                            </div>
                            <div className="payment-section">
                                <h2>Payment Method</h2>
                                <select onChange={handlePaymentMethodChange} value={paymentMethod}>
                                    <option value="Online">Online Payment</option>
                                    <option value="COD">Cash on Delivery</option>
                                </select>
                                {paymentMethod === 'Online' && (
                                    <div className="card-element-container"> 
                                        <small>Demo Card Number:  4000 0025 0000 3155</small> 
                                        <hr />
                                        <CardElement 
                                            options={{
                                                style: {
                                                    base: {
                                                        fontSize: '16px',
                                                        color: '#32325d',
                                                        '::placeholder': {
                                                            color: '#aab7c4',
                                                        },
                                                    },
                                                    invalid: {
                                                        color: '#fa755a',
                                                        iconColor: '#fa755a', 
                                                    },
                                                },
                                                hidePostalCode: true, 
                                            }} 
                                        />  
                                    </div>
                                )}
                            </div>
                        </div>
    
                        <div className="order-summary">
                            <h2>Order Summary</h2>
                            <ul>
                                {orderSummary.items.map(item => (
                                    <li key={item.product._id}>
                                        {item.vendor} - {item.product.name} x {item.quantity}: ₹{item.priceAtAddTime * item.quantity}
                                    </li>
                                ))}
                            </ul>
                            <h3>Total: ₹{orderSummary.total}</h3>
                        </div>
        
                        <button type="submit" disabled={isProcessing}>{isProcessing ? 'Processing...' : 'Place Order'}</button>
                    </form>
                </div>
            );
        };
        
       
         


export default function CheckoutWrapper() {
    return (
        <Elements stripe={stripePromise}>
            <Checkout />
        </Elements>
    );
} 
 