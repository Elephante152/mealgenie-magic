import type { Json } from '../json';

export interface ProfilesTable {
  profiles: {
    Row: {
      created_at: string;
      email: string;
      id: string;
      preferences: Json | null;
      role: string | null;
      updated_at: string;
    };
    Insert: {
      created_at?: string;
      email: string;
      id: string;
      preferences?: Json | null;
      role?: string | null;
      updated_at?: string;
    };
    Update: {
      created_at?: string;
      email?: string;
      id?: string;
      preferences?: Json | null;
      role?: string | null;
      updated_at?: string;
    };
  };
}