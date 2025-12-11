const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const Property = require('./models/Property');
const User = require('./models/User');

dotenv.config();

const seedProperties = async () => {
    try {
        await connectDB();

        // Find an agent user (or create one)
        let agent = await User.findOne({ role: 'agent' });

        if (!agent) {
            console.log('No agent found. Creating demo agent...');
            agent = await User.create({
                name: 'Demo Agent',
                email: 'agent@demo.com',
                password: 'password123',
                role: 'agent'
            });
        }

        console.log('Using agent:', agent.email);

        // Clear existing properties
        await Property.deleteMany({});
        console.log('Cleared existing properties');

        // Create sample properties
        const properties = [
            // Houses
            {
                title: 'Charming Suburban Family Home',
                description: 'Beautiful family home in quiet neighborhood with large backyard, updated kitchen, and excellent schools nearby. Move-in ready!',
                price: 850000,
                location: {
                    formattedAddress: '789 Maple Street',
                    city: 'Austin',
                    state: 'Texas',
                    zipcode: '78701',
                    country: 'USA'
                },
                bedrooms: 4,
                bathrooms: 3,
                areaSqft: 3200,
                propertyType: 'House',
                amenities: ['Garden', 'Parking', 'Air Conditioning', 'Furnished'],
                images: ['https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=800&q=80'],
                coverImage: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=800&q=80',
                agentId: agent._id,
                approvalStatus: 'approved'
            },
            {
                title: 'Mountain Retreat Cabin',
                description: 'Cozy mountain getaway with stunning views, fireplace, and deck. Perfect for weekend escapes and nature lovers.',
                price: 650000,
                location: {
                    formattedAddress: '555 Pine Ridge Road',
                    city: 'Aspen',
                    state: 'Colorado',
                    zipcode: '81611',
                    country: 'USA'
                },
                bedrooms: 3,
                bathrooms: 2,
                areaSqft: 2000,
                propertyType: 'House',
                amenities: ['Garden', 'Parking', 'Furnished'],
                images: ['https://images.unsplash.com/photo-1600596542815-27bfefd0c3c6?auto=format&fit=crop&w=800&q=80'],
                coverImage: 'https://images.unsplash.com/photo-1600596542815-27bfefd0c3c6?auto=format&fit=crop&w=800&q=80',
                agentId: agent._id,
                approvalStatus: 'approved'
            },
            {
                title: 'Elegant Victorian Estate',
                description: 'Historic Victorian home with original details, wraparound porch, and mature gardens. Meticulously maintained.',
                price: 1450000,
                location: {
                    formattedAddress: '234 Heritage Lane',
                    city: 'Boston',
                    state: 'Massachusetts',
                    zipcode: '02108',
                    country: 'USA'
                },
                bedrooms: 5,
                bathrooms: 4,
                areaSqft: 4200,
                propertyType: 'House',
                amenities: ['Garden', 'Parking', 'Balcony', 'Furnished'],
                images: ['https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80'],
                coverImage: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80',
                agentId: agent._id,
                approvalStatus: 'approved'
            },
            // Apartments
            {
                title: 'Modern Downtown Penthouse',
                description: 'Exquisite penthouse in the heart of the city with floor-to-ceiling windows, gourmet kitchen, and rooftop terrace. Perfect for urban living.',
                price: 2800000,
                location: {
                    formattedAddress: '456 Park Avenue',
                    city: 'New York',
                    state: 'New York',
                    zipcode: '10022',
                    country: 'USA'
                },
                bedrooms: 3,
                bathrooms: 3,
                areaSqft: 2500,
                propertyType: 'Apartment',
                amenities: ['Gym', 'Security', 'Elevator', 'Air Conditioning', 'Smart Home'],
                images: ['https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80'],
                coverImage: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
                agentId: agent._id,
                approvalStatus: 'approved'
            },
            {
                title: 'Luxury High-Rise Apartment',
                description: 'Stunning apartment with panoramic city views, concierge service, and resort-style amenities. Prime location.',
                price: 1950000,
                location: {
                    formattedAddress: '888 Michigan Avenue',
                    city: 'Chicago',
                    state: 'Illinois',
                    zipcode: '60611',
                    country: 'USA'
                },
                bedrooms: 2,
                bathrooms: 2,
                areaSqft: 1800,
                propertyType: 'Apartment',
                amenities: ['Pool', 'Gym', 'Security', 'Elevator', 'Air Conditioning'],
                images: ['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80'],
                coverImage: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80',
                agentId: agent._id,
                approvalStatus: 'approved'
            },
            // Condos
            {
                title: 'Contemporary Urban Loft',
                description: 'Stylish loft with exposed brick, high ceilings, and industrial charm. Located in trendy arts district with cafes and galleries.',
                price: 1200000,
                location: {
                    formattedAddress: '321 Industrial Way',
                    city: 'San Francisco',
                    state: 'California',
                    zipcode: '94102',
                    country: 'USA'
                },
                bedrooms: 2,
                bathrooms: 2,
                areaSqft: 1800,
                propertyType: 'Condo',
                amenities: ['Parking', 'Elevator', 'Air Conditioning'],
                images: ['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80'],
                coverImage: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80',
                agentId: agent._id,
                approvalStatus: 'approved'
            },
            {
                title: 'Waterfront Condo with Marina Views',
                description: 'Bright and airy condo overlooking the marina. Private balcony, modern finishes, and walking distance to restaurants.',
                price: 975000,
                location: {
                    formattedAddress: '567 Harbor Drive',
                    city: 'Seattle',
                    state: 'Washington',
                    zipcode: '98101',
                    country: 'USA'
                },
                bedrooms: 2,
                bathrooms: 2,
                areaSqft: 1500,
                propertyType: 'Condo',
                amenities: ['Balcony', 'Parking', 'Security', 'Gym'],
                images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80'],
                coverImage: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80',
                agentId: agent._id,
                approvalStatus: 'approved'
            },
            // Villas
            {
                title: 'Luxury Beachfront Villa',
                description: 'Stunning oceanfront property with panoramic views, infinity pool, and private beach access. Features 5 spacious bedrooms, modern kitchen, and entertainment areas.',
                price: 4500000,
                location: {
                    formattedAddress: '123 Ocean Drive',
                    city: 'Malibu',
                    state: 'California',
                    zipcode: '90265',
                    country: 'USA'
                },
                bedrooms: 5,
                bathrooms: 4,
                areaSqft: 4500,
                propertyType: 'Villa',
                amenities: ['Pool', 'Sea View', 'Garden', 'Parking', 'Security'],
                images: ['https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=800&q=80'],
                coverImage: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=800&q=80',
                agentId: agent._id,
                approvalStatus: 'approved'
            },
            {
                title: 'Mediterranean Paradise Villa',
                description: 'Exquisite Mediterranean-style villa with courtyard, fountain, and lush landscaping. Wine cellar and chef\'s kitchen.',
                price: 3750000,
                location: {
                    formattedAddress: '999 Vineyard Road',
                    city: 'Napa',
                    state: 'California',
                    zipcode: '94558',
                    country: 'USA'
                },
                bedrooms: 4,
                bathrooms: 4,
                areaSqft: 4000,
                propertyType: 'Villa',
                amenities: ['Pool', 'Garden', 'Parking', 'Air Conditioning', 'Furnished'],
                images: ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80'],
                coverImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
                agentId: agent._id,
                approvalStatus: 'approved'
            },
            {
                title: 'Tropical Island Villa',
                description: 'Private island villa with white sand beaches, crystal clear waters, and ultimate luxury. Helicopter pad included.',
                price: 8900000,
                location: {
                    formattedAddress: '1 Paradise Island',
                    city: 'Key West',
                    state: 'Florida',
                    zipcode: '33040',
                    country: 'USA'
                },
                bedrooms: 6,
                bathrooms: 6,
                areaSqft: 6500,
                propertyType: 'Villa',
                amenities: ['Pool', 'Sea View', 'Garden', 'Security', 'Smart Home'],
                images: ['https://images.unsplash.com/photo-1602343168117-bb8ffe3e2e9f?auto=format&fit=crop&w=800&q=80'],
                coverImage: 'https://images.unsplash.com/photo-1602343168117-bb8ffe3e2e9f?auto=format&fit=crop&w=800&q=80',
                agentId: agent._id,
                approvalStatus: 'approved'
            },
            // Commercial
            {
                title: 'Prime Downtown Office Building',
                description: 'Class A office building in central business district. Recently renovated with modern amenities and parking garage.',
                price: 12500000,
                location: {
                    formattedAddress: '777 Business Plaza',
                    city: 'Dallas',
                    state: 'Texas',
                    zipcode: '75201',
                    country: 'USA'
                },
                bedrooms: 0,
                bathrooms: 10,
                areaSqft: 25000,
                propertyType: 'Commercial',
                amenities: ['Parking', 'Security', 'Elevator', 'Air Conditioning'],
                images: ['https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80'],
                coverImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80',
                agentId: agent._id,
                approvalStatus: 'approved'
            },
            {
                title: 'Retail Shopping Center',
                description: 'Well-established shopping center with anchor tenants and high foot traffic. Excellent investment opportunity.',
                price: 8750000,
                location: {
                    formattedAddress: '456 Commerce Street',
                    city: 'Phoenix',
                    state: 'Arizona',
                    zipcode: '85001',
                    country: 'USA'
                },
                bedrooms: 0,
                bathrooms: 8,
                areaSqft: 35000,
                propertyType: 'Commercial',
                amenities: ['Parking', 'Security'],
                images: ['https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80'],
                coverImage: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80',
                agentId: agent._id,
                approvalStatus: 'approved'
            },
            // Land
            {
                title: 'Scenic Mountain Land - 50 Acres',
                description: 'Pristine mountain property with breathtaking views, creek, and mature trees. Perfect for custom estate or development.',
                price: 1250000,
                location: {
                    formattedAddress: 'Mountain View Road',
                    city: 'Jackson Hole',
                    state: 'Wyoming',
                    zipcode: '83001',
                    country: 'USA'
                },
                bedrooms: 0,
                bathrooms: 0,
                areaSqft: 2178000, // 50 acres
                propertyType: 'Land',
                amenities: [],
                images: ['https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80'],
                coverImage: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80',
                agentId: agent._id,
                approvalStatus: 'approved'
            },
            {
                title: 'Beachfront Development Land',
                description: 'Rare opportunity for beachfront development. 10 acres with approved plans for luxury resort. Unobstructed ocean views.',
                price: 15000000,
                location: {
                    formattedAddress: 'Coastal Highway',
                    city: 'Santa Barbara',
                    state: 'California',
                    zipcode: '93101',
                    country: 'USA'
                },
                bedrooms: 0,
                bathrooms: 0,
                areaSqft: 435600, // 10 acres
                propertyType: 'Land',
                amenities: ['Sea View'],
                images: ['https://images.unsplash.com/photo-1559827260-dc66d52bef19?auto=format&fit=crop&w=800&q=80'],
                coverImage: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?auto=format&fit=crop&w=800&q=80',
                agentId: agent._id,
                approvalStatus: 'approved'
            },
            {
                title: 'Agricultural Farmland - 200 Acres',
                description: 'Productive farmland with irrigation system, barn, and equipment storage. Excellent soil quality and water rights.',
                price: 3200000,
                location: {
                    formattedAddress: 'Rural Route 5',
                    city: 'Des Moines',
                    state: 'Iowa',
                    zipcode: '50309',
                    country: 'USA'
                },
                bedrooms: 0,
                bathrooms: 0,
                areaSqft: 8712000, // 200 acres
                propertyType: 'Land',
                amenities: [],
                images: ['https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=800&q=80'],
                coverImage: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=800&q=80',
                agentId: agent._id,
                approvalStatus: 'approved'
            }
        ];

        // Create properties one by one to trigger pre-save hooks
        let count = 0;
        for (const propertyData of properties) {
            await Property.create(propertyData);
            count++;
        }

        console.log(`✅ Created ${count} properties with slugs`);

        process.exit(0);
    } catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    }
};

seedProperties();
