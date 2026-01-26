import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import Car from '../models/Car.js';
import Property from '../models/Property.js';
import { createUniqueSlug } from '../utils/slugHelper.js';
import connectDB from '../config/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Adjust path to point to root .env if it exists there, or server/.env
dotenv.config({ path: path.join(__dirname, '../.env') });

const migrate = async () => {
  try {
    await connectDB();
    
    console.log('Migrating Cars...');
    const cars = await Car.find({ slug: { $exists: false } });
    console.log(`Found ${cars.length} cars without slugs.`);
    for (const car of cars) {
      const slug = await createUniqueSlug(Car, car.title || car.brand || 'car');
      car.slug = slug;
      await car.save();
      console.log(`Updated Car: ${car.title} -> ${slug}`);
    }

    console.log('Migrating Properties...');
    const props = await Property.find({ slug: { $exists: false } });
    console.log(`Found ${props.length} properties without slugs.`);
    for (const prop of props) {
      const slug = await createUniqueSlug(Property, prop.title || 'property');
      prop.slug = slug;
      await prop.save();
      console.log(`Updated Property: ${prop.title} -> ${slug}`);
    }

    console.log('Migration completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
};

migrate();
