import { Parse } from '../config/back4app.js';

class Car extends Parse.Object {
  constructor() {
    super('Car');
  }

  // Getters
  get make() {
    return this.get('make');
  }

  get model() {
    return this.get('model');
  }

  get year() {
    return this.get('year');
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
  set make(value) {
    this.set('make', value);
  }

  set model(value) {
    this.set('model', value);
  }

  set year(value) {
    this.set('year', value);
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
    const query = new Parse.Query(Car);
    query.limit(limit);
    query.skip(skip);
    query.descending('createdAt');
    return await query.find();
  }

  static async findById(id) {
    const query = new Parse.Query(Car);
    return await query.get(id);
  }

  static async findByStatus(status, limit = 100) {
    const query = new Parse.Query(Car);
    query.equalTo('status', status);
    query.limit(limit);
    query.descending('createdAt');
    return await query.find();
  }

  static async search(searchTerm, limit = 100) {
    const query = new Parse.Query(Car);
    const makeQuery = new Parse.Query(Car);
    const modelQuery = new Parse.Query(Car);
    
    makeQuery.contains('make', searchTerm);
    modelQuery.contains('model', searchTerm);
    
    const mainQuery = Parse.Query.or(makeQuery, modelQuery);
    mainQuery.limit(limit);
    mainQuery.descending('createdAt');
    
    return await mainQuery.find();
  }

  static async deleteById(id) {
    const query = new Parse.Query(Car);
    const car = await query.get(id);
    return await car.destroy();
  }
}

// Register the subclass
Parse.Object.registerSubclass('Car', Car);

export default Car;