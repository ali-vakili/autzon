type sessionUser = {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  profile: string | null;
  role: string;
  is_verified: boolean;
  is_subscribed: boolean;
  is_profile_complete: boolean;
  join_date: Date;
  updatedAt: Date;
}

export type { sessionUser }