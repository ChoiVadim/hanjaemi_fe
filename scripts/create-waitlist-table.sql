-- Create waitlist_emails table for collecting early access emails
CREATE TABLE IF NOT EXISTS public.waitlist_emails (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_waitlist_emails_email ON public.waitlist_emails(email);
CREATE INDEX IF NOT EXISTS idx_waitlist_emails_created_at ON public.waitlist_emails(created_at);

-- Enable Row Level Security
ALTER TABLE public.waitlist_emails ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to insert (for public waitlist signup)
CREATE POLICY "Allow public insert on waitlist_emails"
  ON public.waitlist_emails
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Create policy to allow service role to read all (for admin access)
CREATE POLICY "Allow service role to read waitlist_emails"
  ON public.waitlist_emails
  FOR SELECT
  TO service_role
  USING (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_waitlist_emails_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
DROP TRIGGER IF EXISTS update_waitlist_emails_updated_at ON public.waitlist_emails;
CREATE TRIGGER update_waitlist_emails_updated_at
  BEFORE UPDATE ON public.waitlist_emails
  FOR EACH ROW
  EXECUTE FUNCTION update_waitlist_emails_updated_at();

-- Grant necessary permissions
GRANT INSERT ON public.waitlist_emails TO anon, authenticated;
GRANT SELECT ON public.waitlist_emails TO service_role;

