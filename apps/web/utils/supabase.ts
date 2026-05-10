import { env } from "@snappin/env";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = env.supabase.url;
const supabaseKey = env.supabase.publishableKey!;

export const supabase = createClient(supabaseUrl, supabaseKey);