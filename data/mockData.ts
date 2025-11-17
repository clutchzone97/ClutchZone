
import { Car, Property, Order, OrderStatus } from '../types';

export const cars: Car[] = [
  { id: 1, title: 'بي ام دبليو X5 2022', make: 'بي ام دبليو', model: 'X5', year: 2022, price: 1710000, mileage: 25000, transmission: 'أوتوماتيك', fuelType: 'بنزين', imageUrl: 'https://picsum.photos/seed/car1/800/600', images: ['https://picsum.photos/seed/car1a/800/600', 'https://picsum.photos/seed/car1b/800/600', 'https://picsum.photos/seed/car1c/800/600'] },
  { id: 2, title: 'مرسيدس C200 2021', make: 'مرسيدس', model: 'C200', year: 2021, price: 1170000, mileage: 35000, transmission: 'أوتوماتيك', fuelType: 'بنزين', imageUrl: 'https://picsum.photos/seed/car2/800/600', images: ['https://picsum.photos/seed/car2a/800/600', 'https://picsum.photos/seed/car2b/800/600', 'https://picsum.photos/seed/car2c/800/600'] },
  { id: 3, title: 'تويوتا كامري 2023', make: 'تويوتا', model: 'كامري', year: 2023, price: 750000, mileage: 15000, transmission: 'أوتوماتيك', fuelType: 'هايبرد', imageUrl: 'https://picsum.photos/seed/car3/800/600', images: ['https://picsum.photos/seed/car3a/800/600', 'https://picsum.photos/seed/car3b/800/600', 'https://picsum.photos/seed/car3c/800/600'] },
  { id: 4, title: 'لكزس ES350 2023', make: 'لكزس', model: 'ES350', year: 2023, price: 1290000, mileage: 8000, transmission: 'أوتوماتيك', fuelType: 'بنزين', imageUrl: 'https://picsum.photos/seed/car4/800/600', images: ['https://picsum.photos/seed/car4a/800/600', 'https://picsum.photos/seed/car4b/800/600', 'https://picsum.photos/seed/car4c/800/600'] },
  { id: 5, title: 'هوندا أكورد 2022', make: 'هوندا', model: 'أكورد', year: 2022, price: 588000, mileage: 28000, transmission: 'أوتوماتيك', fuelType: 'بنزين', imageUrl: 'https://picsum.photos/seed/car5/800/600', images: ['https://picsum.photos/seed/car5a/800/600', 'https://picsum.photos/seed/car5b/800/600', 'https://picsum.photos/seed/car5c/800/600'] },
  { id: 6, title: 'نيسان التيما 2023', make: 'نيسان', model: 'التيما', year: 2023, price: 534000, mileage: 12000, transmission: 'أوتوماتيك', fuelType: 'بنزين', imageUrl: 'https://picsum.photos/seed/car6/800/600', images: ['https://picsum.photos/seed/car6a/800/600', 'https://picsum.photos/seed/car6b/800/600', 'https://picsum.photos/seed/car6c/800/600'] },
];

export const properties: Property[] = [
  { id: 1, title: 'فيلا فاخرة في التجمع الخامس', type: 'فيلا', status: 'للبيع', price: 15000000, area: 650, bedrooms: 5, bathrooms: 6, location: 'القاهرة الجديدة - التجمع الخامس', imageUrl: 'https://picsum.photos/seed/prop1/800/600', images: ['https://picsum.photos/seed/prop1a/800/600', 'https://picsum.photos/seed/prop1b/800/600', 'https://picsum.photos/seed/prop1c/800/600'] },
  { id: 2, title: 'شقة عصرية في وسط البلد', type: 'شقة', status: 'للإيجار', price: 25000, area: 180, bedrooms: 3, bathrooms: 2, location: 'القاهرة - وسط البلد', imageUrl: 'https://picsum.photos/seed/prop2/800/600', images: ['https://picsum.photos/seed/prop2a/800/600', 'https://picsum.photos/seed/prop2b/800/600', 'https://picsum.photos/seed/prop2c/800/600'] },
  { id: 3, title: 'أرض تجارية على طريق القاهرة الإسكندرية', type: 'أرض', status: 'للبيع', price: 10800000, area: 1200, bedrooms: 0, bathrooms: 0, location: 'الجيزة - طريق القاهرة الإسكندرية', imageUrl: 'https://picsum.photos/seed/prop3/800/600', images: ['https://picsum.photos/seed/prop3a/800/600', 'https://picsum.photos/seed/prop3b/800/600', 'https://picsum.photos/seed/prop3c/800/600'] },
  { id: 4, title: 'شاليه في الساحل الشمالي', type: 'شقة', status: 'للبيع', price: 5100000, area: 200, bedrooms: 3, bathrooms: 2, location: 'مطروح - الساحل الشمالي', imageUrl: 'https://picsum.photos/seed/prop4/800/600', images: ['https://picsum.photos/seed/prop4a/800/600', 'https://picsum.photos/seed/prop4b/800/600', 'https://picsum.photos/seed/prop4c/800/600'] },
  { id: 5, title: 'محل تجاري في سيتي ستارز', type: 'محل تجاري', status: 'للإيجار', price: 45000, area: 85, bedrooms: 0, bathrooms: 1, location: 'القاهرة - مدينة نصر', imageUrl: 'https://picsum.photos/seed/prop5/800/600', images: ['https://picsum.photos/seed/prop5a/800/600', 'https://picsum.photos/seed/prop5b/800/600', 'https://picsum.photos/seed/prop5c/800/600'] },
  { id: 6, title: 'دوبلكس في كمبوند الشيخ زايد', type: 'دوبلكس', status: 'للبيع', price: 9900000, area: 320, bedrooms: 4, bathrooms: 3, location: 'الجيزة - الشيخ زايد', imageUrl: 'https://picsum.photos/seed/prop6/800/600', images: ['https://picsum.photos/seed/prop6a/800/600', 'https://picsum.photos/seed/prop6b/800/600', 'https://picsum.photos/seed/prop6c/800/600'] },
];

export const orders: Order[] = [
  { id: 1, itemType: 'سيارة', itemName: 'تويوتا كامري 2023', clientName: 'أحمد محمد', clientPhone: '0501234567', amount: 85000, date: '2024-01-15', status: OrderStatus.New },
  { id: 2, itemType: 'عقار', itemName: 'شقة في الرياض', clientName: 'فاطمة علي', clientPhone: '0507654321', amount: 450000, date: '2024-01-14', status: OrderStatus.InProgress },
  { id: 3, itemType: 'سيارة', itemName: 'هوندا أكورد 2022', clientName: 'محمد أحمد', clientPhone: '0509876543', amount: 75000, date: '2024-01-13', status: OrderStatus.Completed },
  { id: 4, itemType: 'عقار', itemName: 'فيلا في جدة', clientName: 'سارة خالد', clientPhone: '0502468135', amount: 1200000, date: '2024-01-12', status: OrderStatus.New },
  { id: 5, itemType: 'سيارة', itemName: 'نيسان التيما 2021', clientName: 'عبدالله سعيد', clientPhone: '0503691472', amount: 68000, date: '2024-01-11', status: OrderStatus.Cancelled },
];
