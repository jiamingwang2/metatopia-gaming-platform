-- Create function to increment vote counts on proposals
CREATE OR REPLACE FUNCTION increment_vote_count(
    proposal_id UUID,
    vote_type TEXT,
    power INTEGER
)
RETURNS VOID AS $$
BEGIN
    IF vote_type = 'for' THEN
        UPDATE dao_proposals 
        SET votes_for = votes_for + power,
            total_voting_power = total_voting_power + power
        WHERE id = proposal_id;
    ELSIF vote_type = 'against' THEN
        UPDATE dao_proposals 
        SET votes_against = votes_against + power,
            total_voting_power = total_voting_power + power
        WHERE id = proposal_id;
    ELSIF vote_type = 'abstain' THEN
        UPDATE dao_proposals 
        SET votes_abstain = votes_abstain + power,
            total_voting_power = total_voting_power + power
        WHERE id = proposal_id;
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION increment_vote_count(UUID, TEXT, INTEGER) TO authenticated;

-- Create function to update proposal status based on voting results
CREATE OR REPLACE FUNCTION update_proposal_status()
RETURNS VOID AS $$
DECLARE
    proposal RECORD;
    quorum_met BOOLEAN;
    majority_met BOOLEAN;
BEGIN
    -- Update expired proposals
    UPDATE dao_proposals 
    SET status = 'expired'
    WHERE status = 'active' 
    AND voting_end_date < NOW();
    
    -- Check active proposals that have ended
    FOR proposal IN 
        SELECT id, votes_for, votes_against, votes_abstain, 
               total_voting_power, required_quorum, required_majority
        FROM dao_proposals 
        WHERE status = 'active' 
        AND voting_end_date <= NOW()
    LOOP
        -- Check if quorum is met (total votes >= required quorum)
        quorum_met := proposal.total_voting_power >= proposal.required_quorum;
        
        -- Check if majority is met (votes_for > required_majority% of total votes)
        majority_met := proposal.votes_for > (proposal.total_voting_power * proposal.required_majority / 100);
        
        IF quorum_met AND majority_met THEN
            UPDATE dao_proposals 
            SET status = 'passed'
            WHERE id = proposal.id;
        ELSE
            UPDATE dao_proposals 
            SET status = 'failed'
            WHERE id = proposal.id;
        END IF;
    END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION update_proposal_status() TO authenticated;

-- Create function to check if user can vote on proposal
CREATE OR REPLACE FUNCTION can_user_vote(
    user_id UUID,
    proposal_id UUID
)
RETURNS BOOLEAN AS $$
DECLARE
    proposal_status TEXT;
    voting_end_date TIMESTAMP WITH TIME ZONE;
    already_voted BOOLEAN;
BEGIN
    -- Get proposal details
    SELECT status, voting_end_date INTO proposal_status, voting_end_date
    FROM dao_proposals 
    WHERE id = proposal_id;
    
    -- Check if proposal exists and is active
    IF proposal_status IS NULL OR proposal_status != 'active' THEN
        RETURN FALSE;
    END IF;
    
    -- Check if voting period has ended
    IF voting_end_date <= NOW() THEN
        RETURN FALSE;
    END IF;
    
    -- Check if user has already voted (this would require a votes table)
    -- For now, we'll assume users can vote multiple times
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION can_user_vote(UUID, UUID) TO authenticated;