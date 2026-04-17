export interface Hotel {
  id: string;
  name: string;
  city: string;
  address: string;
  stars: number;
  rating: number;
  reviewCount: number;
  pricePerNight: number;
  originalPrice?: number;
  images: string[];
  amenities: string[];
  description: string;
  lat: number;
  lng: number;
  rooms: RoomType[];
}

export interface RoomType {
  id: string;
  name: string;
  capacity: number;
  bed: string;
  price: number;
  breakfast: boolean;
  refundable: boolean;
}

export interface HotelSearchParams {
  city: string;
  checkIn: Date;
  checkOut: Date;
  guests: number;
  rooms: number;
}
