export interface Product {
  id: string;
  name: string;
  subtitle: string;
  category: 'candles' | 'murals' | 'diyas' | 'idols' | 'hampers';
  price: number;
  originalPrice?: number;
  rating: number;
  reviewsCount: number;
  tag?: string; // e.g. "Diwali Bestseller", "Limited Edition of 50", "Artisan Made", "Signature Piece"
  images: string[];
  specs: {
    burnTime?: string;
    dimensions?: string;
    material?: string;
    fragranceNotes?: string[];
  };
  description: string;
  artisanStory: string;
  inStock: boolean;
  featured?: boolean;
}

export const PRODUCTS: Product[] = [
  {
    id: "prabha-01",
    name: "Golden Ganesha Diya Candle",
    subtitle: "Brass Inlaid Organic Soy Pillar",
    category: "candles",
    price: 3499,
    originalPrice: 4299,
    rating: 4.9,
    reviewsCount: 128,
    tag: "Diwali Bestseller",
    images: [
      "https://images.unsplash.com/photo-1602874801007-bd458bb1b8b6?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&q=80&w=1000"
    ],
    specs: {
      burnTime: "65 Hours",
      dimensions: "14cm x 12cm",
      material: "100% Organic Soy Wax & Hand-Carved Brass",
      fragranceNotes: ["Royal Saffron", "Sandalwood", "Cardamom Amber"]
    },
    description: "An architectural masterpiece hand-poured with pure organic soy wax, featuring a hand-hammered solid brass Ganesha motif that radiates warmth as the candle burns.",
    artisanStory: "Crafted by Master Sculptor Rajeshbhai in Vadodara, Gujarat over 18 labor-intensive steps.",
    inStock: true,
    featured: true
  },
  {
    id: "prabha-02",
    name: "Sacred Lotus Texture Mural",
    subtitle: "24K Gold Leaf & Clay Wall Relief",
    category: "murals",
    price: 18500,
    originalPrice: 22000,
    rating: 5.0,
    reviewsCount: 42,
    tag: "Limited Edition of 50",
    images: [
      "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1582562124811-c09040d0a901?auto=format&fit=crop&q=80&w=1000"
    ],
    specs: {
      dimensions: "24in x 36in",
      material: "Textured Fiber-Clay & 24K Gold Leaf Gilded",
      fragranceNotes: []
    },
    description: "A commanding 3D tactile wall mural embodying the blooming sacred lotus. Sealed with antique matte sealant and accented with real 24K gold leaf detailing.",
    artisanStory: "Hand-sculpted over 14 days by traditional Gujarati relief mural artisans.",
    inStock: true,
    featured: true
  },
  {
    id: "prabha-03",
    name: "Royal Marigold Floating Urli Set",
    subtitle: "Hammered Brass & Floating Wax Diyas",
    category: "diyas",
    price: 5200,
    originalPrice: 6500,
    rating: 4.8,
    reviewsCount: 89,
    tag: "Festive Essential",
    images: [
      "https://images.unsplash.com/photo-1605651202774-7d573fd3f12d?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1514517220017-8ce97a34a7b6?auto=format&fit=crop&q=80&w=1000"
    ],
    specs: {
      burnTime: "12 Hours per Diya",
      dimensions: "16in Diameter Bowl + 6 Floating Diyas",
      material: "Pure Brass & Jasmine Scented Soy Wax",
      fragranceNotes: ["Mogra Jasmine", "Fresh Marigold", "Vetiver"]
    },
    description: "A showstopping brass Urli bowl with intricate floral engravings accompanied by 6 hand-poured lotus-shaped floating soy diyas scented with fresh mogra.",
    artisanStory: "Hammered using century-old brass metalwork techniques in Moradabad.",
    inStock: true,
    featured: true
  },
  {
    id: "prabha-04",
    name: "Minimalist Terracotta Vinayaka",
    subtitle: "Hand-Molded Matte Clay Idol",
    category: "idols",
    price: 4400,
    originalPrice: 5000,
    rating: 4.9,
    reviewsCount: 64,
    tag: "Artisan Made",
    images: [
      "https://images.unsplash.com/photo-1567157577867-05ccb1388e66?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1609137144813-7d9921338f24?auto=format&fit=crop&q=80&w=1000"
    ],
    specs: {
      dimensions: "10in Height x 7in Width",
      material: "Natural River Clay & Raw Mineral Pigments",
    },
    description: "An elegant, contemporary interpretation of Lord Ganesha sculpted with organic river clay, featuring clean geometric contours and a smooth matte earthen finish.",
    artisanStory: "Hand-molded in small batches using eco-friendly natural terracotta.",
    inStock: true,
    featured: true
  },
  {
    id: "prabha-05",
    name: "Architectural Fluted Pillar Trio",
    subtitle: "Textured Soy Wax Columns",
    category: "candles",
    price: 2999,
    originalPrice: 3800,
    rating: 4.7,
    reviewsCount: 53,
    tag: "Modern Luxe",
    images: [
      "https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1596434300655-e48d3ff3dd5e?auto=format&fit=crop&q=80&w=1000"
    ],
    specs: {
      burnTime: "45 Hours each",
      dimensions: "Set of 3 (6in, 8in, 10in Heights)",
      material: "Unbleached Organic Soy & Organic Wicks",
      fragranceNotes: ["Cedarwood", "Wild Amber", "Neroli"]
    },
    description: "Architectural fluted column candles designed to add sleek vertical luxury to your festive centerpieces.",
    artisanStory: "Slow poured in temperature-controlled wooden molds for flawless satin finish.",
    inStock: true,
    featured: false
  },
  {
    id: "prabha-06",
    name: "Surya Dev Radiant Sunburst Mural",
    subtitle: "Antique Bronze & Clay Relief",
    category: "murals",
    price: 24500,
    originalPrice: 28000,
    rating: 5.0,
    reviewsCount: 19,
    tag: "Masterpiece",
    images: [
      "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&q=80&w=1000"
    ],
    specs: {
      dimensions: "30in x 30in Circular Canvas",
      material: "Reinforced Clay, Antique Bronze Wash & Gold Leaf",
    },
    description: "A breathtaking circular wall relief displaying the solar rays of Surya Dev. Creates dynamic shadows under warm ambient room lighting.",
    artisanStory: "Requires over 40 hours of intricate hand carving and gilding.",
    inStock: true,
    featured: false
  },
  {
    id: "prabha-07",
    name: "Vintage Brass Kuber Diya Stand",
    subtitle: "Multi-Tier Heritage Lamp",
    category: "diyas",
    price: 6800,
    originalPrice: 7999,
    rating: 4.9,
    reviewsCount: 77,
    tag: "Heritage Craft",
    images: [
      "https://images.unsplash.com/photo-1514517220017-8ce97a34a7b6?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1605651202774-7d573fd3f12d?auto=format&fit=crop&q=80&w=1000"
    ],
    specs: {
      dimensions: "18in Height, 5 Tiers",
      material: "Heavy Gauge Cast Brass",
    },
    description: "Traditional 5-tier Kubera Oil Lamp hand-carved with peacock motifs, designed to cast warm geometric light patterns across dark festive spaces.",
    artisanStory: "Cast using traditional lost-wax sand casting methods in Kumbakonam.",
    inStock: true,
    featured: false
  },
  {
    id: "prabha-08",
    name: "The Imperial Minakshi Festive Hamper",
    subtitle: "Complete Royal Diwali Gift Box",
    category: "hampers",
    price: 12999,
    originalPrice: 15500,
    rating: 5.0,
    reviewsCount: 112,
    tag: "Ultimate Gift Box",
    images: [
      "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=1000"
    ],
    specs: {
      dimensions: "Velvet Teak Wood Box (18in x 14in x 6in)",
      material: "Velvet, Teak Wood, Organic Soy, Pure Brass",
      fragranceNotes: ["Saffron Royal", "Mogra Blossom", "Sandalwood Incense"]
    },
    description: "The hallmark of Diwali gifting: includes 1 Ganesha Diya Candle, 4 Floating Lotus Diyas, 1 Miniature Relief Mural, Pure Brass Bell, and organic Saffron-Cardamom tea elixir.",
    artisanStory: "Handcrafted velvet box with engraved brass clasp.",
    inStock: true,
    featured: true
  }
];

export const HAMPER_OPTIONS = {
  boxes: [
    { id: "box-wood", name: "Eco-Luxe Teak Wood Box", price: 1500, image: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&q=80&w=400", desc: "Solid reclaimed teak with engraved brass filigree" },
    { id: "box-velvet", name: "Royal Maroon Velvet Box", price: 1800, image: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=400", desc: "Plush velvet interior with gold tassel closure" }
  ],
  candleTrios: [
    { id: "trio-lotus", name: "Sacred Lotus Saffron Trio", price: 2499, image: "https://images.unsplash.com/photo-1602874801007-bd458bb1b8b6?auto=format&fit=crop&q=80&w=400", desc: "Saffron, Cardamom, and Royal Sandalwood aromas" },
    { id: "trio-marigold", name: "Royal Marigold & Jasmine Trio", price: 2299, image: "https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&q=80&w=400", desc: "Hand-poured with mogra petals and gold leaf dust" },
    { id: "trio-brass", name: "Hand-Poured Brass Diya Trio", price: 2899, image: "https://images.unsplash.com/photo-1605651202774-7d573fd3f12d?auto=format&fit=crop&q=80&w=400", desc: "Reusable solid brass diyas filled with soy wax" }
  ],
  additions: [
    { id: "add-ganesha", name: "Terracotta Ganesha Keepsake", price: 1200, image: "https://images.unsplash.com/photo-1567157577867-05ccb1388e66?auto=format&fit=crop&q=80&w=400" },
    { id: "add-mural", name: "Miniature Relief Mural (6in)", price: 2100, image: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&q=80&w=400" },
    { id: "add-card", name: "24K Gold Foil Handwritten Card", price: 350, image: "https://images.unsplash.com/photo-1582562124811-c09040d0a901?auto=format&fit=crop&q=80&w=400" }
  ]
};
