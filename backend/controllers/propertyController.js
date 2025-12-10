const Property = require('../models/Property');

// @desc    Get all properties
// @route   GET /api/properties
// @access  Public
const getProperties = async (req, res) => {
    try {
        let {
            search,
            type,
            minPrice,
            maxPrice,
            bedrooms,
            bathrooms,
            sort,
            page,
            limit
        } = req.query;

        // Build query
        const query = {};

        // Approve properties only for public
        // If query has 'status', let it override if admin? 
        // For now, let's assume public only sees approved. 
        // Admins might use a different endpoint or param.
        query.approvalStatus = 'approved';

        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { 'location.city': { $regex: search, $options: 'i' } }
            ];
        }

        if (type) {
            query.propertyType = type;
        }

        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = Number(minPrice);
            if (maxPrice) query.price.$lte = Number(maxPrice);
        }

        if (bedrooms) {
            query.bedrooms = { $gte: Number(bedrooms) };
        }

        if (bathrooms) {
            query.bathrooms = { $gte: Number(bathrooms) };
        }

        // Sorting
        let sortOption = { createdAt: -1 }; // Default new to old
        if (sort) {
            if (sort === 'price_asc') sortOption = { price: 1 };
            if (sort === 'price_desc') sortOption = { price: -1 };
            if (sort === 'oldest') sortOption = { createdAt: 1 };
        }

        // Pagination
        const pageNum = Number(page) || 1;
        const limitNum = Number(limit) || 9;
        const skip = (pageNum - 1) * limitNum;

        const total = await Property.countDocuments(query);
        const properties = await Property.find(query)
            .sort(sortOption)
            .skip(skip)
            .limit(limitNum)
            .populate('agentId', 'name email avatar');

        res.json({
            properties,
            page: pageNum,
            pages: Math.ceil(total / limitNum),
            total
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single property
// @route   GET /api/properties/:slug
// @access  Public
const getProperty = async (req, res) => {
    try {
        const property = await Property.findOne({ slug: req.params.slug })
            .populate('agentId', 'name email avatar');

        if (!property) {
            res.status(404);
            throw new Error('Property not found');
        }

        res.json(property);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create new property
// @route   POST /api/properties
// @access  Private (Agent/Admin)
const createProperty = async (req, res) => {
    try {
        // req.files is array of files from multer
        const images = req.files ? req.files.map(file => file.path) : [];
        if (req.body.coverImageIndex && images.length > req.body.coverImageIndex) {
            req.body.coverImage = images[req.body.coverImageIndex];
        } else if (images.length > 0) {
            req.body.coverImage = images[0];
        }

        // If coverImage is sent as string (e.g. from existing URL or different logic), respect it.
        // But typically we rely on upload.

        // Manual override for location if sent as string JSON
        let location = req.body.location;
        if (typeof location === 'string') {
            location = JSON.parse(location);
        }

        const property = await Property.create({
            ...req.body,
            agentId: req.user._id,
            images,
            location,
            approvalStatus: 'pending' // Always pending initially
        });

        res.status(201).json(property);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update property
// @route   PUT /api/properties/:id
// @access  Private (Agent/Admin)
const updateProperty = async (req, res) => {
    try {
        let property = await Property.findById(req.params.id);

        if (!property) {
            res.status(404);
            throw new Error('Property not found');
        }

        // Check ownership
        if (req.user.role !== 'admin' && property.agentId.toString() !== req.user._id.toString()) {
            res.status(403);
            throw new Error('Not authorized to update this property');
        }

        // Handle images? Complex for updates. 
        // For simplicity, we might allow adding new images or replacing.
        // If we get new files:
        if (req.files && req.files.length > 0) {
            const newImages = req.files.map(file => file.path);
            req.body.images = [...property.images, ...newImages];
        }

        property = await Property.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.json(property);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete property
// @route   DELETE /api/properties/:id
// @access  Private (Agent/Admin)
const deleteProperty = async (req, res) => {
    try {
        const property = await Property.findById(req.params.id);

        if (!property) {
            res.status(404);
            throw new Error('Property not found');
        }

        if (req.user.role !== 'admin' && property.agentId.toString() !== req.user._id.toString()) {
            res.status(403);
            throw new Error('Not authorized');
        }

        await property.deleteOne();
        res.json({ message: 'Property removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getProperties,
    getProperty,
    createProperty,
    updateProperty,
    deleteProperty
};
