// import 'react-native-url-polyfill/auto'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient, processLock } from '@supabase/supabase-js'

export const supabase = createClient(
  "https://mgqxzolgwydswskwgqgp.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ncXh6b2xnd3lkc3dza3dncWdwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgxMTYyNTQsImV4cCI6MjA3MzY5MjI1NH0.A8NCP_T8Bx7Cbzox_NASQcWXE_txiRPnvaV3lAuY9nc",
  {
    auth: {
      storage: AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
      lock: processLock,
    },
  })
