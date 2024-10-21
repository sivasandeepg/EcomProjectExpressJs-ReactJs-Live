// controllers/addressController.js
const Address = require('../../models/Address');
 
// Create a new address
exports.createAddress = async (req, res) => {
    try {
        const {  fullName, phoneNumber, addressLine1, addressLine2, city, state, postalCode, country } = req.body;
        const userId = req.user.id; 
        const newAddress = new Address({
            user:userId, 
            fullName,
            phoneNumber,
            addressLine1,
            addressLine2,
            city,
            state,
            postalCode,
            country
        });

        const savedAddress = await newAddress.save();
        res.status(201).json(savedAddress);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
   
// Get all addresses for a user
exports.getAddresses = async (req, res) => {
    try {
        // const addresses = await Address.find({ userId: req.params.userId });
        const addresses = await Address.find({ user: req.user.id }); 
        console.log(addresses);   
        res.status(200).json(addresses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get a specific address
exports.getAddressById = async (req, res) => {
    try {
        const address = await Address.findById(req.params.id);
        if (!address) return res.status(404).json({ message: 'Address not found' });
        res.status(200).json(address);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update an address
exports.updateAddress = async (req, res) => {
    try {
        const { fullName, phoneNumber, addressLine1, addressLine2, city, state, postalCode, country } = req.body;

        const updatedAddress = await Address.findByIdAndUpdate(
            req.params.id,
            { fullName, phoneNumber, addressLine1, addressLine2, city, state, postalCode, country },
            { new: true }
        );

        if (!updatedAddress) return res.status(404).json({ message: 'Address not found' });
        res.status(200).json(updatedAddress);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete an address
exports.deleteAddress = async (req, res) => {
    try {
        const deletedAddress = await Address.findByIdAndDelete(req.params.id);
        if (!deletedAddress) return res.status(404).json({ message: 'Address not found' });
        res.status(200).json({ message: 'Address deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
 