-- Create KYC submissions table
CREATE TABLE IF NOT EXISTS kyc_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    full_name VARCHAR(100) NOT NULL,
    date_of_birth DATE NOT NULL,
    nationality VARCHAR(50) NOT NULL,
    address TEXT NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    identity_document_type VARCHAR(20) NOT NULL CHECK (identity_document_type IN ('passport', 'national_id', 'drivers_license')),
    identity_document_number VARCHAR(50) NOT NULL,
    identity_document_front TEXT NOT NULL, -- URL to document image
    identity_document_back TEXT, -- URL to document back image (optional)
    selfie_with_document TEXT NOT NULL, -- URL to selfie with document
    proof_of_address TEXT NOT NULL, -- URL to proof of address document
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'under_review', 'approved', 'rejected')),
    submitted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    reviewed_at TIMESTAMP WITH TIME ZONE,
    reviewed_by UUID REFERENCES users(id),
    rejection_reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_kyc_submissions_user_id ON kyc_submissions(user_id);
CREATE INDEX IF NOT EXISTS idx_kyc_submissions_status ON kyc_submissions(status);
CREATE INDEX IF NOT EXISTS idx_kyc_submissions_submitted_at ON kyc_submissions(submitted_at);

-- Enable RLS
ALTER TABLE kyc_submissions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own KYC submissions" ON kyc_submissions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own KYC submissions" ON kyc_submissions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own pending KYC submissions" ON kyc_submissions
    FOR UPDATE USING (auth.uid() = user_id AND status = 'pending');

-- Grant permissions
GRANT SELECT, INSERT, UPDATE ON kyc_submissions TO authenticated;
GRANT SELECT ON kyc_submissions TO anon;

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION update_kyc_submissions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_kyc_submissions_updated_at
    BEFORE UPDATE ON kyc_submissions
    FOR EACH ROW
    EXECUTE FUNCTION update_kyc_submissions_updated_at();