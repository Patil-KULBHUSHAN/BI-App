import type { RawProduct } from '../types';

const parseCSVLine = (line: string): string[] => {
    const result: string[] = [];
    let currentField = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
        const char = line[i];

        if (char === '"') {
            // Check for escaped quote ("")
            if (inQuotes && line[i + 1] === '"') {
                currentField += '"';
                i++; // Skip the next quote
            } else {
                inQuotes = !inQuotes;
            }
        } else if (char === ',' && !inQuotes) {
            result.push(currentField);
            currentField = '';
        } else {
            currentField += char;
        }
    }
    result.push(currentField);
    return result.map(f => f.trim());
};


export const parseCSVToRawProducts = (csvText: string): RawProduct[] => {
  const lines = csvText.trim().replace(/\r\n/g, '\n').split('\n');
  if (lines.length < 2) {
    throw new Error("CSV must have a header row and at least one data row.");
  }
  
  const header = lines[0].split(',').map(h => h.trim());
  const requiredHeaders: string[] = [
    'name',
    'main_category',
    'sub_category',
    'ratings',
    'no_of_ratings',
    'discount_price',
    'actual_price'
  ];
  
  for(const req of requiredHeaders) {
    if(!header.includes(req)) {
      throw new Error(`Missing required CSV header: ${req}. Please ensure your file contains all required columns.`);
    }
  }

  const data = lines.slice(1).map((line) => {
    if (!line.trim()) return null; // Skip empty lines
    
    const values = parseCSVLine(line);
    const rowObject: { [key: string]: string } = {};
    
    header.forEach((key, index) => {
      rowObject[key] = values[index] ? values[index] : '';
    });
    
    const product: RawProduct = {
      name: rowObject.name || '',
      main_category: rowObject.main_category || '',
      sub_category: rowObject.sub_category || '',
      image: rowObject.image || '',
      link: rowObject.link || '',
      ratings: rowObject.ratings || null,
      no_of_ratings: rowObject.no_of_ratings || '0',
      discount_price: rowObject.discount_price || null,
      actual_price: rowObject.actual_price || null,
    };

    return product;
  }).filter((p): p is RawProduct => p !== null);

  if (data.length === 0) {
      throw new Error("No valid data rows found in the CSV file.");
  }

  return data;
};