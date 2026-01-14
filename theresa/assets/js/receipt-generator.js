// receipt-generator.js
// Generates and downloads PDF receipts

function generateReceiptPDF(orderData, download = true) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    // Theme colors
    const primaryColor = [255, 140, 0]; // Orange
    const darkColor = [33, 37, 41]; // Dark
    const lightColor = [248, 249, 250]; // Light
    
    // Add logo and header
    doc.setFillColor(...primaryColor);
    doc.rect(0, 0, 210, 40, 'F');
    
    // Add logo text
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('THEREZ~VIVA', 105, 20, { align: 'center' });
    
    // Receipt title
    doc.setTextColor(...darkColor);
    doc.setFontSize(18);
    doc.text('ORDER RECEIPT', 105, 55, { align: 'center' });
    
    // Order details section
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    
    // Order info table
    const startY = 70;
    let currentY = startY;
    
    // Order ID
    doc.setFont('helvetica', 'bold');
    doc.text('Order ID:', 20, currentY);
    doc.setFont('helvetica', 'normal');
    doc.text(orderData.orderId, 60, currentY);
    
    // Date
    currentY += 8;
    doc.setFont('helvetica', 'bold');
    doc.text('Date:', 20, currentY);
    doc.setFont('helvetica', 'normal');
    const orderDate = new Date(orderData.timestamp);
    doc.text(orderDate.toLocaleString(), 60, currentY);
    
    // Customer info
    currentY += 8;
    doc.setFont('helvetica', 'bold');
    doc.text('Customer:', 20, currentY);
    doc.setFont('helvetica', 'normal');
    doc.text(orderData.customerName, 60, currentY);
    
    currentY += 8;
    doc.setFont('helvetica', 'bold');
    doc.text('Phone:', 20, currentY);
    doc.setFont('helvetica', 'normal');
    doc.text(orderData.customerPhone, 60, currentY);
    
    // Delivery address
    currentY += 8;
    doc.setFont('helvetica', 'bold');
    doc.text('Delivery:', 20, currentY);
    doc.setFont('helvetica', 'normal');
    doc.text(`${orderData.area}, ${orderData.street}`, 60, currentY);
    
    if (orderData.landmark) {
        currentY += 8;
        doc.text(`Landmark: ${orderData.landmark}`, 60, currentY);
    }
    
    // Items table header
    currentY += 15;
    doc.setFillColor(...primaryColor);
    doc.rect(20, currentY, 170, 8, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.text('Item', 25, currentY + 6);
    doc.text('Qty', 120, currentY + 6, { align: 'right' });
    doc.text('Price', 150, currentY + 6, { align: 'right' });
    doc.text('Total', 180, currentY + 6, { align: 'right' });
    
    // Items list
    currentY += 8;
    doc.setTextColor(...darkColor);
    doc.setFont('helvetica', 'normal');
    
    orderData.items.forEach((item, index) => {
        if (currentY > 250) {
            doc.addPage();
            currentY = 20;
        }
        
        const itemTotal = item.price * item.quantity;
        
        doc.text(item.name, 25, currentY + 6);
        doc.text(item.quantity.toString(), 120, currentY + 6, { align: 'right' });
        doc.text(`₦${item.price.toLocaleString()}`, 150, currentY + 6, { align: 'right' });
        doc.text(`₦${itemTotal.toLocaleString()}`, 180, currentY + 6, { align: 'right' });
        
        currentY += 8;
        
        // Add separator line
        if (index < orderData.items.length - 1) {
            doc.setDrawColor(200, 200, 200);
            doc.line(20, currentY, 190, currentY);
            currentY += 4;
        }
    });
    
    // Summary section
    currentY += 10;
    doc.setDrawColor(...primaryColor);
    doc.setLineWidth(0.5);
    doc.line(110, currentY, 190, currentY);
    
    currentY += 8;
    doc.setFont('helvetica', 'bold');
    doc.text('Subtotal:', 120, currentY, { align: 'right' });
    doc.setFont('helvetica', 'normal');
    doc.text(`₦${orderData.subtotal.toLocaleString()}`, 190, currentY, { align: 'right' });
    
    currentY += 8;
    doc.setFont('helvetica', 'bold');
    doc.text('Tax (7.5%):', 120, currentY, { align: 'right' });
    doc.setFont('helvetica', 'normal');
    doc.text(`₦${orderData.tax.toLocaleString()}`, 190, currentY, { align: 'right' });
    
    currentY += 8;
    doc.setFont('helvetica', 'bold');
    doc.text('Total:', 120, currentY, { align: 'right' });
    doc.setFontSize(12);
    doc.text(`₦${orderData.total.toLocaleString()}`, 190, currentY, { align: 'right' });
    
    // Footer note
    currentY += 20;
    doc.setFontSize(9);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(100, 100, 100);
    doc.text('Thank you for your order!', 105, currentY, { align: 'center' });
    currentY += 5;
    doc.text('Please bring this receipt when picking up your order.', 105, currentY, { align: 'center' });
    currentY += 5;
    doc.text('For inquiries, contact: +234 705 445 0242', 105, currentY, { align: 'center' });
    
    // Company info
    currentY += 15;
    doc.setFontSize(8);
    doc.text('THEREZ~VIVA • Plot 16, Block 33, Woji Estate Road, Port Harcourt', 105, currentY, { align: 'center' });
    
    // Save or open PDF
    const fileName = `Receipt_${orderData.orderId}.pdf`;
    
    if (download) {
        doc.save(fileName);
    } else {
        // Open in new tab
        const pdfOutput = doc.output('blob');
        const pdfUrl = URL.createObjectURL(pdfOutput);
        window.open(pdfUrl, '_blank');
        setTimeout(() => URL.revokeObjectURL(pdfUrl), 100);
    }
}

// Export function for global use
window.generateReceiptPDF = generateReceiptPDF;