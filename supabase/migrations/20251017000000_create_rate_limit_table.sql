-- Create rate_limit table for persistent rate limiting
CREATE TABLE IF NOT EXISTS rate_limit (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ip_address INET NOT NULL,
  request_count INTEGER DEFAULT 1,
  last_request TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create unique index on IP address for efficient lookups
CREATE UNIQUE INDEX IF NOT EXISTS idx_rate_limit_ip ON rate_limit(ip_address);

-- Create index on last_request for cleanup
CREATE INDEX IF NOT EXISTS idx_rate_limit_last_request ON rate_limit(last_request);

-- Enable Row Level Security
ALTER TABLE rate_limit ENABLE ROW LEVEL SECURITY;

-- Create policies (allow insert and update for everyone, but only select for service role)
CREATE POLICY "Rate limit entries can be inserted by anyone" ON rate_limit
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Rate limit entries can be updated by anyone" ON rate_limit
  FOR UPDATE USING (true);

CREATE POLICY "Rate limit entries can be selected by service role" ON rate_limit
  FOR SELECT USING (current_setting('role') = 'service_role');

-- Grant permissions
GRANT INSERT, UPDATE ON rate_limit TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON rate_limit TO service_role;