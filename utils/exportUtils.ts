
import type { ProcessedProduct } from '../types';

declare const jspdf: any;

export const downloadCSV = (data: ProcessedProduct[]) => {
  if (data.length === 0) {
    alert("No data to export.");
    return;
  }
  
  const headers = [
    'Name', 'Main Category', 'Sub Category', 'Rating', 
    'Number of Ratings', 'Discount Price', 'Actual Price', 'Discount Percentage'
  ];
  
  const rows = data.map(p => [
    `"${p.name.replace(/"/g, '""')}"`,
    p.main_category,
    p.sub_category,
    p.ratings,
    p.no_of_ratings,
    p.discount_price,
    p.actual_price,
    p.discount_percentage.toFixed(2)
  ].join(','));
  
  const csvContent = "data:text/csv;charset=utf-8," 
    + [headers.join(','), ...rows].join('\n');
    
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "sales_analytics_report.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const downloadPDF = (data: ProcessedProduct[]) => {
  if (data.length === 0) {
    alert("No data to export.");
    return;
  }

  const { jsPDF } = jspdf;
  const doc = new jsPDF();
  
  doc.text("Sales Analytics Report", 14, 16);
  
  const tableColumn = ["Name", "Category", "Rating", "Price", "Discount"];
  const tableRows: (string | number)[][] = [];

  data.forEach(p => {
    const productData = [
      p.name,
      p.main_category,
      p.ratings.toFixed(1),
      `₹${p.actual_price.toLocaleString()}`,
      `${p.discount_percentage.toFixed(0)}%`
    ];
    tableRows.push(productData);
  });

  doc.autoTable({
    head: [tableColumn],
    body: tableRows,
    startY: 20,
    theme: 'grid',
    styles: { fontSize: 8 },
    headStyles: { fillColor: [22, 160, 133] },
    columnStyles: {
      0: { cellWidth: 80 }
    }
  });

  doc.save("sales_analytics_report.pdf");
};
