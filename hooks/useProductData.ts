import { useState, useEffect, useMemo } from 'react';
import type { RawProduct, ProcessedProduct } from '../types';

const processData = (data: RawProduct[]): ProcessedProduct[] => {
  const cleanAndParsePrice = (price: string | null): number => {
    if (!price) return 0;
    return parseFloat(price.replace(/[^0-9.]/g, '')) || 0;
  };

  const cleanAndParseRating = (rating: string | null): number => {
    if (!rating) return 0;
    return parseFloat(rating) || 0;
  };

  const cleanAndParseNumberOfRatings = (num: string): number => {
    if (!num) return 0;
    return parseInt(num.replace(/,/g, ''), 10) || 0;
  };

  // Calculate average rating for imputation, ignoring invalid or missing values
  let totalRating = 0;
  let ratingCount = 0;
  data.forEach(p => {
    const rating = cleanAndParseRating(p.ratings);
    if (rating > 0 && rating <= 5) { // Only consider valid ratings for the average
      totalRating += rating;
      ratingCount++;
    }
  });
  const averageRating = ratingCount > 0 ? totalRating / ratingCount : 3.5; // Default to 3.5 if no ratings exist

  return data
    .map((p, index) => {
      const actual_price = cleanAndParsePrice(p.actual_price);
      const discount_price = cleanAndParsePrice(p.discount_price);
      let ratings = cleanAndParseRating(p.ratings);
      const no_of_ratings = cleanAndParseNumberOfRatings(p.no_of_ratings);
      
      // Drop rows with missing essential data
      if (!p.name || actual_price <= 0 || !p.main_category) {
        return null;
      }

      // Impute missing/invalid ratings and validate range
      if (ratings <= 0 || ratings > 5) {
        ratings = averageRating;
      }
      
      const discount_percentage = actual_price > 0 && discount_price > 0 && discount_price < actual_price
        ? ((actual_price - discount_price) / actual_price) * 100
        : 0;
      
      const estimated_demand = no_of_ratings * ratings;
      
      return {
        id: `${p.name}-${index}`,
        name: p.name,
        main_category: p.main_category,
        sub_category: p.sub_category,
        image: p.image || `https://picsum.photos/seed/${index}/200/200`,
        link: p.link,
        ratings,
        no_of_ratings,
        discount_price,
        actual_price,
        discount_percentage: Math.max(0, Math.min(100, discount_percentage)), // Clamp between 0-100
        estimated_demand,
      };
    })
    .filter((p): p is ProcessedProduct => p !== null);
};


export const useProductData = (rawData: RawProduct[]) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processedData, setProcessedData] = useState<ProcessedProduct[]>([]);

  useEffect(() => {
    setLoading(true);
    setError(null);
    try {
      const data = processData(rawData);
      setProcessedData(data);
    } catch (e) {
      console.error("Failed to process product data:", e);
      setError("Failed to process product data.");
    } finally {
      setLoading(false);
    }
  }, [rawData]);

  const { categories, subCategories } = useMemo(() => {
    const categorySet = new Set<string>();
    const subCategorySet = new Set<string>();
    processedData.forEach(p => {
      categorySet.add(p.main_category);
      subCategorySet.add(p.sub_category);
    });
    return {
      categories: Array.from(categorySet).sort(),
      subCategories: Array.from(subCategorySet).sort(),
    };
  }, [processedData]);

  return { loading, error, processedData, categories, subCategories };
};