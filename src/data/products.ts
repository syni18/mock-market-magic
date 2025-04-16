
export interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  image: string;
  category: string;
  featured: boolean;
  rating: number;
  stock: number;
}

export const products: Product[] = [
  {
    id: 1,
    name: "Premium Wireless Headphones",
    price: 16599,
    description: "Experience crystal-clear audio with our premium wireless headphones. Featuring noise cancellation, 40-hour battery life, and comfortable over-ear cushions.",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80",
    category: "electronics",
    featured: true,
    rating: 4.8,
    stock: 15
  },
  {
    id: 2,
    name: "Ergonomic Office Chair",
    price: 249.99,
    description: "Work comfortably with our ergonomic office chair. Adjustable height, lumbar support, and breathable mesh back for those long working hours.",
    image: "https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?auto=format&fit=crop&w=800&q=80",
    category: "furniture",
    featured: true,
    rating: 4.5,
    stock: 8
  },
  {
    id: 3,
    name: "Smart Fitness Watch",
    price: 129.99,
    description: "Track your fitness goals with our smart watch. Features heart rate monitoring, sleep tracking, and 7-day battery life in a sleek, water-resistant design.",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80",
    category: "electronics",
    featured: true,
    rating: 4.6,
    stock: 20
  },
  {
    id: 4,
    name: "Professional Camera Kit",
    price: 899.99,
    description: "Capture stunning photos with our professional camera kit. Includes DSLR camera body, 18-55mm lens, carrying case, and accessories.",
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80",
    category: "electronics",
    featured: false,
    rating: 4.9,
    stock: 5
  },
  {
    id: 5,
    name: "Minimalist Desk Lamp",
    price: 59.99,
    description: "Illuminate your workspace with our adjustable desk lamp. Features touch controls, multiple brightness levels, and USB charging port.",
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80",
    category: "furniture",
    featured: false,
    rating: 4.4,
    stock: 12
  },
  {
    id: 6,
    name: "Portable Power Bank",
    price: 45.99,
    description: "Never run out of battery with our high-capacity power bank. 20,000mAh capacity, dual USB ports, and fast charging technology.",
    image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=800&q=80",
    category: "electronics",
    featured: false,
    rating: 4.3,
    stock: 25
  },
  {
    id: 7,
    name: "Handcrafted Ceramic Mug Set",
    price: 34.99,
    description: "Start your day with our handcrafted ceramic mug set. Set of 4 unique designs, microwave and dishwasher safe.",
    image: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=800&q=80",
    category: "kitchen",
    featured: false,
    rating: 4.7,
    stock: 18
  },
  {
    id: 8,
    name: "Modern Wall Clock",
    price: 39.99,
    description: "Add a touch of elegance to your home with our modern wall clock. Silent mechanism, 12-inch diameter, and contemporary design.",
    image: "https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?auto=format&fit=crop&w=800&q=80",
    category: "home",
    featured: false,
    rating: 4.2,
    stock: 14
  },
  {
    id: 9,
    name: "Leather Laptop Sleeve",
    price: 49.99,
    description: "Protect your laptop in style with our premium leather sleeve. Fits laptops up to 15 inches, with pockets for accessories.",
    image: "https://images.unsplash.com/photo-1572932491814-6496308cb10b?auto=format&fit=crop&w=800&q=80",
    category: "accessories",
    featured: false,
    rating: 4.5,
    stock: 10
  },
  {
    id: 10,
    name: "Smart Home Speaker",
    price: 149.99,
    description: "Transform your home with our smart speaker. Voice control, premium sound quality, and home automation integration.",
    image: "https://images.unsplash.com/photo-1558089687-db5ff4a8b771?auto=format&fit=crop&w=800&q=80",
    category: "electronics",
    featured: true,
    rating: 4.7,
    stock: 7
  },
  {
    id: 11,
    name: "Bamboo Cutting Board",
    price: 29.99,
    description: "Prepare meals with our eco-friendly bamboo cutting board. Durable, knife-friendly surface with built-in compartments.",
    image: "https://images.unsplash.com/photo-1594385828802-6b8b0ce16019?auto=format&fit=crop&w=800&q=80",
    category: "kitchen",
    featured: false,
    rating: 4.4,
    stock: 22
  },
  {
    id: 12,
    name: "Luxury Scented Candle",
    price: 24.99,
    description: "Create a soothing atmosphere with our luxury scented candle. 40-hour burn time with notes of lavender and sandalwood.",
    image: "https://images.unsplash.com/photo-1601922046210-fb5ea33dfca2?auto=format&fit=crop&w=800&q=80",
    category: "home",
    featured: false,
    rating: 4.6,
    stock: 16
  }
];

export const categories = [
  { id: "all", name: "All Products" },
  { id: "electronics", name: "Electronics" },
  { id: "furniture", name: "Furniture" },
  { id: "kitchen", name: "Kitchen" },
  { id: "home", name: "Home Decor" },
  { id: "accessories", name: "Accessories" }
];

export const getProductById = (id: number): Product | undefined => {
  return products.find(product => product.id === id);
};

export const getFeaturedProducts = (): Product[] => {
  return products.filter(product => product.featured);
};

export const getProductsByCategory = (category: string): Product[] => {
  if (category === "all") return products;
  return products.filter(product => product.category === category);
};
