import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://karmaboard.jiobase.com";
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase;
