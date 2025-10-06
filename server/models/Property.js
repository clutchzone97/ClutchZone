import { Parse } from '../config/back4app.js';

class Property extends Parse.Object {
  constructor() {
    super('Property');
  }

  // Getters
  get type() {
    return this.get('type');
  }

  get location() {
    return this.get('location');
  }

  get area() {
    return this.get('area');
  }

  get price() {
    return this.get('price');
  }

  get description() {
    return this.get('description');
  }

  get features() {
    return this.get('features') || [];
  }

  get status() {
    return this.get('status') || 'available';
  }

  get images() {
    return this.get('images') || [];
  }

  // Setters
  set type(value) {
    this.set('type', value);
  }

  set location(value) {
    this.set('location', value);
  }

  set area(value) {
    this.set('area', value);
  }

  set price(value) {
    this.set('price', value);
  }

  set description(value) {
    this.set('description', value);
  }

  set features(value) {
    this.set('features', value);
  }

  set status(value) {
    this.set('status', value);
  }

  set images(value) {
    this.set('images', value);
  }

  // Static methods
  static async findAll(limit = 100, skip = 0) {
    const query = new Parse.Query(Property);
    query.limit(limit);
    query.skip(skip);
    query.descending('createdAt');
    return await query.find();
  }

  static async findById(id) {
    const query = new Parse.Query(Property);
    return await query.get(id);
  }

  static async findByStatus(status, limit = 100) {
    const query = new Parse.Query(Property);
    query.equalTo('status', status);
    query.limit(limit);
    query.descending('createdAt');
    return await query.find();
  }

  static async findByType(type, limit = 100) {
    const query = new Parse.Query(Property);
    query.equalTo('type', type);
    query.limit(limit);
    query.descending('createdAt');
    return await query.find();
  }

  static async search(searchTerm, limit = 100) {
    const query = new Parse.Query(Property);
    const typeQuery = new Parse.Query(Property);
    const locationQuery = new Parse.Query(Property);
    
    typeQuery.contains('type', searchTerm);
    locationQuery.contains('location', searchTerm);
    
    const mainQuery = Parse.Query.or(typeQuery, locationQuery);
    mainQuery.limit(limit);
    mainQuery.descending('createdAt');
    
    return await mainQuery.find();
  }

  static async deleteById(id) {
    const query = new Parse.Query(Property);
    const property = await query.get(id);
    return await property.destroy();
  }

  // إضافة الطرق المفقودة
  static async create(data) {
    const property = new Property();
    
    // تعيين البيانات
    Object.keys(data).forEach(key => {
      property.set(key, data[key]);
    });
    
    await property.save();
    return property;
  }

  static async getById(id) {
    const query = new Parse.Query(Property);
    return await query.get(id);
  }

  static async getAll(options = {}) {
    const { featured = false, limit = 10 } = options;
    
    const query = new Parse.Query(Property);
    
    if (featured) {
      query.equalTo('featured', true);
    }
    
    query.limit(limit);
    query.descending('createdAt');
    
    return await query.find();
  }
}

// Register the subclass
Parse.Object.registerSubclass('Property', Property);

export default Property;