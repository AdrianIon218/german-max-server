
const createClient = require('@supabase/supabase-js').createClient;
const supabaseUrl = 'https://xqokqidcdvicwkxgrrcn.supabase.co'
const supabaseKey = process.env.SUPABASE_KEY
const supabase = createClient(supabaseUrl, supabaseKey);
module.exports = supabase;