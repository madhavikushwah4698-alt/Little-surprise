/**
 * Configured WhatsApp recipient number for the final wish screen.
 */
export const YOUR_WHATSAPP_NUMBER = '918878871157';

/**
 * Number of "No" clicks required to reveal the final wish-writing screen.
 */
export const NO_CLICKS_FOR_FINAL_WISH = 21;

/**
 * Formats the configured phone number (removing spaces/special characters when
 * a real number is supplied) and builds an official WhatsApp click-to-chat URL
 * that works seamlessly on both desktop and mobile devices.
 */
export function buildWhatsAppClickToChatUrl(
  configuredNumber: string,
  message: string
): string {
  const trimmedNumber = configuredNumber.trim();
  const formattedNumber =
    trimmedNumber === 'YOUR_WHATSAPP_NUMBER'
      ? 'YOUR_WHATSAPP_NUMBER'
      : trimmedNumber.replace(/\D/g, '') || 'YOUR_WHATSAPP_NUMBER';

  return `https://wa.me/${formattedNumber}?text=${encodeURIComponent(message)}`;
}
