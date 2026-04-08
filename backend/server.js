const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl || 'https://mock.supabase.co', supabaseKey || 'mock-key');

// Universal Donor / Recipient logic 
// Matches requested blood type to an array of compatible donor types
const getCompatibleDonorTypes = (recipientType) => {
  const compatibility = {
    'O-': ['O-'],
    'O+': ['O-', 'O+'],
    'A-': ['O-', 'A-'],
    'A+': ['O-', 'O+', 'A-', 'A+'],
    'B-': ['O-', 'B-'],
    'B+': ['O-', 'O+', 'B-', 'B+'],
    'AB-': ['O-', 'A-', 'B-', 'AB-'],
    'AB+': ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+']
  };
  return compatibility[recipientType] || [];
};

// --- Endpoints --- //

app.get('/', (req, res) => {
  res.send('Blood Donation API Running');
});

// Create Donor
app.post('/api/donors', async (req, res) => {
  const { name, age, blood_type, contact, last_donation_date, medical_info } = req.body;
  try {
    const { data, error } = await supabase
      .from('donors')
      .insert([{ name, age, blood_type, contact, last_donation_date, medical_info }])
      .select();
      
    if (error) throw error;
    res.status(201).json(data[0]);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get Donors
app.get('/api/donors', async (req, res) => {
  try {
    const { data, error } = await supabase.from('donors').select('*');
    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Create Recipient
app.post('/api/recipients', async (req, res) => {
  const { name, blood_type, contact, medical_info } = req.body;
  try {
    const { data, error } = await supabase
      .from('recipients')
      .insert([{ name, blood_type, contact, medical_info }])
      .select();
      
    if (error) throw error;
    res.status(201).json(data[0]);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get Recipients
app.get('/api/recipients', async (req, res) => {
  try {
    const { data, error } = await supabase.from('recipients').select('*');
    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Create Blood Request
app.post('/api/requests', async (req, res) => {
  const { recipient_id, blood_type, quantity } = req.body;
  try {
    const { data, error } = await supabase
      .from('requests')
      .insert([{ recipient_id, blood_type, quantity }])
      .select();
      
    if (error) throw error;
    res.status(201).json(data[0]);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get Requests
app.get('/api/requests', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('requests')
      .select(`
        *,
        recipients ( name, contact )
      `)
      .order('created_at', { ascending: false });
    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Match Request with Donors
app.get('/api/match/:requestId', async (req, res) => {
  const { requestId } = req.params;
  try {
    // 1. Get the request
    const { data: request, error: reqError } = await supabase
      .from('requests')
      .select('blood_type')
      .eq('id', requestId)
      .single();
      
    if (reqError) throw reqError;
    if (!request) return res.status(404).json({ error: 'Request not found' });

    // 2. Determine compatible types
    const compatibleTypes = getCompatibleDonorTypes(request.blood_type);

    // 3. Find eligible donors (last_donation_date > 90 days ago or null)
    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
    const dateString = ninetyDaysAgo.toISOString().split('T')[0];

    const { data: matchedDonors, error: matchError } = await supabase
      .from('donors')
      .select('*')
      .in('blood_type', compatibleTypes)
      .or(`last_donation_date.lt.${dateString},last_donation_date.is.null`);

    if (matchError) throw matchError;

    res.json({
      requestBloodType: request.blood_type,
      compatibleTypes,
      matches: matchedDonors
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get Donation Drives
app.get('/api/drives', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('donation_drives')
      .select(`
        *,
        blood_banks ( name, contact )
      `)
      .order('date', { ascending: true });
    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Only start the server if we're not running in a test
if (require.main === module) {
  app.listen(port, () => {
    console.log(`Backend API running on http://localhost:${port}`);
    if (!supabaseUrl || !supabaseKey) {
       console.warn('WARNING: SUPABASE_URL and SUPABASE_ANON_KEY are not set in .env. API will use mock values and will likely fail.');
    }
  });
}

module.exports = app;
