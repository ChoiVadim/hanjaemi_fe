/**
 * Telegram Bot API utility functions
 */

interface TelegramMessage {
  chat_id: string | number;
  text: string;
  parse_mode?: 'HTML' | 'Markdown' | 'MarkdownV2';
}

/**
 * Send a message to Telegram chat
 */
export async function sendTelegramMessage(
  botToken: string,
  chatId: string | number,
  message: string
): Promise<boolean> {
  try {
    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
    
    const payload: TelegramMessage = {
      chat_id: chatId,
      text: message,
      parse_mode: 'HTML',
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Telegram API error:', errorData);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error sending Telegram message:', error);
    return false;
  }
}

/**
 * Format waitlist notification message
 */
export function formatWaitlistNotification(
  email: string,
  totalCount: number
): string {
  return `
🎉 <b>New Waitlist Signup!</b>

📧 Email: <code>${email}</code>
📊 Total signups: <b>${totalCount}</b>

Time: ${new Date().toLocaleString('en-US', { 
  timeZone: 'UTC',
  dateStyle: 'medium',
  timeStyle: 'short'
})} UTC
  `.trim();
}

