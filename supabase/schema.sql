-- Enable required extensions if any
-- CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Define Enums
CREATE TYPE request_status AS ENUM ('pending', 'fulfilled', 'cancelled');
CREATE TYPE valid_blood_types AS ENUM ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-');

-- Blood Banks
CREATE TABLE blood_banks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    location TEXT NOT NULL,
    contact VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Donation Drives
CREATE TABLE donation_drives (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    date TIMESTAMP WITH TIME ZONE NOT NULL,
    location TEXT NOT NULL,
    blood_bank_id UUID REFERENCES blood_banks(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Donors
CREATE TABLE donors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    age INTEGER CHECK (age >= 18 AND age <= 65),
    blood_type valid_blood_types NOT NULL,
    contact VARCHAR(100) NOT NULL,
    last_donation_date DATE,
    medical_info JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Recipients
CREATE TABLE recipients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    blood_type valid_blood_types NOT NULL,
    contact VARCHAR(100) NOT NULL,
    medical_info JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Blood Requests
CREATE TABLE requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    recipient_id UUID REFERENCES recipients(id) ON DELETE CASCADE NOT NULL,
    blood_type valid_blood_types NOT NULL,
    quantity INTEGER CHECK (quantity > 0) NOT NULL,
    status request_status DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert Sample Data
INSERT INTO blood_banks (name, location, contact) VALUES
('City Central Blood Bank', 'Downtown Metro', '1-800-BLOOD-1'),
('Hope Regional', 'Westside Suburbs', '1-800-BLOOD-2');

INSERT INTO donation_drives (name, date, location, blood_bank_id) 
SELECT 'Spring Community Drive', NOW() + INTERVAL '10 days', 'Community Center', id FROM blood_banks LIMIT 1;
