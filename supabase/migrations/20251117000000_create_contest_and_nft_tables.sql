-- Create contests table
CREATE TABLE IF NOT EXISTS contests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  cover_image TEXT,
  prize_pool NUMERIC(10, 2) DEFAULT 0.00,
  prize_currency TEXT DEFAULT 'TON',
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE,
  status TEXT DEFAULT 'draft', -- draft, active, ended
  category TEXT,
  difficulty TEXT,
  rules TEXT,
  created_by_user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create contest_entries table
CREATE TABLE IF NOT EXISTS contest_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contest_id UUID REFERENCES contests(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  remix_id UUID, -- Reference to the remix created for this contest
  title TEXT,
  description TEXT,
  audio_url TEXT,
  cover_image TEXT,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_winner BOOLEAN DEFAULT false,
  prize_awarded NUMERIC(10, 2) DEFAULT 0.00,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create contest_votes table
CREATE TABLE IF NOT EXISTS contest_votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entry_id UUID REFERENCES contest_entries(id) ON DELETE CASCADE,
  voter_id UUID REFERENCES users(id) ON DELETE CASCADE,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  voted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(entry_id, voter_id)
);

-- Create nft_collections table
CREATE TABLE IF NOT EXISTS nft_collections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  cover_image TEXT,
  creator_id UUID REFERENCES users(id) ON DELETE CASCADE,
  blockchain TEXT DEFAULT 'TON',
  royalty_percentage INTEGER DEFAULT 10,
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create nfts table
CREATE TABLE IF NOT EXISTS nfts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  collection_id UUID REFERENCES nft_collections(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  audio_url TEXT,
  metadata JSONB,
  creator_id UUID REFERENCES users(id) ON DELETE CASCADE,
  owner_id UUID REFERENCES users(id) ON DELETE CASCADE,
  price NUMERIC(10, 2) DEFAULT 0.00,
  currency TEXT DEFAULT 'TON',
  is_listed BOOLEAN DEFAULT false,
  is_auction BOOLEAN DEFAULT false,
  auction_end_time TIMESTAMP WITH TIME ZONE,
  current_bid NUMERIC(10, 2) DEFAULT 0.00,
  highest_bidder_id UUID REFERENCES users(id) ON DELETE SET NULL,
  royalty_percentage INTEGER DEFAULT 10,
  blockchain TEXT DEFAULT 'TON',
  token_id TEXT,
  transaction_hash TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create nft_bids table
CREATE TABLE IF NOT EXISTS nft_bids (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nft_id UUID REFERENCES nfts(id) ON DELETE CASCADE,
  bidder_id UUID REFERENCES users(id) ON DELETE CASCADE,
  amount NUMERIC(10, 2) NOT NULL,
  status TEXT DEFAULT 'active', -- active, accepted, rejected
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_contests_status ON contests(status);
CREATE INDEX IF NOT EXISTS idx_contests_category ON contests(category);
CREATE INDEX IF NOT EXISTS idx_contests_created_by ON contests(created_by_user_id);
CREATE INDEX IF NOT EXISTS idx_contest_entries_contest ON contest_entries(contest_id);
CREATE INDEX IF NOT EXISTS idx_contest_entries_user ON contest_entries(user_id);
CREATE INDEX IF NOT EXISTS idx_contest_votes_entry ON contest_votes(entry_id);
CREATE INDEX IF NOT EXISTS idx_contest_votes_voter ON contest_votes(voter_id);
CREATE INDEX IF NOT EXISTS idx_nft_collections_creator ON nft_collections(creator_id);
CREATE INDEX IF NOT EXISTS idx_nfts_collection ON nfts(collection_id);
CREATE INDEX IF NOT EXISTS idx_nfts_creator ON nfts(creator_id);
CREATE INDEX IF NOT EXISTS idx_nfts_owner ON nfts(owner_id);
CREATE INDEX IF NOT EXISTS idx_nfts_listed ON nfts(is_listed);
CREATE INDEX IF NOT EXISTS idx_nfts_auction ON nfts(is_auction);
CREATE INDEX IF NOT EXISTS idx_nft_bids_nft ON nft_bids(nft_id);
CREATE INDEX IF NOT EXISTS idx_nft_bids_bidder ON nft_bids(bidder_id);

-- Enable Row Level Security
ALTER TABLE contests ENABLE ROW LEVEL SECURITY;
ALTER TABLE contest_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE contest_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE nft_collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE nfts ENABLE ROW LEVEL SECURITY;
ALTER TABLE nft_bids ENABLE ROW LEVEL SECURITY;

-- Create policies for contests
CREATE POLICY "Contests are viewable by everyone" ON contests
  FOR SELECT USING (true);

CREATE POLICY "Users can create contests" ON contests
  FOR INSERT WITH CHECK (auth.uid() = created_by_user_id);

CREATE POLICY "Users can update their own contests" ON contests
  FOR UPDATE USING (auth.uid() = created_by_user_id);

-- Create policies for contest_entries
CREATE POLICY "Contest entries are viewable by everyone" ON contest_entries
  FOR SELECT USING (true);

CREATE POLICY "Users can submit contest entries" ON contest_entries
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own contest entries" ON contest_entries
  FOR UPDATE USING (auth.uid() = user_id);

-- Create policies for contest_votes
CREATE POLICY "Contest votes are viewable by everyone" ON contest_votes
  FOR SELECT USING (true);

CREATE POLICY "Users can vote on contest entries" ON contest_votes
  FOR INSERT WITH CHECK (auth.uid() = voter_id);

-- Create policies for nft_collections
CREATE POLICY "NFT collections are viewable by everyone" ON nft_collections
  FOR SELECT USING (true);

CREATE POLICY "Users can create NFT collections" ON nft_collections
  FOR INSERT WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "Users can update their own NFT collections" ON nft_collections
  FOR UPDATE USING (auth.uid() = creator_id);

-- Create policies for nfts
CREATE POLICY "NFTs are viewable by everyone" ON nfts
  FOR SELECT USING (true);

CREATE POLICY "Users can create NFTs" ON nfts
  FOR INSERT WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "Users can update their own NFTs" ON nfts
  FOR UPDATE USING (auth.uid() = creator_id);

CREATE POLICY "Users can delete their own NFTs" ON nfts
  FOR DELETE USING (auth.uid() = creator_id);

-- Create policies for nft_bids
CREATE POLICY "NFT bids are viewable by relevant users" ON nft_bids
  FOR SELECT USING (auth.uid() = bidder_id OR auth.uid() = (SELECT owner_id FROM nfts WHERE nfts.id = nft_bids.nft_id));

CREATE POLICY "Users can create NFT bids" ON nft_bids
  FOR INSERT WITH CHECK (auth.uid() = bidder_id);

CREATE POLICY "Users can update their own NFT bids" ON nft_bids
  FOR UPDATE USING (auth.uid() = bidder_id);

-- Grant permissions
GRANT SELECT, INSERT, UPDATE ON contests TO anon;
GRANT SELECT, INSERT, UPDATE ON contest_entries TO anon;
GRANT SELECT, INSERT ON contest_votes TO anon;
GRANT SELECT, INSERT, UPDATE ON nft_collections TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON nfts TO anon;
GRANT SELECT, INSERT, UPDATE ON nft_bids TO anon;

GRANT ALL ON contests TO service_role;
GRANT ALL ON contest_entries TO service_role;
GRANT ALL ON contest_votes TO service_role;
GRANT ALL ON nft_collections TO service_role;
GRANT ALL ON nfts TO service_role;
GRANT ALL ON nft_bids TO service_role;