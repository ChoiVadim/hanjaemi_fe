# Testing Study Page Without Changing Supabase URL

This guide explains how to test your study page without modifying the Supabase dashboard URL settings.

## Method 1: Environment-Based Redirect URLs (Recommended)

### Setup
1. Copy `env.example` to `.env.local`:
   ```bash
   cp env.example .env.local
   ```

2. Set your redirect URL in `.env.local`:
   ```env
   NEXT_PUBLIC_REDIRECT_URL=http://localhost:3000/auth/callback?next=/study
   ```

3. Update your Supabase OAuth providers to include both URLs:
   - Go to Supabase Dashboard → Authentication → URL Configuration
   - Add both URLs to "Redirect URLs":
     - `http://localhost:3000/auth/callback`
     - `https://your-production-domain.com/auth/callback`

### Benefits
- ✅ No need to change Supabase settings for each test
- ✅ Works in both development and production
- ✅ Environment-specific configuration
- ✅ Fallback to current origin if not set

## Method 2: Use ngrok for External Testing

### Setup
1. Install ngrok:
   ```bash
   npm install -g ngrok
   # or
   brew install ngrok
   ```

2. Start your Next.js app:
   ```bash
   npm run dev
   ```

3. In another terminal, expose your local server:
   ```bash
   ngrok http 3000
   ```

4. Use the ngrok URL (e.g., `https://abc123.ngrok.io`) in your Supabase redirect URLs

### Benefits
- ✅ Test with real external URLs
- ✅ Share with others for testing
- ✅ Test mobile devices
- ✅ Test OAuth flows end-to-end

## Method 3: Mock Authentication for Development

Create a development-only bypass for testing:

### Setup
1. Add to your `.env.local`:
   ```env
   NODE_ENV=development
   NEXT_PUBLIC_MOCK_AUTH=true
   ```

2. Update your middleware to bypass auth in development:
   ```typescript
   // In middleware.ts
   if (process.env.NEXT_PUBLIC_MOCK_AUTH === 'true' && process.env.NODE_ENV === 'development') {
     // Skip authentication for testing
     return supabaseResponse;
   }
   ```

### Benefits
- ✅ Skip authentication entirely for testing
- ✅ Fast iteration on UI/UX
- ✅ No OAuth setup required

## Method 4: Use Supabase CLI for Local Development

### Setup
1. Install Supabase CLI:
   ```bash
   npm install -g supabase
   ```

2. Initialize Supabase locally:
   ```bash
   supabase init
   supabase start
   ```

3. Use local Supabase instance for development

### Benefits
- ✅ Complete local Supabase instance
- ✅ No external dependencies
- ✅ Full database and auth testing

## Method 5: Temporary Supabase URL Update

If you need to test with a specific URL temporarily:

1. Go to Supabase Dashboard → Authentication → URL Configuration
2. Add your test URL to "Redirect URLs"
3. Test your application
4. Remove the test URL when done

### Benefits
- ✅ Quick testing with specific URLs
- ✅ No code changes required

## Recommended Testing Workflow

1. **For UI/UX testing**: Use Method 3 (Mock Auth)
2. **For OAuth flow testing**: Use Method 1 (Environment URLs)
3. **For external testing**: Use Method 2 (ngrok)
4. **For full integration testing**: Use Method 4 (Supabase CLI)

## Environment Variables Reference

```env
# Required
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Optional - for custom redirect URLs
NEXT_PUBLIC_REDIRECT_URL=http://localhost:3000/auth/callback?next=/study

# Optional - for development bypass
NEXT_PUBLIC_MOCK_AUTH=true
```

## Troubleshooting

### Common Issues
1. **Redirect URL mismatch**: Ensure the URL in your environment matches Supabase settings
2. **CORS errors**: Make sure your domain is whitelisted in Supabase
3. **Session not persisting**: Check cookie settings and domain configuration

### Debug Steps
1. Check browser console for OAuth errors
2. Verify environment variables are loaded correctly
3. Test with different browsers/incognito mode
4. Check Supabase logs for authentication attempts
