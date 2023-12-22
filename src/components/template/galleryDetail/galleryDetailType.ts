type cars = {
  id: string;
  title: string;
  description: string;
  gallery: {
    id: string;
    name: string;
    is_verified: boolean;
    image: {
      url: string;
    } | null;
    phone_numbers: {
      number: string;
      id: string;
    }[];
    city: {
      name_en: string;
      province: {
        name_en: string;
      };
    };
  };
  car_seat: {
    id: number;
    seats_count: string;
  };
  build_year_id: number;
  build_year: {
    year: string;
  };
  model_id: number;
  model: {
    id: number;
    name: string;
    brand: {
      id: number;
      name: string;
    };
  };
  category: {
    id: number;
    category: string;
    abbreviation: string | null;
  };
  fuel_type: {
    id: number;
    type: string;
  }
  images: {
    id: string;
    url: string;
  }[];
  for_rent: {
    id: string;
    car_id: string;
    price_per_day: number;
    pick_up_place: string;
    drop_off_place: string;
    reservation_fee_percentage: number | null;
    late_return_fee_per_hour: number | null;
    extra_time: boolean;
    createdAt: Date;
    updatedAt: Date;
  } | null;
  for_sale: {
    id: string;
    price: number;
    mileage: number;
    color: {
      id: number;
      color_name: string;
      color_code: string;
    };
  } | null;
  is_car_rented: {
    id: string;
    rented_user_id: string;
    car_id: string;
    days: number;
    pick_up_date: Date;
    drop_off_date: Date;
    reservation_fee: number | null;
    total_price: number;
    createdAt: Date;
    updatedAt: Date;
  }[];
  createdAt: Date;
  updatedAt: Date;
}


type galleryDetailType = {
  id: string;
  name: string;
  address: string;
  about: string | null;
  is_verified: boolean;
  createdAt: Date;
  updatedAt: Date;
  city: {
    name_en: string;
    province: {
      name_en: string;
    };
  };
  image: {
    id: string;
    url: string;
  } | null;
  cars: cars[];
  categories: {
    id: number;
    category: string;
    abbreviation: string | null;
  }[];
  phone_numbers: {
    number: string;
    id: string;
  }[];
};

export default galleryDetailType