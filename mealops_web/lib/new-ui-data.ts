export type MessType = 'VEG' | 'NON-VEG';

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  type: MessType;
  category: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack';
  image: string;
  tags: string[];
}

export interface FeedbackEntry {
  id: string;
  date: string;
  dish: string;
  sentiment: 'POS' | 'NEG';
  comment: string;
  block: string;
}

export const MENU_ITEMS: MenuItem[] = [
  {
    id: '1',
    name: 'Artisan Avocado Toast',
    description: 'Toasted sourdough topped with smashed organic avocados, heirloom cherry tomatoes, and pumpkin seeds.',
    calories: 420,
    protein: 12,
    carbs: 38,
    fats: 24,
    type: 'VEG',
    category: 'Breakfast',
    image: 'https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?auto=format&fit=crop&w=1200&q=80',
    tags: ['Fiber', 'Healthy Fats'],
  },
  {
    id: '2',
    name: 'Greek Berry Parfait',
    description: 'Thick probiotic yogurt layered with wildflower honey, toasted oats, and seasonal berries.',
    calories: 310,
    protein: 18,
    carbs: 42,
    fats: 6,
    type: 'VEG',
    category: 'Breakfast',
    image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=1200&q=80',
    tags: ['Antioxidant'],
  },
  {
    id: '3',
    name: 'Nordic Salmon Bowl',
    description: 'Miso-glazed salmon over quinoa with charred broccoli and sesame-dressed edamame.',
    calories: 580,
    protein: 34,
    carbs: 45,
    fats: 22,
    type: 'NON-VEG',
    category: 'Lunch',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1200&q=80',
    tags: ['Lean Protein'],
  },
  {
    id: '4',
    name: 'Garden Basil Pesto',
    description: 'Whole-grain penne tossed in basil pesto, parmesan, and sun-dried tomatoes.',
    calories: 520,
    protein: 15,
    carbs: 64,
    fats: 28,
    type: 'VEG',
    category: 'Dinner',
    image: 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=1200&q=80',
    tags: ['Whole Grain'],
  },
  {
    id: '5',
    name: 'Quinoa & Roasted Chickpea Bowl',
    description: 'Fresh meals curated for your metabolic profile.',
    calories: 420,
    protein: 18,
    carbs: 52,
    fats: 12,
    type: 'VEG',
    category: 'Lunch',
    image: 'https://images.unsplash.com/photo-1543332164-6e82f355bad5?auto=format&fit=crop&w=1200&q=80',
    tags: ['18g Protein', '52g Carbs', '12g Fiber'],
  },
  {
    id: '6',
    name: 'Garden Harvest Tabbouleh',
    description: 'Bright and crisp tabbouleh with herbs, lemon, and olive oil.',
    calories: 310,
    protein: 8,
    carbs: 35,
    fats: 5,
    type: 'VEG',
    category: 'Lunch',
    image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=1200&q=80',
    tags: ['8g Protein', '35g Carbs', 'Low Fat'],
  },
];

export const FEEDBACK_ENTRIES: FeedbackEntry[] = [
  {
    id: 'f1',
    date: 'Oct 24, 12:30',
    dish: 'Butter Chicken',
    sentiment: 'POS',
    comment: 'Best meal of the week so far, loved the spice balance.',
    block: 'Block A',
  },
  {
    id: 'f2',
    date: 'Oct 24, 13:15',
    dish: 'Steamed Tapioca',
    sentiment: 'NEG',
    comment: 'A bit too dry today. Needed more curry accompaniment.',
    block: 'Block C',
  },
  {
    id: 'f3',
    date: 'Oct 23, 19:45',
    dish: 'Paneer Tikka',
    sentiment: 'POS',
    comment: 'Perfectly grilled. Thank you for the extra lime!',
    block: 'Block B',
  },
];