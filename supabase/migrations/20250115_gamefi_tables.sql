-- GameFi Platform Additional Tables Migration
-- Created: 2025-01-15
-- Description: Add GameFi-specific tables and extend existing functionality

-- Extend users table with GameFi-specific fields
ALTER TABLE users ADD COLUMN IF NOT EXISTS wallet_address VARCHAR(42) UNIQUE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS username VARCHAR(50) UNIQUE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS display_name VARCHAR(100);
ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar_url VARCHAR(500);
ALTER TABLE users ADD COLUMN IF NOT EXISTS bio TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS user_type VARCHAR(20) DEFAULT 'player' CHECK (user_type IN ('player', 'esports_player', 'developer', 'investor', 'community'));
ALTER TABLE users ADD COLUMN IF NOT EXISTS kyc_level INTEGER DEFAULT 0 CHECK (kyc_level >= 0 AND kyc_level <= 3);
ALTER TABLE users ADD COLUMN IF NOT EXISTS total_investment DECIMAL(20, 8) DEFAULT 0;
ALTER TABLE users ADD COLUMN IF NOT EXISTS total_earnings DECIMAL(20, 8) DEFAULT 0;
ALTER TABLE users ADD COLUMN IF NOT EXISTS reputation_score INTEGER DEFAULT 0;
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_login_at TIMESTAMP WITH TIME ZONE;

-- Create indexes for new user fields
CREATE INDEX IF NOT EXISTS idx_users_wallet_address ON users(wallet_address);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_user_type ON users(user_type);

-- Extend projects table to become game_projects
ALTER TABLE projects ADD COLUMN IF NOT EXISTS slug VARCHAR(255) UNIQUE;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS detailed_description TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS category VARCHAR(50);
ALTER TABLE projects ADD COLUMN IF NOT EXISTS logo_url VARCHAR(500);
ALTER TABLE projects ADD COLUMN IF NOT EXISTS banner_url VARCHAR(500);
ALTER TABLE projects ADD COLUMN IF NOT EXISTS screenshots TEXT[];
ALTER TABLE projects ADD COLUMN IF NOT EXISTS gameplay_video_url VARCHAR(500);
ALTER TABLE projects ADD COLUMN IF NOT EXISTS whitepaper_url VARCHAR(500);
ALTER TABLE projects ADD COLUMN IF NOT EXISTS website_url VARCHAR(500);
ALTER TABLE projects ADD COLUMN IF NOT EXISTS github_url VARCHAR(500);
ALTER TABLE projects ADD COLUMN IF NOT EXISTS discord_url VARCHAR(500);
ALTER TABLE projects ADD COLUMN IF NOT EXISTS twitter_url VARCHAR(500);
ALTER TABLE projects ADD COLUMN IF NOT EXISTS token_symbol VARCHAR(10);
ALTER TABLE projects ADD COLUMN IF NOT EXISTS token_contract_address VARCHAR(42);
ALTER TABLE projects ADD COLUMN IF NOT EXISTS total_supply DECIMAL(20, 8);
ALTER TABLE projects ADD COLUMN IF NOT EXISTS circulating_supply DECIMAL(20, 8);
ALTER TABLE projects ADD COLUMN IF NOT EXISTS market_cap DECIMAL(20, 8);
ALTER TABLE projects ADD COLUMN IF NOT EXISTS launch_date DATE;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS funding_goal DECIMAL(20, 8);
ALTER TABLE projects ADD COLUMN IF NOT EXISTS funding_raised DECIMAL(20, 8) DEFAULT 0;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS investor_count INTEGER DEFAULT 0;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS rating DECIMAL(3, 2) DEFAULT 0 CHECK (rating >= 0 AND rating <= 5);
ALTER TABLE projects ADD COLUMN IF NOT EXISTS review_count INTEGER DEFAULT 0;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false;

-- Create indexes for extended project fields
CREATE INDEX IF NOT EXISTS idx_projects_slug ON projects(slug);
CREATE INDEX IF NOT EXISTS idx_projects_category ON projects(category);
CREATE INDEX IF NOT EXISTS idx_projects_launch_date ON projects(launch_date);
CREATE INDEX IF NOT EXISTS idx_projects_rating ON projects(rating DESC);

-- Extend investments table with GameFi-specific fields
ALTER TABLE investments ADD COLUMN IF NOT EXISTS investment_type VARCHAR(20) CHECK (investment_type IN ('seed', 'private', 'public', 'ido'));
ALTER TABLE investments ADD COLUMN IF NOT EXISTS currency VARCHAR(10) DEFAULT 'USDT';
ALTER TABLE investments ADD COLUMN IF NOT EXISTS token_price DECIMAL(20, 8);
ALTER TABLE investments ADD COLUMN IF NOT EXISTS token_amount DECIMAL(20, 8);
ALTER TABLE investments ADD COLUMN IF NOT EXISTS vesting_schedule JSONB;
ALTER TABLE investments ADD COLUMN IF NOT EXISTS unlock_percentage DECIMAL(5, 2) DEFAULT 0;
ALTER TABLE investments ADD COLUMN IF NOT EXISTS claimed_amount DECIMAL(20, 8) DEFAULT 0;
ALTER TABLE investments ADD COLUMN IF NOT EXISTS investment_date TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Create indexes for extended investment fields
CREATE INDEX IF NOT EXISTS idx_investments_type ON investments(investment_type);
CREATE INDEX IF NOT EXISTS idx_investments_date ON investments(investment_date DESC);

-- Extend transactions table with GameFi-specific fields
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS transaction_type VARCHAR(20) CHECK (transaction_type IN ('nft_buy', 'nft_sell', 'token_buy', 'token_sell', 'reward', 'staking', 'unstaking', 'deposit', 'withdraw', 'investment', 'return'));
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS from_address VARCHAR(42);
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS to_address VARCHAR(42);
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS token_address VARCHAR(42);
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS token_id VARCHAR(100);
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS price DECIMAL(20, 8);
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS currency VARCHAR(10) DEFAULT 'ETH';
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS gas_fee DECIMAL(20, 8);
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS block_number BIGINT;
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS metadata JSONB;

-- Create indexes for extended transaction fields
CREATE INDEX IF NOT EXISTS idx_transactions_type ON transactions(transaction_type);
CREATE INDEX IF NOT EXISTS idx_transactions_token_address ON transactions(token_address);

-- DAO proposals table
CREATE TABLE IF NOT EXISTS dao_proposals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    proposer_id UUID REFERENCES users(id) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    proposal_type VARCHAR(20) NOT NULL CHECK (proposal_type IN ('governance', 'funding', 'technical', 'partnership')),
    voting_power_required DECIMAL(20, 8) NOT NULL,
    quorum_required DECIMAL(5, 2) NOT NULL, -- Percentage
    voting_start_date TIMESTAMP WITH TIME ZONE NOT NULL,
    voting_end_date TIMESTAMP WITH TIME ZONE NOT NULL,
    execution_date TIMESTAMP WITH TIME ZONE,
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'passed', 'rejected', 'executed', 'cancelled')),
    votes_for DECIMAL(20, 8) DEFAULT 0,
    votes_against DECIMAL(20, 8) DEFAULT 0,
    total_votes DECIMAL(20, 8) DEFAULT 0,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- DAO votes table
CREATE TABLE IF NOT EXISTS dao_votes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    proposal_id UUID REFERENCES dao_proposals(id) NOT NULL,
    voter_id UUID REFERENCES users(id) NOT NULL,
    vote_type VARCHAR(10) NOT NULL CHECK (vote_type IN ('for', 'against', 'abstain')),
    voting_power DECIMAL(20, 8) NOT NULL,
    reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(proposal_id, voter_id)
);

-- NFT collections table
CREATE TABLE IF NOT EXISTS nft_collections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    symbol VARCHAR(10) NOT NULL,
    description TEXT,
    contract_address VARCHAR(42) UNIQUE NOT NULL,
    creator_id UUID REFERENCES users(id) NOT NULL,
    total_supply INTEGER,
    floor_price DECIMAL(20, 8),
    volume_24h DECIMAL(20, 8) DEFAULT 0,
    volume_total DECIMAL(20, 8) DEFAULT 0,
    owners_count INTEGER DEFAULT 0,
    image_url VARCHAR(500),
    banner_url VARCHAR(500),
    website_url VARCHAR(500),
    discord_url VARCHAR(500),
    twitter_url VARCHAR(500),
    is_verified BOOLEAN DEFAULT false,
    royalty_percentage DECIMAL(5, 2) DEFAULT 0,
    royalty_recipient VARCHAR(42),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- NFT items table
CREATE TABLE IF NOT EXISTS nft_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    collection_id UUID REFERENCES nft_collections(id) NOT NULL,
    token_id VARCHAR(100) NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    image_url VARCHAR(500),
    animation_url VARCHAR(500),
    external_url VARCHAR(500),
    attributes JSONB,
    rarity_rank INTEGER,
    rarity_score DECIMAL(10, 4),
    owner_id UUID REFERENCES users(id),
    current_price DECIMAL(20, 8),
    last_sale_price DECIMAL(20, 8),
    is_listed BOOLEAN DEFAULT false,
    listing_price DECIMAL(20, 8),
    listing_currency VARCHAR(10),
    listing_expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(collection_id, token_id)
);

-- Esports tournaments table
CREATE TABLE IF NOT EXISTS esports_tournaments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    game_title VARCHAR(100) NOT NULL,
    tournament_type VARCHAR(20) NOT NULL CHECK (tournament_type IN ('single_elimination', 'double_elimination', 'round_robin', 'swiss')),
    entry_fee DECIMAL(20, 8) DEFAULT 0,
    prize_pool DECIMAL(20, 8) NOT NULL,
    max_participants INTEGER NOT NULL,
    current_participants INTEGER DEFAULT 0,
    registration_start TIMESTAMP WITH TIME ZONE NOT NULL,
    registration_end TIMESTAMP WITH TIME ZONE NOT NULL,
    tournament_start TIMESTAMP WITH TIME ZONE NOT NULL,
    tournament_end TIMESTAMP WITH TIME ZONE,
    status VARCHAR(20) DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'registration_open', 'registration_closed', 'ongoing', 'completed', 'cancelled')),
    rules TEXT,
    organizer_id UUID REFERENCES users(id) NOT NULL,
    sponsor_logos TEXT[],
    stream_url VARCHAR(500),
    bracket_data JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Esports teams table
CREATE TABLE IF NOT EXISTS esports_teams (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    tag VARCHAR(10) NOT NULL,
    description TEXT,
    logo_url VARCHAR(500),
    captain_id UUID REFERENCES users(id) NOT NULL,
    game_title VARCHAR(100) NOT NULL,
    region VARCHAR(50),
    ranking INTEGER,
    total_earnings DECIMAL(20, 8) DEFAULT 0,
    wins INTEGER DEFAULT 0,
    losses INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Esports team members table
CREATE TABLE IF NOT EXISTS esports_team_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    team_id UUID REFERENCES esports_teams(id) NOT NULL,
    player_id UUID REFERENCES users(id) NOT NULL,
    role VARCHAR(50) NOT NULL,
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    left_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT true,
    UNIQUE(team_id, player_id, is_active)
);

-- Esports matches table
CREATE TABLE IF NOT EXISTS esports_matches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tournament_id UUID REFERENCES esports_tournaments(id),
    team1_id UUID REFERENCES esports_teams(id) NOT NULL,
    team2_id UUID REFERENCES esports_teams(id) NOT NULL,
    scheduled_at TIMESTAMP WITH TIME ZONE NOT NULL,
    started_at TIMESTAMP WITH TIME ZONE,
    ended_at TIMESTAMP WITH TIME ZONE,
    status VARCHAR(20) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'live', 'completed', 'cancelled')),
    team1_score INTEGER DEFAULT 0,
    team2_score INTEGER DEFAULT 0,
    winner_team_id UUID REFERENCES esports_teams(id),
    match_data JSONB,
    stream_url VARCHAR(500),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Staking pools table
CREATE TABLE IF NOT EXISTS staking_pools (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    token_address VARCHAR(42) NOT NULL,
    reward_token_address VARCHAR(42) NOT NULL,
    apy DECIMAL(5, 2) NOT NULL,
    min_stake_amount DECIMAL(20, 8) NOT NULL,
    max_stake_amount DECIMAL(20, 8),
    lock_period_days INTEGER NOT NULL,
    total_staked DECIMAL(20, 8) DEFAULT 0,
    total_rewards_distributed DECIMAL(20, 8) DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User stakes table
CREATE TABLE IF NOT EXISTS user_stakes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) NOT NULL,
    pool_id UUID REFERENCES staking_pools(id) NOT NULL,
    amount DECIMAL(20, 8) NOT NULL,
    rewards_earned DECIMAL(20, 8) DEFAULT 0,
    rewards_claimed DECIMAL(20, 8) DEFAULT 0,
    staked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    unstaked_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT true
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_dao_proposals_status ON dao_proposals(status);
CREATE INDEX IF NOT EXISTS idx_dao_proposals_voting_dates ON dao_proposals(voting_start_date, voting_end_date);
CREATE INDEX IF NOT EXISTS idx_dao_votes_proposal ON dao_votes(proposal_id);
CREATE INDEX IF NOT EXISTS idx_nft_collections_creator ON nft_collections(creator_id);
CREATE INDEX IF NOT EXISTS idx_nft_items_collection ON nft_items(collection_id);
CREATE INDEX IF NOT EXISTS idx_nft_items_owner ON nft_items(owner_id);
CREATE INDEX IF NOT EXISTS idx_nft_items_listed ON nft_items(is_listed);
CREATE INDEX IF NOT EXISTS idx_esports_tournaments_status ON esports_tournaments(status);
CREATE INDEX IF NOT EXISTS idx_esports_tournaments_dates ON esports_tournaments(registration_start, registration_end, tournament_start);
CREATE INDEX IF NOT EXISTS idx_esports_teams_game ON esports_teams(game_title);
CREATE INDEX IF NOT EXISTS idx_esports_matches_tournament ON esports_matches(tournament_id);
CREATE INDEX IF NOT EXISTS idx_esports_matches_teams ON esports_matches(team1_id, team2_id);
CREATE INDEX IF NOT EXISTS idx_user_stakes_user ON user_stakes(user_id);
CREATE INDEX IF NOT EXISTS idx_user_stakes_pool ON user_stakes(pool_id);

-- Enable Row Level Security (RLS) for all tables
ALTER TABLE dao_proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE dao_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE nft_collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE nft_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE esports_tournaments ENABLE ROW LEVEL SECURITY;
ALTER TABLE esports_teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE esports_team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE esports_matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE staking_pools ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_stakes ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (basic read access for authenticated users)
CREATE POLICY "Public read access" ON dao_proposals FOR SELECT USING (true);
CREATE POLICY "Public read access" ON dao_votes FOR SELECT USING (true);
CREATE POLICY "Public read access" ON nft_collections FOR SELECT USING (true);
CREATE POLICY "Public read access" ON nft_items FOR SELECT USING (true);
CREATE POLICY "Public read access" ON esports_tournaments FOR SELECT USING (true);
CREATE POLICY "Public read access" ON esports_teams FOR SELECT USING (true);
CREATE POLICY "Public read access" ON esports_team_members FOR SELECT USING (true);
CREATE POLICY "Public read access" ON esports_matches FOR SELECT USING (true);
CREATE POLICY "Public read access" ON staking_pools FOR SELECT USING (true);
CREATE POLICY "Users can view their own stakes" ON user_stakes FOR SELECT USING (auth.uid() = user_id);

-- Create functions for automatic timestamp updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_dao_proposals_updated_at BEFORE UPDATE ON dao_proposals FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_nft_collections_updated_at BEFORE UPDATE ON nft_collections FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_nft_items_updated_at BEFORE UPDATE ON nft_items FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_esports_tournaments_updated_at BEFORE UPDATE ON esports_tournaments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_esports_teams_updated_at BEFORE UPDATE ON esports_teams FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_esports_matches_updated_at BEFORE UPDATE ON esports_matches FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_staking_pools_updated_at BEFORE UPDATE ON staking_pools FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();