import { Product, Size } from '@/types';

export const WHATSAPP_CONFIG = {
  businessNumber: '8801919069898', // Rahikul Makhtum's WhatsApp
  businessName: 'Unique T-shirts',
  ownerName: 'Rahikul Makhtum',
  instagram: '@r_m_abir71',
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
  productUrl?: string;
  imageUrl?: string;
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
    customerEmail,
    productUrl,
    imageUrl,
  } = orderDetails;

  // Placing image URL first increases the chance WhatsApp shows a rich preview image
  const message = `
${imageUrl ? imageUrl + '\n\n' : ''}${productUrl ? productUrl + '\n\n' : ''}
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

// Bulk checkout for multiple wishlist items
export interface BulkOrderItem {
  productName: string;
  productId: string;
  size: Size;
  color: string;
  price: number;
  quantity?: number;
  productUrl?: string;
  imageUrl?: string;
}

export function generateWhatsAppBulkMessage(items: BulkOrderItem[]): string {
  const lines: string[] = [];
  const firstImage = items.find(i => i.imageUrl)?.imageUrl;
  if (firstImage) lines.push(firstImage + '\n');
  const firstLink = items.find(i => i.productUrl)?.productUrl;
  if (firstLink) lines.push(firstLink + '\n');

  lines.push('🛍️ *New Bulk Order Inquiry*');
  let total = 0;
  items.forEach((item, idx) => {
    const q = item.quantity ?? 1;
    const sub = item.price * q;
    total += sub;
    lines.push(`\n*Item ${idx + 1}*`);
    lines.push(`• Product: ${item.productName}`);
    lines.push(`• ID: ${item.productId}`);
    lines.push(`• Size: ${item.size}`);
    lines.push(`• Color: ${item.color}`);
    lines.push(`• Qty: ${q}`);
    lines.push(`• Price: ₹${item.price.toFixed(2)} | Subtotal: ₹${sub.toFixed(2)}`);
    if (item.productUrl) lines.push(`• Link: ${item.productUrl}`);
  });
  lines.push(`\n*Grand Total:* ₹${total.toFixed(2)}`);
  lines.push('\nPlease confirm availability and next steps.');

  return encodeURIComponent(lines.join('\n'));
}

export function openWhatsAppBulkCheckout(items: BulkOrderItem[]): void {
  const message = generateWhatsAppBulkMessage(items);
  const link = `https://wa.me/${WHATSAPP_CONFIG.businessNumber}?text=${message}`;
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
