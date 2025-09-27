
import { Point } from '../types';

export const parsePoints = (input: string): Point[] => {
  if (!input.trim()) {
    return [];
  }

  // 1. Sanitize: remove brackets, replace commas with spaces.
  const sanitized = input
    .replace(/[\[\]\(\)\{\}]/g, ' ')
    .replace(/,/g, ' ');

  // 2. Split into numbers, filter out empty strings, and parse.
  const numbers = sanitized
    .split(/[\s\n]+/)
    .filter(s => s.length > 0)
    .map(s => parseFloat(s));

  // 3. Validate numbers.
  if (numbers.some(isNaN)) {
    throw new Error("Invalid input: Contains non-numeric values.");
  }

  if (numbers.length % 2 !== 0) {
    throw new Error("Invalid input: An odd number of coordinates were found. Please provide pairs.");
  }
  
  // 4. Group into points.
  const points: Point[] = [];
  for (let i = 0; i < numbers.length; i += 2) {
    points.push({ x: numbers[i], y: numbers[i + 1] });
  }

  return points;
};
