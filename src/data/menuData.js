// ============================================================
// STARVING — Complete Menu Data
// All items with dedicated high-resolution studio food photography
// Served from Images/Items folder
// ============================================================

// Common add-ons available for customization
const COMMON_ADDONS = [
  { id: 'extra-sauce',   name: 'Extra Sauce',   price: 50  },
  { id: 'extra-cheese',  name: 'Extra Cheese',  price: 80  },
  { id: 'extra-spicy',   name: 'Extra Spicy',   price: 30  },
  { id: 'garlic-bread',  name: 'Garlic Bread',  price: 100 },
];

const PIZZA_ADDONS = [
  { id: 'extra-cheese',  name: 'Extra Cheese',  price: 150 },
  { id: 'extra-toppings',name: 'Extra Toppings',price: 120 },
  { id: 'stuffed-crust', name: 'Stuffed Crust', price: 200 },
  { id: 'extra-sauce',   name: 'Extra Sauce',   price: 60  },
];

const BURGER_ADDONS = [
  { id: 'extra-patty',   name: 'Extra Patty',   price: 150 },
  { id: 'extra-cheese',  name: 'Extra Cheese',  price: 80  },
  { id: 'extra-sauce',   name: 'Extra Sauce',   price: 50  },
  { id: 'jalapenos',     name: 'Jalapeños',     price: 40  },
];

const WINGS_ADDONS = [
  { id: 'extra-sauce',   name: 'Extra Sauce',   price: 60  },
  { id: 'blue-cheese',   name: 'Blue Cheese Dip', price: 80 },
  { id: 'ranch-dip',     name: 'Ranch Dip',     price: 70  },
];

export const menuData = [
  // ============================================================
  // DRINKS
  // ============================================================
  {
    id: 'cold-drink',
    name: 'Cold Drink',
    category: 'Drinks',
    description: 'Chilled Coca-Cola to complement your meal perfectly.',
    image: '/Items/cold-drink.jpeg',
    isAvailable: true,
    isPopular: false,
    isFeatured: false,
    variants: [
      { size: 'Regular', label: 'Regular (300ml)', price: 100, originalPrice: 120 },
      { size: '500ml',   label: '500ml Bottle',    price: 120, originalPrice: 150 },
      { size: '1.5ltr',  label: '1.5 Ltr Bottle',  price: 200, originalPrice: 220 },
    ],
    addons: [],
  },

  // ============================================================
  // SIDES & FRIES
  // ============================================================
  {
    id: 'fries',
    name: 'Fries',
    category: 'Sides',
    description: 'Golden crispy fries, lightly salted — the perfect sidekick for every meal.',
    image: '/Items/fries.jpeg',
    isAvailable: true,
    isPopular: true,
    isFeatured: false,
    variants: [
      { size: 'Regular', label: 'Regular', price: 100, originalPrice: 150 },
      { size: 'Large',   label: 'Large',   price: 150, originalPrice: 250 },
      { size: 'Family',  label: 'Family',  price: 250, originalPrice: 350 },
    ],
    addons: [
      { id: 'extra-sauce', name: 'Extra Sauce', price: 50 },
    ],
  },
  {
    id: 'loaded-pizza-fries',
    name: 'Loaded Pizza Fries',
    category: 'Sides',
    description: 'Crispy fries loaded with pizza sauce, mozzarella, and toppings. A fan favorite!',
    image: '/Items/loaded-pizza-fries.jpeg',
    isAvailable: true,
    isPopular: true,
    isFeatured: true,
    variants: [
      { size: 'Small', label: 'Small', price: 450, originalPrice: 550 },
      { size: 'Large', label: 'Large', price: 700, originalPrice: 950 },
    ],
    addons: [
      { id: 'extra-cheese',  name: 'Extra Cheese',  price: 100 },
      { id: 'extra-toppings',name: 'Extra Toppings', price: 80  },
    ],
  },
  {
    id: 'loaded-mayo-fries',
    name: 'Loaded Mayo Fries',
    category: 'Sides',
    description: 'Golden fries smothered in our signature creamy mayo sauce.',
    image: '/Items/loaded-mayo-fries.jpeg',
    isAvailable: true,
    isPopular: false,
    isFeatured: false,
    variants: [
      { size: 'Small', label: 'Small', price: 350, originalPrice: 450 },
      { size: 'Large', label: 'Large', price: 600, originalPrice: 800 },
    ],
    addons: [
      { id: 'extra-mayo', name: 'Extra Mayo', price: 50 },
    ],
  },

  // ============================================================
  // ROLLS & WRAPS
  // ============================================================
  {
    id: 'starving-signature-roll',
    name: 'Starving Signature Roll',
    category: 'Rolls',
    description: 'Our crown jewel. Packed with premium fillings and our legendary Starving sauce. Prepared with love for kings.',
    image: '/Items/starving-signature-roll.jpeg',
    isAvailable: true,
    isPopular: true,
    isFeatured: true,
    variants: [
      { size: 'Regular', label: 'Regular', price: 750, originalPrice: 1000 },
    ],
    addons: [...COMMON_ADDONS],
  },
  {
    id: 'chicken-roll',
    name: 'Chicken Roll',
    category: 'Rolls',
    description: 'Tender chicken wrapped in a fresh roll with our signature sauces and fresh veggies.',
    image: '/Items/chicken-roll.jpeg',
    isAvailable: true,
    isPopular: true,
    isFeatured: false,
    variants: [
      { size: 'Regular', label: 'Regular', price: 300, originalPrice: 450 },
    ],
    addons: [...COMMON_ADDONS],
  },
  {
    id: 'crunch-factor-roll',
    name: 'Crunch Factor Roll',
    category: 'Rolls',
    description: 'Super crispy chicken with crunch factor sauce — every bite crackles with flavor.',
    image: '/Items/crunch-factor-roll.jpeg',
    isAvailable: true,
    isPopular: true,
    isFeatured: true,
    variants: [
      { size: 'Large', label: 'Large', price: 400, originalPrice: 550 },
      { size: 'XL',    label: 'XL',    price: 550, originalPrice: 700 },
    ],
    addons: [...COMMON_ADDONS],
  },
  {
    id: 'boom-boom-fusion-roll',
    name: 'Boom Boom Fusion Roll',
    category: 'Rolls',
    description: 'Boom! A fiery fusion of spices, crispy chicken, and our iconic boom-boom sauce. Warning: highly addictive.',
    image: '/Items/boom-boom-fusion-roll.jpeg',
    isAvailable: true,
    isPopular: true,
    isFeatured: true,
    variants: [
      { size: 'Regular', label: 'Regular', price: 400, originalPrice: 550 },
      { size: 'Large',   label: 'Large',   price: 430, originalPrice: 580 },
      { size: 'Medium',  label: 'Medium',  price: 650, originalPrice: 700 },
      { size: 'XL',      label: 'XL',      price: 595, originalPrice: 730 },
    ],
    addons: [...COMMON_ADDONS],
  },
  {
    id: 'bbq-chicken-burrito',
    name: 'BBQ Chicken Burrito',
    category: 'Rolls',
    description: 'Smoky BBQ chicken, rice, and fresh veggies folded into a perfectly wrapped burrito.',
    image: '/Items/bbq-chicken-burrito.jpeg',
    isAvailable: true,
    isPopular: false,
    isFeatured: false,
    variants: [
      { size: 'Regular', label: 'Regular', price: 695, originalPrice: 900 },
    ],
    addons: [...COMMON_ADDONS],
  },
  {
    id: 'smoky-bihari-wrap',
    name: 'Smoky Bihari Wrap',
    category: 'Wraps',
    description: 'Tender Bihari-spiced chicken grilled to smoky perfection, wrapped with fresh veggies.',
    image: '/Items/smoky-bihari-wrap.jpeg',
    isAvailable: true,
    isPopular: false,
    isFeatured: false,
    variants: [
      { size: 'Regular', label: 'Regular', price: 595, originalPrice: 800 },
    ],
    addons: [...COMMON_ADDONS],
  },
  {
    id: 'crunch-factor-wrap',
    name: 'Crunch Factor Wrap',
    category: 'Wraps',
    description: 'All the crunch you love in a wrap format — crispy chicken with crunch factor sauce.',
    image: '/Items/crunch-factor-wrap.jpeg',
    isAvailable: true,
    isPopular: false,
    isFeatured: false,
    variants: [
      { size: 'Regular', label: 'Regular', price: 550, originalPrice: 750 },
    ],
    addons: [...COMMON_ADDONS],
  },
  {
    id: 'flame-grilled-twister-wrap',
    name: 'Flame Grilled Twister Wrap',
    category: 'Wraps',
    description: 'Flame-grilled chicken twisted into a premium wrap with tangy slaw and signature dressing.',
    image: '/Items/flame-grilled-twister-wrap.jpeg',
    isAvailable: true,
    isPopular: true,
    isFeatured: false,
    variants: [
      { size: 'Regular', label: 'Regular', price: 595, originalPrice: 800 },
    ],
    addons: [...COMMON_ADDONS],
  },
  {
    id: 'arabian-night-wrap',
    name: 'Arabian Night Wrap',
    category: 'Wraps',
    description: 'An exotic blend of Middle Eastern spices with grilled chicken and garlic sauce.',
    image: '/Items/arabian-night-wrap.jpeg',
    isAvailable: true,
    isPopular: false,
    isFeatured: false,
    variants: [
      { size: 'Regular', label: 'Regular', price: 595, originalPrice: 800 },
    ],
    addons: [...COMMON_ADDONS],
  },

  // ============================================================
  // PIZZAS
  // ============================================================
  {
    id: 'ultimate-cheese',
    name: 'Ultimate Cheese',
    category: 'Pizza',
    description: 'A cheese lover\'s dream — four premium cheeses melted to golden perfection on our hand-tossed base.',
    image: '/Items/ultimate-cheese.jpeg',
    isAvailable: true,
    isPopular: true,
    isFeatured: true,
    variants: [
      { size: 'Small',  label: 'Small (7")',  price: 650,  originalPrice: 850  },
      { size: 'Medium', label: 'Medium (10")',price: 1295, originalPrice: 1500 },
      { size: 'Large',  label: 'Large (12")', price: 1695, originalPrice: 1900 },
      { size: 'XL',     label: 'XL (14")',    price: 2095, originalPrice: 2300 },
    ],
    addons: [...PIZZA_ADDONS],
  },
  {
    id: 'smoked-chicken-fajita',
    name: 'Smoked Chicken Fajita',
    category: 'Pizza',
    description: 'Smoky grilled chicken, bell peppers, and fajita seasoning on a rich tomato base.',
    image: '/Items/smoked-chicken-fajita.jpeg',
    isAvailable: true,
    isPopular: true,
    isFeatured: true,
    variants: [
      { size: 'Small',  label: 'Small (7")',  price: 650,  originalPrice: 900  },
      { size: 'Medium', label: 'Medium (10")',price: 1295, originalPrice: 1500 },
      { size: 'Large',  label: 'Large (12")', price: 1695, originalPrice: 1900 },
      { size: 'XL',     label: 'XL (14")',    price: 2095, originalPrice: 2300 },
    ],
    addons: [...PIZZA_ADDONS],
  },
  {
    id: 'fiery-tikka-fusion',
    name: 'Fiery Tikka Fusion',
    category: 'Pizza',
    description: 'Marinated tikka chicken with a fiery spice blend. East meets West in every slice.',
    image: '/Items/fiery-tikka-fusion.jpeg',
    isAvailable: true,
    isPopular: true,
    isFeatured: true,
    variants: [
      { size: 'Small',  label: 'Small (7")',  price: 650,  originalPrice: 900  },
      { size: 'Medium', label: 'Medium (10")',price: 1295, originalPrice: 1500 },
      { size: 'Large',  label: 'Large (12")', price: 1695, originalPrice: 1900 },
      { size: 'XL',     label: 'XL (14")',    price: 2095, originalPrice: 2300 },
    ],
    addons: [...PIZZA_ADDONS],
  },
  {
    id: 'creamy-malai-boti',
    name: 'Creamy Malai Boti',
    category: 'Pizza',
    description: 'Tender malai boti chunks bathed in a creamy white sauce with herbs. Purely indulgent.',
    image: '/Items/creamy-malai-boti.jpeg',
    isAvailable: true,
    isPopular: false,
    isFeatured: false,
    variants: [
      { size: 'Small',  label: 'Small (7")',  price: 695,  originalPrice: 900  },
      { size: 'Medium', label: 'Medium (10")',price: 1350, originalPrice: 1550 },
      { size: 'Large',  label: 'Large (12")', price: 1795, originalPrice: 2000 },
      { size: 'XL',     label: 'XL (14")',    price: 2295, originalPrice: 2500 },
    ],
    addons: [...PIZZA_ADDONS],
  },
  {
    id: 'cheese-crust',
    name: 'Cheese Crust',
    category: 'Pizza',
    description: 'Indulge in our special cheese-stuffed crust — every bite of the edge is as good as the center.',
    image: '/Items/cheese-crust.jpeg',
    isAvailable: true,
    isPopular: false,
    isFeatured: false,
    variants: [
      { size: 'Medium', label: 'Medium (10")',price: 1450, originalPrice: 1650 },
      { size: 'Large',  label: 'Large (12")', price: 1850, originalPrice: 2050 },
      { size: 'XL',     label: 'XL (14")',    price: 2395, originalPrice: 2600 },
    ],
    addons: [...PIZZA_ADDONS],
  },
  {
    id: 'seekh-kabab-crust',
    name: 'Seekh Kabab Crust',
    category: 'Pizza',
    description: 'Minced seekh kabab filling in every bite of our signature stuffed crust. A desi delight.',
    image: '/Items/seekh-kabab-crust.jpeg',
    isAvailable: true,
    isPopular: false,
    isFeatured: false,
    variants: [
      { size: 'Medium', label: 'Medium (10")',price: 1450, originalPrice: 1650 },
      { size: 'Large',  label: 'Large (12")', price: 1850, originalPrice: 2050 },
      { size: 'XL',     label: 'XL (14")',    price: 2395, originalPrice: 2600 },
    ],
    addons: [...PIZZA_ADDONS],
  },
  {
    id: 'royal-crown-crust',
    name: 'Royal Crown Crust',
    category: 'Pizza',
    description: 'Our most premium crust pizza — fit for royalty. Multiple cheese stuffed crust with premium toppings.',
    image: '/Items/royal-crown-crust.jpeg',
    isAvailable: true,
    isPopular: true,
    isFeatured: false,
    variants: [
      { size: 'Medium', label: 'Medium (10")',price: 1450, originalPrice: 1650 },
      { size: 'Large',  label: 'Large (12")', price: 1850, originalPrice: 2150 },
      { size: 'XL',     label: 'XL (14")',    price: 2395, originalPrice: 2595 },
    ],
    addons: [...PIZZA_ADDONS],
  },
  {
    id: 'starving-signature-pizza',
    name: 'Starving Signature Pizza',
    category: 'Pizza',
    description: 'Our legendary signature pizza — a closely guarded recipe with premium toppings that\'s been satisfying kings since day one.',
    image: '/Items/starving-signature-pizza.jpeg',
    isAvailable: true,
    isPopular: true,
    isFeatured: true,
    variants: [
      { size: 'Medium', label: 'Medium (10")',price: 1495, originalPrice: 1650 },
      { size: 'Large',  label: 'Large (12")', price: 1895, originalPrice: 2050 },
      { size: 'XL',     label: 'XL (14")',    price: 2495, originalPrice: 2700 },
    ],
    addons: [...PIZZA_ADDONS],
  },

  // ============================================================
  // WINGS & CHICKEN
  // ============================================================
  {
    id: 'crispy-chicken-piece',
    name: 'Crispy Chicken Piece',
    category: 'Wings',
    description: 'One perfectly seasoned, crispy fried chicken piece. Golden, juicy, and irresistible.',
    image: '/Items/crispy-chicken-piece.jpeg',
    isAvailable: true,
    isPopular: true,
    isFeatured: false,
    variants: [
      { size: '1 pc', label: '1 Piece', price: 240, originalPrice: 350 },
    ],
    addons: [...WINGS_ADDONS],
  },
  {
    id: 'bbq-wings',
    name: 'BBQ Wings',
    category: 'Wings',
    description: 'Saucy, sticky, smoky BBQ glazed chicken wings. Finger-licking doesn\'t begin to describe it.',
    image: '/Items/bbq-wings.jpeg',
    isAvailable: true,
    isPopular: true,
    isFeatured: true,
    variants: [
      { size: '6 pcs',  label: '6 Pieces',  price: 595,  originalPrice: 750  },
      { size: '12 pcs', label: '12 Pieces', price: 1095, originalPrice: 1250 },
    ],
    addons: [...WINGS_ADDONS],
  },
  {
    id: 'hot-wings',
    name: 'Hot Wings',
    category: 'Wings',
    description: 'Fiery crispy wings drenched in our signature hot sauce. Not for the faint-hearted.',
    image: '/Items/hot-wings.jpeg',
    isAvailable: true,
    isPopular: true,
    isFeatured: false,
    variants: [
      { size: '6 pcs',  label: '6 Pieces',  price: 550, originalPrice: 700  },
      { size: '12 pcs', label: '12 Pieces', price: 995, originalPrice: 1200 },
    ],
    addons: [...WINGS_ADDONS],
  },
  {
    id: 'hot-shots',
    name: 'Hot Shots',
    category: 'Wings',
    description: 'Bite-sized crispy hot shots — the ultimate shareable snack. Perfectly seasoned, fiercely addictive.',
    image: '/Items/hot-shots.jpeg',
    isAvailable: true,
    isPopular: false,
    isFeatured: false,
    variants: [
      { size: '6 pcs',  label: '6 Pieces',  price: 450, originalPrice: 600  },
      { size: '12 pcs', label: '12 Pieces', price: 850, originalPrice: 1050 },
    ],
    addons: [...WINGS_ADDONS],
  },

  // ============================================================
  // PASTA
  // ============================================================
  {
    id: 'crunchy-chicken-pasta',
    name: 'Crunchy Chicken Pasta',
    category: 'Pasta',
    description: 'Creamy pasta tossed with crunchy chicken pieces and our house sauce. Comfort food elevated.',
    image: '/Items/crunchy-chicken-pasta.jpeg',
    isAvailable: true,
    isPopular: false,
    isFeatured: false,
    variants: [
      { size: 'Small', label: 'Small', price: 450, originalPrice: 560  },
      { size: 'Large', label: 'Large', price: 795, originalPrice: 1000 },
    ],
    addons: [
      { id: 'extra-cheese', name: 'Extra Cheese', price: 100 },
      { id: 'garlic-bread', name: 'Garlic Bread', price: 120 },
    ],
  },
  {
    id: 'fettuccine-alfredo',
    name: 'Fettuccine Alfredo',
    category: 'Pasta',
    description: 'Classic Italian fettuccine in rich, velvety Alfredo sauce. Pure, indulgent simplicity.',
    image: '/Items/fettuccine-alfredo.jpeg',
    isAvailable: true,
    isPopular: false,
    isFeatured: false,
    variants: [
      { size: 'Small', label: 'Small', price: 495, originalPrice: 600  },
      { size: 'Large', label: 'Large', price: 895, originalPrice: 1050 },
    ],
    addons: [
      { id: 'extra-cheese', name: 'Extra Cheese', price: 100 },
      { id: 'garlic-bread', name: 'Garlic Bread', price: 120 },
    ],
  },
  {
    id: 'classic-alfredo',
    name: 'Classic Alfredo Pasta',
    category: 'Pasta',
    description: 'Our take on the timeless Alfredo — creamy, buttery, and absolutely satisfying.',
    image: '/Items/classic-alfredo.jpeg',
    isAvailable: true,
    isPopular: true,
    isFeatured: false,
    variants: [
      { size: 'Small', label: 'Small', price: 495, originalPrice: 600  },
      { size: 'Large', label: 'Large', price: 895, originalPrice: 1050 },
    ],
    addons: [
      { id: 'extra-cheese', name: 'Extra Cheese', price: 100 },
      { id: 'garlic-bread', name: 'Garlic Bread', price: 120 },
    ],
  },

  // ============================================================
  // BURGERS
  // ============================================================
  {
    id: 'double-dragon-burger',
    name: 'Double Dragon Burger',
    category: 'Burgers',
    description: 'Beef double patty with BBQ sauce, crispy onions, cheese, and our signature dragon spread. Fire-breathing flavor.',
    image: '/Items/double-dragon-burger.jpeg',
    isAvailable: true,
    isPopular: true,
    isFeatured: true,
    variants: [
      { size: 'Regular', label: 'Regular', price: 850, originalPrice: 1050 },
    ],
    addons: [...BURGER_ADDONS],
  },
  {
    id: 'smashed-sensation',
    name: 'Smashed Sensation',
    category: 'Burgers',
    description: 'Double beef smash patties with caramelized crust, special sauce, and premium toppings. A full sensory experience.',
    image: '/Items/smashed-sensation.jpeg',
    isAvailable: true,
    isPopular: true,
    isFeatured: true,
    variants: [
      { size: 'Regular', label: 'Regular', price: 895, originalPrice: 1100 },
    ],
    addons: [...BURGER_ADDONS],
  },
  {
    id: 'classic-beef-burger',
    name: 'Classic Beef Burger',
    category: 'Burgers',
    description: 'Grilled beef patty with special sauce, fresh lettuce, tomato, and pickles. The timeless classic.',
    image: '/Items/classic-beef-burger.jpeg',
    isAvailable: true,
    isPopular: false,
    isFeatured: false,
    variants: [
      { size: 'Regular', label: 'Regular', price: 495, originalPrice: 600 },
    ],
    addons: [...BURGER_ADDONS],
  },
  {
    id: 'smoky-house-grilled',
    name: 'Smoky House (Grilled)',
    category: 'Burgers',
    description: 'Chicken grilled fillet with BBQ sauce, crispy onions, and cheddar. Smoky house special.',
    image: '/Items/smoky-house-grilled.jpeg',
    isAvailable: true,
    isPopular: false,
    isFeatured: false,
    variants: [
      { size: 'Regular', label: 'Regular', price: 495, originalPrice: 600 },
    ],
    addons: [...BURGER_ADDONS],
  },
  {
    id: 'zesty-tangy-grilled',
    name: 'Zesty Tangy (Grilled)',
    category: 'Burgers',
    description: 'Chicken grilled fillet with tangy sauce, fresh coleslaw, and a zesty kick.',
    image: '/Items/zesty-tangy-grilled.jpeg',
    isAvailable: true,
    isPopular: false,
    isFeatured: false,
    variants: [
      { size: 'Regular', label: 'Regular', price: 495, originalPrice: 600 },
    ],
    addons: [...BURGER_ADDONS],
  },
  {
    id: 'signature-grilled',
    name: 'Signature Grilled',
    category: 'Burgers',
    description: 'Chicken grilled fillet with our signature special sauce. Simple, clean, unforgettable.',
    image: '/Items/signature-grilled.jpeg',
    isAvailable: true,
    isPopular: false,
    isFeatured: false,
    variants: [
      { size: 'Regular', label: 'Regular', price: 550, originalPrice: 650 },
    ],
    addons: [...BURGER_ADDONS],
  },
  {
    id: 'tikka-spice-fusion',
    name: 'Tikka Spice Fusion',
    category: 'Burgers',
    description: 'Tandoori spiced fried chicken with tikka sauce and fresh onions. Desi flavors, global format.',
    image: '/Items/tikka-spice-fusion.jpeg',
    isAvailable: true,
    isPopular: true,
    isFeatured: false,
    variants: [
      { size: 'Regular', label: 'Regular', price: 350, originalPrice: 450 },
    ],
    addons: [...BURGER_ADDONS],
  },
  {
    id: 'prime-patty',
    name: 'Prime Patty',
    category: 'Burgers',
    description: 'Crispy chicken patty with mayo, fresh lettuce, and our house sauce. An everyday favorite.',
    image: '/Items/prime-patty.jpeg',
    isAvailable: true,
    isPopular: false,
    isFeatured: false,
    variants: [
      { size: 'Regular', label: 'Regular', price: 300, originalPrice: 400 },
    ],
    addons: [...BURGER_ADDONS],
  },
  {
    id: 'colossal-crunch',
    name: 'Colossal Crunch',
    category: 'Burgers',
    description: 'Double layer crispy fried chicken stacked high with our special colossal sauce. Go big or go home.',
    image: '/Items/colossal-crunch.jpeg',
    isAvailable: true,
    isPopular: true,
    isFeatured: true,
    variants: [
      { size: 'Regular', label: 'Regular', price: 699, originalPrice: 800 },
    ],
    addons: [...BURGER_ADDONS],
  },
  {
    id: 'crunchy-classic-burger',
    name: 'Crunchy Classic Burger',
    category: 'Burgers',
    description: 'Crispy fried chicken with spiced crunch coating, pickles, and classic burger sauce.',
    image: '/Items/crunchy-classic-burger.jpeg',
    isAvailable: true,
    isPopular: false,
    isFeatured: false,
    variants: [
      { size: 'Regular', label: 'Regular', price: 395, originalPrice: 450 },
    ],
    addons: [...BURGER_ADDONS],
  },
];

// Category definitions with icons & order
export const categories = [
  { id: 'all',     label: 'All Items', icon: '🍽️' },
  { id: 'Burgers', label: 'Burgers',   icon: '🍔' },
  { id: 'Pizza',   label: 'Pizza',     icon: '🍕' },
  { id: 'Rolls',   label: 'Rolls',     icon: '🌯' },
  { id: 'Wraps',   label: 'Wraps',     icon: '🫔' },
  { id: 'Wings',   label: 'Wings',     icon: '🍗' },
  { id: 'Pasta',   label: 'Pasta',     icon: '🍝' },
  { id: 'Sides',   label: 'Sides',     icon: '🍟' },
  { id: 'Drinks',  label: 'Drinks',    icon: '🥤' },
];

// Featured items for homepage carousel
export const featuredItems = menuData.filter(item => item.isFeatured);

// Popular items
export const popularItems = menuData.filter(item => item.isPopular);

export default menuData;
