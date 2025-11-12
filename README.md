# HanJaemi Frontend

## Waitlist Setup

Before deploying, you need to create the waitlist table in Supabase:

1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Run the SQL script from `scripts/create-waitlist-table.sql`

This will create the `waitlist_emails` table that stores early access signups.

The main page (`/`) now shows a waitlist signup form where users can leave their email to be notified when HanJaemi launches.

## Telegram Notifications Setup

To receive Telegram notifications when someone joins the waitlist:

1. **Get your Telegram Bot Token** (you already have it: `8070927825:AAHmo3Pmlci5v7jT917fITt_1bTBEOO0vZo`)

2. **Get your Chat ID**:
   - Start a chat with your bot on Telegram
   - Send a message to your bot
   - Visit: `https://api.telegram.org/bot8070927825:AAHmo3Pmlci5v7jT917fITt_1bTBEOO0vZo/getUpdates`
   - Look for `"chat":{"id":123456789}` in the response - that's your chat ID

3. **Add to environment variables**:
   ```env
   TELEGRAM_BOT_TOKEN=8070927825:AAHmo3Pmlci5v7jT917fITt_1bTBEOO0vZo
   TELEGRAM_CHAT_ID=your_chat_id_here
   ```

4. The bot will automatically send notifications with:
   - The email address that signed up
   - The total count of waitlist signups
   - Timestamp of the signup 
