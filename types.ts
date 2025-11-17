
export interface Car {
  id: number;
  title: string;
  make: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  transmission: 'أوتوماتيك' | 'يدوي';
  fuelType: 'بنزين' | 'ديزل' | 'هايبرد' | 'كهرباء';
  imageUrl: string;
  images: string[];
}

export interface Property {
  id: number;
  title: string;
  type: 'فيلا' | 'شقة' | 'أرض' | 'محل تجاري' | 'دوبلكس';
  status: 'للبيع' | 'للإيجار';
  price: number;
  area: number;
  bedrooms: number;
  bathrooms: number;
  location: string;
  imageUrl: string;
  images: string[];
}

export enum OrderStatus {
  New = 'جديد',
  InProgress = 'قيد المراجعة',
  Completed = 'مكتمل',
  Cancelled = 'ملغية'
}

export interface Order {
  id: number;
  itemType: 'سيارة' | 'عقار';
  itemName: string;
  clientName: string;
  clientPhone: string;
  amount: number;
  date: string;
  status: OrderStatus;
}
