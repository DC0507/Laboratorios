
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';
const supabaseUrl = 'https://ajxppzrdrpccgwltjcoq.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFqeHBwenJkcnBjY2d3bHRqY29xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM4Mzk3OTUsImV4cCI6MjA4OTQxNTc5NX0.sBeWULqiKUxrpUwRNCeYrwIznJZfFWy4c6F8KuELXiE'

export const supabase = createClient(supabaseUrl, supabaseKey)