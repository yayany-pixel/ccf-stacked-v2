-- Additive and compatible with the previous deployment.
ALTER TABLE ask_ccf_inquiries ADD COLUMN IF NOT EXISTS notify_started_at timestamp;
