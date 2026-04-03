export type MessType = 'VEG' | 'NON-VEG';

export interface User {
  id: string;
  name: string;
  role: 'student' | 'admin';
  messType: MessType;
  avatar: string;
}

export interface NutritionGoal {
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
}

export interface DailyIntake {
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
}

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

export interface MealLogEntry {
  id: string;
  dishId: string;
  dishName: string;
  calories: number;
  macros: { p: number; c: number; f: number };
  timestamp: string;
  portion: 'Full' | 'Half' | 'Skip';
  feedback?: string;
  comment?: string;
  image?: string;
}

export interface FeedbackEntry {
  id: string;
  date: string;
  dish: string;
  sentiment: 'POS' | 'NEG';
  comment: string;
  block: string;
}
