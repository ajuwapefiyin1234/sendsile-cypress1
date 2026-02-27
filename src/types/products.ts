export interface Product {
  id: number;
  name: string;
  quantity: number;
  price: number;
  image: any;
}

export interface ProductType {
  id: number;
  name: string;
  // quantity: number;
  price: number;
  image: any;
}

//backend calls
export interface ProductCategory {
  category_id: string;
  // description: string;
  // name: string;

  category_description: string;
  category_image: string;
  category_name: string;
}

export interface IProduct {
  category: ProductCategory;
  description: string;
  product_list: string;
  images: string[];
  name: string;
  product_id: string;
  slug: string;
  brand?: {
    brand_description: string;
    brand_id: string;
    brand_name: string;
    brand_slug: string;
    brand_status: string | number;
  };
  variants: {
    availability: string;
    discount: string;
    discount_type: string | null;
    price: string;
    sku: string;
    stock: number;
    variant_id: string;
    variation: string;
  }[];
}

interface IProductCartVersion {
  variants: {
    discount: string;
    stock: number;
    price: string;
    variant_id: string;
    variation: string;
  }[];
}

export interface ICartProduct {
  images: string[];
  product_id: string;
  product_name: string;
  quantity: number;
  product: IProductCartVersion;
}

export interface IProductBrandCategory {
  id: string;
  name: string;
  description?: string;
  image?: string;
}

export interface IProductBrands {
  id: string;
  name: string;
}

export interface IProductReview {
  average_rating: null | number;
  reviews: ProductComment[];
}

interface ProductComment {
  comment: string;
  date: string;
  product: string;
  rating: number;
  review_id: string;
  user: string;
}
