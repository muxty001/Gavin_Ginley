import { createClient } from '@supabase/supabase-js';


// Initialize database client
const supabaseUrl = 'https://swlsqcnbxtdfnzqwxami.databasepad.com';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6ImUyNDFjOWNlLTVkZGYtNDAwYi1hZmE4LWY0ZjNjYzJkODljYyJ9.eyJwcm9qZWN0SWQiOiJzd2xzcWNuYnh0ZGZuenF3eGFtaSIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNzY3MTEwOTcyLCJleHAiOjIwODI0NzA5NzIsImlzcyI6ImZhbW91cy5kYXRhYmFzZXBhZCIsImF1ZCI6ImZhbW91cy5jbGllbnRzIn0.umGsG5gHsWwk--ayroDFq1FeqwiNJX3MS6zZhB24xzY';
const supabase = createClient(supabaseUrl, supabaseKey);


export { supabase };