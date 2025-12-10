const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Property = require('./models/Property');
const connectDB = require('./config/db');

dotenv.config();

// Fix IPv6 issue with localhost
if (process.env.MONGO_URI && process.env.MONGO_URI.includes('localhost')) {
    process.env.MONGO_URI = process.env.MONGO_URI.replace('localhost', '127.0.0.1');
}

const importData = async () => {
    try {
        await Property.deleteMany();
        await User.deleteMany();

        const createdUser = await User.create({
            name: 'Admin User',
            email: 'admin@example.com',
            password: 'password123',
            role: 'admin'
        });

        const agentUser = await User.create({
            name: 'John Agent',
            email: 'agent@example.com',
            password: 'password123',
            role: 'agent'
        });

        const propertyTypes = ['Land', 'Commercial', 'Villa', 'Condo', 'Apartment', 'House'];
        const cities = ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia', 'San Antonio', 'San Diego', 'Dallas', 'San Jose', 'Austin', 'Jacksonville', 'Fort Worth', 'Columbus', 'Charlotte', 'San Francisco', 'Indianapolis', 'Seattle', 'Denver', 'Washington'];
        const states = ['NY', 'CA', 'IL', 'TX', 'AZ', 'PA', 'TX', 'CA', 'TX', 'CA', 'TX', 'FL', 'TX', 'OH', 'NC', 'CA', 'IN', 'WA', 'CO', 'DC'];

        // Expanded image sets for variety
        const images = {
            'Land': [
                'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1600',
                'https://images.unsplash.com/photo-1516156008625-3a9d60bdd70e?w=1600',
                'https://images.unsplash.com/photo-1513554769062-850f8fb01cc8?w=1600',
                'https://images.unsplash.com/photo-1596707328003-a2ca4f944888?w=1600'
            ],
            'Commercial': [
                'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1600',
                'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=1600',
                'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1600',
                'https://images.unsplash.com/photo-1464938050520-ef2270bb8ce8?w=1600'
            ],
            'Villa': [
                'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1600',
                'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1600',
                'https://images.unsplash.com/photo-1580587771525-78b9dba3b91d?w=1600',
                'https://images.unsplash.com/photo-1628624747186-a941947738d4?w=1600'
            ],
            'Condo': [
                'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1600',
                'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1600',
                'https://images.unsplash.com/photo-1515263487990-61b07816b324?w=1600'
            ],
            'Apartment': [
                'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1600',
                'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1600',
                'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=1600'
            ],
            'House': [
                'https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=1600',
                'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1600',
                'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=1600',
                'https://images.unsplash.com/photo-1580587771525-78b9dba3b91d?w=1600'
            ]
        };

        const descriptors = ['Modern', 'Spacious', 'Comfortable', 'Well-Maintained', 'Updated', 'Bright', 'Open-Concept', 'Corner', 'Renovated', 'Move-In Ready'];
        const locations = ['Downtown', 'Uptown', 'Midtown', 'Suburban', 'Waterfront', 'Hillside', 'Lakeside', 'Central', 'North', 'South'];

        const generateRandomProperty = (type, index) => {
            const cityIndex = Math.floor(Math.random() * cities.length);
            const city = cities[cityIndex];
            const state = states[cityIndex];

            // Randomly select descriptor and location
            const descriptor = descriptors[Math.floor(Math.random() * descriptors.length)];
            const location = locations[Math.floor(Math.random() * locations.length)];

            // Randomly select array of images for this type
            const typeImages = images[type] || images['House'];
            const randomImage = typeImages[Math.floor(Math.random() * typeImages.length)];

            let price, beds, baths, sqft;

            if (type === 'Land') {
                price = Math.floor(Math.random() * 500000) + 50000;
                beds = 0;
                baths = 0;
                sqft = Math.floor(Math.random() * 100000) + 5000;
            } else {
                price = Math.floor(Math.random() * 5000000) + 200000;
                beds = Math.floor(Math.random() * 6) + 1;
                baths = Math.floor(Math.random() * 5) + 1;
                sqft = Math.floor(Math.random() * 5000) + 800;
            }

            return {
                title: `${descriptor} ${type} in ${location} ${city}`,
                description: `A ${descriptor.toLowerCase()} ${type.toLowerCase()} located in ${location} ${city}. This property features ${beds > 0 ? beds + ' bedrooms, ' + baths + ' bathrooms, and' : ''} ${sqft.toLocaleString()} sqft of living space in ${state}.`,
                price: price,
                location: {
                    city: city,
                    state: state,
                    country: 'USA'
                },
                bedrooms: beds,
                bathrooms: baths,
                areaSqft: sqft,
                propertyType: type,
                slug: `${descriptor.toLowerCase().replace(/ /g, '-')}-${type.toLowerCase()}-${index}-${city.toLowerCase().replace(/ /g, '-')}-${Date.now() + index}`,
                images: [],
                coverImage: randomImage,
                agentId: agentUser._id,
                approvalStatus: 'approved'
            };
        };

        let properties = [];

        propertyTypes.forEach(type => {
            for (let i = 0; i < 20; i++) {
                properties.push(generateRandomProperty(type, i));
            }
        });

        await Property.insertMany(properties);

        console.log('Data Imported!');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

const destroyData = async () => {
    try {
        await Property.deleteMany();
        await User.deleteMany();

        console.log('Data Destroyed!');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

const run = async () => {
    try {
        await connectDB();

        if (process.argv[2] === '-d') {
            await destroyData();
        } else {
            await importData();
        }
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

run();
