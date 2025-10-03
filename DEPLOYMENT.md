# Deployment Guide for Vercel

## Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **GitHub Repository**: Ensure your code is pushed to GitHub
3. **Environment Variables**: Set up required environment variables

## Required Environment Variables

Set these environment variables in your Vercel project settings:

### Required Variables:
- `OPENAI_API_KEY` - Your OpenAI API key for chat functionality
- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anonymous key

### Optional Variables:
- `BACKEND_URL` - Your backend API URL (default: http://localhost:8080)
- `BACKEND_SECRET` - Backend authentication secret

## Deployment Steps

### Method 1: Vercel Dashboard (Recommended)

1. **Connect Repository**:
   - Go to [vercel.com/dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import your GitHub repository

2. **Configure Project**:
   - Framework Preset: Next.js
   - Root Directory: `./` (default)
   - Build Command: `npm run build`
   - Output Directory: `.next` (default)

3. **Set Environment Variables**:
   - Go to Project Settings → Environment Variables
   - Add all required variables listed above

4. **Deploy**:
   - Click "Deploy"
   - Wait for build to complete

### Method 2: Vercel CLI

1. **Install Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy**:
   ```bash
   vercel --prod
   ```

4. **Set Environment Variables**:
   ```bash
   vercel env add OPENAI_API_KEY
   vercel env add NEXT_PUBLIC_SUPABASE_URL
   vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
   ```

## Post-Deployment

1. **Test the Application**:
   - Visit your deployed URL
   - Test authentication
   - Test chat functionality
   - Test grammar/vocabulary features

2. **Configure Custom Domain** (Optional):
   - Go to Project Settings → Domains
   - Add your custom domain

## Troubleshooting

### Common Issues:

1. **Build Failures**:
   - Check environment variables are set correctly
   - Ensure all dependencies are in package.json
   - Check build logs for specific errors

2. **API Errors**:
   - Verify OPENAI_API_KEY is valid
   - Check Supabase configuration
   - Ensure backend URL is accessible

3. **Authentication Issues**:
   - Verify Supabase URL and keys
   - Check CORS settings in Supabase

## Environment Variables Reference

```bash
# Required for chat functionality
OPENAI_API_KEY=sk-...

# Required for authentication
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...

# Optional backend configuration
BACKEND_URL=https://your-backend.vercel.app
BACKEND_SECRET=your-secret-key
```

## Production Checklist

- [ ] Environment variables configured
- [ ] Domain configured (if needed)
- [ ] SSL certificate active
- [ ] Authentication working
- [ ] Chat functionality working
- [ ] All features tested
- [ ] Performance optimized
- [ ] Error monitoring set up

## Support

For deployment issues:
1. Check Vercel build logs
2. Verify environment variables
3. Test locally with production build
4. Contact Vercel support if needed
