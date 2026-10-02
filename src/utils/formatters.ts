import { Receipt, SchoolSettings } from '../types';

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
}

export function formatDate(dateString: string): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
}

export function formatDateTime(isoString: string): string {
  if (!isoString) return '';
  const date = new Date(isoString);
  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

export function cleanPhoneNumber(phone: string): string {
  // Remove non-digits
  const digits = phone.replace(/\D/g, '');
  // If 10 digits, prepend 91 for India
  if (digits.length === 10) {
    return `91${digits}`;
  }
  // If already starts with 91 and has 12 digits
  if (digits.length === 12 && digits.startsWith('91')) {
    return digits;
  }
  return digits;
}

/**
 * Constructs the canonical public digital receipt URL with a clean path extension.
 * Example: https://<domain>/bill/TIMDS-2026-0001
 */
export function getDigitalReceiptUrl(receipt: Receipt): string {
  const cleanNumber = receipt.receiptNumber.replace(/^#/, '').trim();
  if (typeof window !== 'undefined' && window.location.origin) {
    return `${window.location.origin}/bill/${encodeURIComponent(cleanNumber)}`;
  }
  return `/bill/${encodeURIComponent(cleanNumber)}`;
}

/**
 * Constructs the complete formatted WhatsApp message with receipt summary and online digital bill link.
 */
export function generateWhatsAppMessage(receipt: Receipt, settings: SchoolSettings, customUrl?: string): string {
  const isPaid = receipt.paymentStatus === 'PAID';
  const statusEmoji = isPaid ? '✅' : '⏳';
  const statusText = isPaid ? 'FULLY PAID' : (receipt.paymentStatus === 'PARTIAL' ? 'PARTIALLY PAID (BALANCE DUE)' : 'PAYMENT PENDING');
  const digitalBillUrl = customUrl || getDigitalReceiptUrl(receipt);

  const lines = [
    `🚗 *${settings.name}*`,
    `✨ _${settings.tagline}_`,
    `📍 ${settings.address}, ${settings.city}`,
    `📞 ${settings.primaryPhone} | ${settings.secondaryPhone}`,
    `----------------------------------------`,
    `📄 *OFFICIAL DIGITAL FEE RECEIPT*`,
    `Receipt No: *#${receipt.receiptNumber}*`,
    `Date: ${formatDate(receipt.date)}`,
    `Student: *${receipt.studentName}*`,
    receipt.phone ? `Phone: ${receipt.phone}` : '',
    receipt.applicationNo ? `App No: ${receipt.applicationNo}` : '',
    receipt.learningLicenseNumber ? `LLR No: ${receipt.learningLicenseNumber}` : '',
    `Course: *${receipt.courseName}*`,
    `Vehicle: ${receipt.vehicleType}`,
    receipt.batchTiming ? `Batch Timing: ${receipt.batchTiming}` : '',
    `----------------------------------------`,
    `💰 *FEE BREAKDOWN:*`,
    `• Course Training Fee: ${formatCurrency(receipt.courseFee)}`,
    receipt.rtoGovtFee > 0 ? `• RTO Govt & Test Fees: ${formatCurrency(receipt.rtoGovtFee)}` : '',
    receipt.discount > 0 ? `• Concession / Discount: -${formatCurrency(receipt.discount)}` : '',
    `• Total Package Amount: *${formatCurrency(receipt.totalAmount)}*`,
    `• Amount Paid: *${formatCurrency(receipt.amountPaid)}*`,
    `• Balance Remaining: *${formatCurrency(receipt.balanceAmount)}*`,
    `----------------------------------------`,
    `Status: ${statusEmoji} *${statusText}*`,
    receipt.balanceAmount > 0 ? `⚠️ *Please clear pending balance of ${formatCurrency(receipt.balanceAmount)} before driving test.*` : '🎉 *Fee settlement complete.*',
    `----------------------------------------`,
    `🌐 *CLICK HERE TO VIEW YOUR DIGITAL BILL & DOWNLOAD PDF:*`,
    `${digitalBillUrl}`,
    `----------------------------------------`,
    `💳 *UPI Payment ID:* ${settings.upiId} (${settings.upiName})`,
    `Thank you for choosing Thanima Iykarayil MDS! Learn to drive safely and with confidence.`
  ].filter(Boolean);

  return lines.join('\n');
}

/**
 * Universal WhatsApp share link (works on mobile app and redirects cleanly on desktop)
 */
export function getWhatsAppShareUrl(phone: string, message: string): string {
  const cleaned = cleanPhoneNumber(phone);
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${cleaned}?text=${encoded}`;
}

/**
 * Dedicated WhatsApp Web link to open directly in web.whatsapp.com on desktop browsers
 */
export function getWhatsAppWebUrl(phone: string, message: string): string {
  const cleaned = cleanPhoneNumber(phone);
  const encoded = encodeURIComponent(message);
  return `https://web.whatsapp.com/send?phone=${cleaned}&text=${encoded}`;
}

/**
 * Master helper function in the receipt generation flow that constructs:
 * - The digital receipt link
 * - The formatted WhatsApp message
 * - The WhatsApp Web direct link
 * - The universal mobile/app WhatsApp link
 */
export function constructWhatsAppReceiptLink(
  receipt: Receipt,
  settings: SchoolSettings,
  targetPhone?: string
): {
  message: string;
  digitalReceiptUrl: string;
  whatsAppWebUrl: string;
  universalWhatsAppUrl: string;
} {
  const phoneToUse = targetPhone || receipt.phone;
  const digitalReceiptUrl = getDigitalReceiptUrl(receipt);
  const message = generateWhatsAppMessage(receipt, settings, digitalReceiptUrl);
  const whatsAppWebUrl = getWhatsAppWebUrl(phoneToUse, message);
  const universalWhatsAppUrl = getWhatsAppShareUrl(phoneToUse, message);

  return {
    message,
    digitalReceiptUrl,
    whatsAppWebUrl,
    universalWhatsAppUrl
  };
}

export function generateUpiQrUrl(upiId: string, name: string, amount: number, note: string): string {
  const upiString = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(name)}&am=${amount}&cu=INR&tn=${encodeURIComponent(note)}`;
  return `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(upiString)}&margin=10`;
}
