import { Product, Size } from '@/types';

export const WHATSAPP_CONFIG = {
  businessNumber: '1234567890', // Replace with actual WhatsApp business number
  businessName: 'Unique T-shirts',
};

interface OrderDetails {
  productName: string;
  productId: string;
  size: Size;
  color: string;
  price: number;
  quantity?: number;
  customerName?: string;
  customerEmail?: string;
}

export function generateWhatsAppMessage(orderDetails: OrderDetails): string {
  const { 
    productName, 
    productId, 
    size, 
    color, 
    price, 
    quantity = 1,
    customerName,
    customerEmail 
  } = orderDetails;

  const message = `
🛍️ *New Order Inquiry*

*Product:* ${productName}
*Product ID:* ${productId}
*Size:* ${size}
*Color:* ${color}
*Quantity:* ${quantity}
*Price:* ₹${price.toFixed(2)}
*Total:* ₹${(price * quantity).toFixed(2)}

${customerName ? `*Customer Name:* ${customerName}` : ''}
${customerEmail ? `*Email:* ${customerEmail}` : ''}

I'm interested in purchasing this item. Please confirm availability and next steps.
  `.trim();

  return encodeURIComponent(message);
}

export function createWhatsAppLink(orderDetails: OrderDetails): string {
  const message = generateWhatsAppMessage(orderDetails);
  return `https://wa.me/${WHATSAPP_CONFIG.businessNumber}?text=${message}`;
}

export function openWhatsAppCheckout(orderDetails: OrderDetails): void {
  const link = createWhatsAppLink(orderDetails);
  
  // Open in new window/tab
  if (typeof window !== 'undefined') {
    window.open(link, '_blank', 'noopener,noreferrer');
  }
}

// For tracking orders via WhatsApp
export function createTrackingMessage(orderId: string, customerName: string): string {
  const message = `
📦 *Order Tracking Request*

*Order ID:* ${orderId}
*Customer Name:* ${customerName}

I would like to track my order status. Please provide an update.
  `.trim();

  return encodeURIComponent(message);
}

export function openWhatsAppTracking(orderId: string, customerName: string): void {
  const message = createTrackingMessage(orderId, customerName);
  const link = `https://wa.me/${WHATSAPP_CONFIG.businessNumber}?text=${message}`;
  
  if (typeof window !== 'undefined') {
    window.open(link, '_blank', 'noopener,noreferrer');
  }
}
