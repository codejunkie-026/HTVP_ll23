// order-confirmation.js
// Handles WhatsApp notifications for completed orders

// SIMPLE VERSION - order-confirmation.js with items included
function sendOrderConfirmation(orderData) {
    // YOUR ADMIN'S WHATSAPP NUMBER (with country code, no +)
    const adminNumber = "2347054450242"; // REPLACE WITH ACTUAL NUMBER
    
    // Format message with items
    let message = `*NEW ORDER - THEREZ~VIVA*\n`;
    message += `Order ID: ${orderData.orderId}\n`;
    message += `Customer: ${orderData.customerName}\n`;
    message += `Phone: ${orderData.customerPhone}\n`;
    message += `Total: ₦${orderData.total.toLocaleString()}\n\n`;
    
    // ADD ITEMS LIST HERE
    message += `*Items Ordered:*\n`;
    
    // Check if items exist in orderData
    if (orderData.items && orderData.items.length > 0) {
        orderData.items.forEach((item, index) => {
            const itemTotal = item.price * item.quantity;
            message += `${index + 1}. ${item.name} x${item.quantity} = ₦${itemTotal.toLocaleString()}\n`;
        });
    } else {
        message += `No items listed\n`;
    }
    /*
    message += `\n*Delivery:* ${orderData.area}, ${orderData.street}`;
    
    // Add landmark if available
    if (orderData.landmark && orderData.landmark.trim() !== '') {
        message += `\n*Landmark:* ${orderData.landmark}`;
    }
    
    // Add instructions if available
    if (orderData.instructions && orderData.instructions.trim() !== '') {
        message += `\n*Instructions:* ${orderData.instructions}`;
    }   */
    
    // Add date/time
    const now = new Date();
    message += `\n*Order Time:* ${now.toLocaleString()}`;
    
    // Create URL
    const whatsappURL = `https://wa.me/${adminNumber}?text=${encodeURIComponent(message)}`;
    
    // SIMPLE METHOD: Create hidden link and click it
    const link = document.createElement('a');
    link.href = whatsappURL;
    link.target = '_blank';
    link.style.display = 'none';
    document.body.appendChild(link);
    
    // Click after a delay
    setTimeout(() => {
        link.click();
        
        // Remove after click
        setTimeout(() => {
            if (link.parentNode) {
                link.parentNode.removeChild(link);
            }
        }, 1000);
    }, 500);
    
    console.log('WhatsApp notification sent to:', adminNumber);
    console.log('Items sent:', orderData.items);
    return true;
}

window.sendOrderConfirmation = sendOrderConfirmation;

function sendWhatsAppNotification(whatsappURL) {
    try {
        // Method 1: Create a hidden iframe (most reliable for background sending)
        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        iframe.style.width = '0';
        iframe.style.height = '0';
        iframe.style.border = 'none';
        iframe.style.position = 'absolute';
        iframe.style.top = '-1000px';
        iframe.style.left = '-1000px';
        iframe.src = whatsappURL;
        
        document.body.appendChild(iframe);
        
        // Remove iframe after a short delay
        setTimeout(() => {
            if (iframe && iframe.parentNode) {
                iframe.parentNode.removeChild(iframe);
            }
        }, 3000);
        
        // Method 2: Alternative using window.open in hidden mode
        setTimeout(() => {
            const newWindow = window.open(whatsappURL, '_blank', 'width=1,height=1,top=-1000,left=-1000');
            if (newWindow) {
                setTimeout(() => {
                    try {
                        newWindow.close();
                    } catch (e) {
                        console.log('Window already closed');
                    }
                }, 1000);
            }
        }, 500);
        
        // Method 3: Use an image pixel as fallback
        const pixel = document.createElement('img');
        pixel.style.display = 'none';
        pixel.src = whatsappURL.replace('wa.me', 'web.whatsapp.com');
        document.body.appendChild(pixel);
        
        setTimeout(() => {
            if (pixel && pixel.parentNode) {
                pixel.parentNode.removeChild(pixel);
            }
        }, 2000);
        
        console.log('WhatsApp notification methods triggered');
        return true;
        
    } catch (error) {
        console.error('Error in WhatsApp notification:', error);
        return false;
    }
}

function showUserNotification(message) {
    try {
        // Create notification element
        const notification = document.createElement('div');
        notification.id = 'order-notification';
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #ff8c00, #ff6b00);
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
            z-index: 99999;
            font-family: Arial, sans-serif;
            font-size: 14px;
            max-width: 300px;
            animation: slideInRight 0.3s ease;
            border-left: 4px solid #28a745;
        `;
        
        // Add icon and message
        notification.innerHTML = `
            <div style="display: flex; align-items: center; gap: 10px;">
                <i class="bi bi-check-circle-fill" style="font-size: 18px;"></i>
                <div>
                    <strong style="display: block; margin-bottom: 5px;">Order Confirmed!</strong>
                    <span>${message}</span>
                </div>
            </div>
        `;
        
        // Add animation style
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideInRight {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
        `;
        document.head.appendChild(style);
        
        // Add to document
        document.body.appendChild(notification);
        
        // Remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'slideInRight 0.3s ease reverse';
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.parentNode.removeChild(notification);
                    }
                }, 300);
            }
            if (style.parentNode) {
                style.parentNode.removeChild(style);
            }
        }, 5000);
        
    } catch (error) {
        console.log('Simple notification fallback:', message);
    }
}

// Test function to verify WhatsApp works
function testWhatsAppNotification() {
    const testOrder = {
        orderId: 'TV' + Date.now().toString().slice(-6),
        customerName: 'Test Customer',
        customerPhone: '08012345678',
        area: 'Test Area',
        street: 'Test Street',
        items: [
            { name: 'Test Item 1', quantity: 2, price: 1000 },
            { name: 'Test Item 2', quantity: 1, price: 500 }
        ],
        subtotal: 2500,
        tax: 187.5,
        total: 2687.5,
        timestamp: new Date().toISOString()
    };
    
    return sendOrderConfirmation(testOrder);
}

// Make functions available globally
window.sendOrderConfirmation = sendOrderConfirmation;
window.testWhatsAppNotification = testWhatsAppNotification;