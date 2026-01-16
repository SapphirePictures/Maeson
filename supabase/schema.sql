-- Enable extensions
create extension if not exists "uuid-ossp";

-- Profiles table (linked to Supabase auth.users)
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  first_name text not null,
  last_name text not null,
  email text not null,
  phone text,
  role text default 'buyer',
  avatar_url text,
  created_at timestamptz default now()
);

-- Properties table
create table if not exists properties (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  description text,
  price numeric not null,
  property_type text not null,
  listing_type text not null,
  status text default 'available',
  street text,
  city text,
  state text,
  zip_code text,
  country text default 'Nigeria',
  bedrooms integer,
  bathrooms integer,
  square_feet integer,
  lot_size integer,
  year_built integer,
  features text[],
  amenities text[],
  images text[] not null default '{}',
  virtual_tour text,
  agent_id uuid references profiles(id),
  views integer default 0,
  parking text,
  heating text,
  cooling text,
  is_featured boolean default false,
  is_published boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Favorites table
create table if not exists favorites (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references profiles(id) on delete cascade,
  property_id uuid not null references properties(id) on delete cascade,
  notes text,
  created_at timestamptz default now()
);

-- Inquiries table
create table if not exists inquiries (
  id uuid primary key default uuid_generate_v4(),
  property_id uuid not null references properties(id) on delete cascade,
  sender_id uuid not null references profiles(id) on delete cascade,
  recipient_id uuid references profiles(id) on delete set null,
  name text,
  email text,
  phone text,
  message text not null,
  inquiry_type text default 'general',
  preferred_contact_method text default 'email',
  status text default 'new',
  response text,
  responded_at timestamptz,
  created_at timestamptz default now()
);

-- Row Level Security
alter table profiles enable row level security;
alter table properties enable row level security;
alter table favorites enable row level security;
alter table inquiries enable row level security;

-- Profiles policies
create policy "Profiles are viewable by owner" on profiles
  for select using (auth.uid() = id);

create policy "Profiles are editable by owner" on profiles
  for update using (auth.uid() = id);

create policy "Profiles are insertable by owner" on profiles
  for insert with check (auth.uid() = id);

-- Properties policies (public read)
create policy "Properties are public" on properties
  for select using (true);

-- Favorites policies
create policy "Favorites are viewable by owner" on favorites
  for select using (auth.uid() = user_id);

create policy "Favorites are insertable by owner" on favorites
  for insert with check (auth.uid() = user_id);

create policy "Favorites are updatable by owner" on favorites
  for update using (auth.uid() = user_id);

create policy "Favorites are deletable by owner" on favorites
  for delete using (auth.uid() = user_id);

-- Inquiries policies
create policy "Inquiries are viewable by sender or recipient" on inquiries
  for select using (auth.uid() = sender_id or auth.uid() = recipient_id);

create policy "Inquiries are insertable by sender" on inquiries
  for insert with check (auth.uid() = sender_id);

create policy "Inquiries are updatable by recipient" on inquiries
  for update using (auth.uid() = recipient_id);

create policy "Inquiries are deletable by sender" on inquiries
  for delete using (auth.uid() = sender_id);

-- Seed data for properties
insert into properties (
  title, description, price, property_type, listing_type, city, state, bedrooms, bathrooms, square_feet, images, is_featured
) values
  (
    'Luxury Villa in Ikoyi', 'Luxury villa with modern finishes.', 850000000, 'house', 'sale', 'Ikoyi', 'Lagos', 5, 6, 600,
    ARRAY[
      'https://images.unsplash.com/photo-1585011191285-8b443579631c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBsdXh1cnklMjBob3VzZSUyMGV4dGVyaW9yJTIwbmlnZXJpYXxlbnwxfHx8fDE3NjU2NDA2MTF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      'https://images.unsplash.com/photo-1667584523543-d1d9cc828a15?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBsaXZpbmclMjByb29tJTIwaW50ZXJpb3J8ZW58MXx8fHwxNzY1ODA1MTkyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      'https://images.unsplash.com/photo-1639405069836-f82aa6dcb900?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHxsdXh1cnklMjBraXRjaGVuJTIwZGVzaWdufGVufDF8fHx8MTc2NTc3NjI4Mnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    ],
    true
  ),
  (
    'Modern Apartment in Victoria Island', 'Modern apartment close to amenities.', 12000000, 'apartment', 'rent', 'Victoria Island', 'Lagos', 3, 3, 200,
    ARRAY[
      'https://images.unsplash.com/photo-1663756915301-2ba688e078cf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBhcGFydG1lbnQlMjBpbnRlcmlvciUyMGxpdmluZyUyMHJvb218ZW58MXx8fHwxNzY1NjQwNjExfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      'https://images.unsplash.com/photo-1610177534644-34d881503b83?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHxtb2Rlcm4lMjBraXRjaGVuJTIwaW50ZXJpb3J8ZW58MXx8fHwxNzY1ODQ1MjEzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    ],
    true
  ),
  (
    'Commercial Office Space', 'Prime office space in central business district.', 45000000, 'commercial', 'sale', 'Abuja', 'FCT', 0, 2, 150,
    ARRAY[
      'https://images.unsplash.com/photo-1694702702714-a48c5fabdaf3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBvZmZpY2UlMjBidWlsZGluZyUyMGV4dGVyaW9yfGVufDF8fHx8MTc2NTYxMjYzNXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      'https://images.unsplash.com/photo-1497366754035-f200968a6e72?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHxtb2Rlcm4lMjBvZmZpY2UlMjBpbnRlcmlvcnxlbnwxfHx8fDE3NjU4MTQ4ODd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    ],
    false
  ),
  (
    'Serviced 2-Bed Apartment', 'Serviced apartment in Lekki Phase 1.', 8000000, 'apartment', 'rent', 'Lekki Phase 1', 'Lagos', 2, 2, 120,
    ARRAY[
      'https://images.unsplash.com/photo-1594611342013-27c44e25625f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHxyZWFsJTIwZXN0YXRlJTIwYWdlbnQlMjBoYW5kc2hha2V8ZW58MXx8fHwxNzY1NjQwNjExfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    ],
    true
  ),
  (
    'Family Home with Garden', 'Spacious family home with garden.', 55000000, 'house', 'sale', 'Ibadan', 'Oyo', 4, 4, 400,
    ARRAY[
      'https://images.unsplash.com/photo-1569706971306-de5d78f6418e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHxsYWdvcyUyMGNpdHklMjBza3lsaW5lfGVufDF8fHx8MTc2NTY0MDYxMXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    ],
    false
  ),
  (
    'Waterfront Land', 'Premium waterfront land parcel.', 1200000000, 'land', 'sale', 'Banana Island', 'Lagos', 0, 0, 0,
    ARRAY[
      'https://images.unsplash.com/photo-1685266326473-5b99c3d08a7e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbXB0eSUyMGxhbmQlMjBwbG90JTIwbmlnZXJpYXxlbnwxfHx8fDE3NjU4OTgwNjR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    ],
    false
  ),
  (
    '4-Bedroom Semi-Detached Duplex', 'Modern duplex in Ajah.', 75000000, 'house', 'sale', 'Ajah', 'Lagos', 4, 4, 350,
    ARRAY[
      'https://images.unsplash.com/photo-1661332626430-2bdad0d84642?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHxtb2Rlcm4lMjBkdXBsZXglMjBob3VzZSUyMGV4dGVyaW9yJTIwbmlnZXJpYXxlbnwxfHx8fDE3NjU3MTU4OTd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    ],
    true
  ),
  (
    'Premium Office Complex', 'Modern office complex in Ikeja GRA.', 150000000, 'commercial', 'sale', 'Ikeja', 'Lagos', 0, 4, 450,
    ARRAY[
      'https://images.unsplash.com/photo-1734184451176-d3ca5bb6b64a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBvZmZpY2UlMjBidWlsZGluZyUyMGV4dGVyaW9yJTIwbmlnZXJpYXxlbnwxfHx8fDE3NjU3MTU4OTd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    ],
    false
  ),
  (
    'Luxury 3-Bedroom Apartment', 'Luxury apartment in Port Harcourt.', 5000000, 'apartment', 'rent', 'Port Harcourt', 'Rivers', 3, 3, 180,
    ARRAY[
      'https://images.unsplash.com/photo-1662454419736-de132ff75638?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHxtb2Rlcm4lMjBhcGFydG1lbnQlMjBpbnRlcmlvciUyMGJlZHJvb218ZW58MXx8fHwxNzY1NzE1ODk3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    ],
    true
  ),
  (
    'Exquisite 5-Bedroom Detached', 'Luxury detached home in Maitama.', 650000000, 'house', 'sale', 'Maitama', 'Abuja', 5, 6, 800,
    ARRAY[
      'https://images.unsplash.com/photo-1628353100822-0229ae96e820?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHxtb2Rlcm4lMjByZXNpZGVudGlhbCUyMGVzdGF0ZSUyMG5pZ2VyaWF8ZW58MXx8fHwxNzY1NzE1OTAwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    ],
    true
  ),
  (
    'Seafront 2-Bed Condo', 'Seafront condo in Lekki.', 18000000, 'apartment', 'rent', 'Lekki', 'Lagos', 2, 2, 140,
    ARRAY[
      'https://images.unsplash.com/photo-1663756915301-2ba688e078cf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBhcGFydG1lbnQlMjBpbnRlcmlvciUyMGxpdmluZyUyMHJvb218ZW58MXx8fHwxNzY1NjQwNjExfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    ],
    true
  ),
  (
    'Family Duplex with Garden', 'Modern duplex with garden.', 95000000, 'house', 'sale', 'Ajah', 'Lagos', 4, 4, 320,
    ARRAY[
      'https://images.unsplash.com/photo-1661332626430-2bdad0d84642?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHxtb2Rlcm4lMjBkdXBsZXglMjBob3VzZSUyMGV4dGVyaW9yJTIwbmlnZXJpYXxlbnwxfHx8fDE3NjU3MTU4OTd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    ],
    false
  ),
  (
    'City View Apartment', 'Apartment with city view in Ikeja.', 9500000, 'apartment', 'rent', 'Ikeja', 'Lagos', 2, 2, 110,
    ARRAY[
      'https://images.unsplash.com/photo-1662454419736-de132ff75638?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHxtb2Rlcm4lMjBhcGFydG1lbnQlMjBpbnRlcmlvciUyMGJlZHJvb218ZW58MXx8fHwxNzY1NzE1ODk3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    ],
    false
  ),
  (
    'Garden Terrace Home', 'Terrace home in Ibadan.', 48000000, 'house', 'sale', 'Ibadan', 'Oyo', 3, 3, 260,
    ARRAY[
      'https://images.unsplash.com/photo-1569706971306-de5d78f6418e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHxsYWdvcyUyMGNpdHklMjBza3lsaW5lfGVufDF8fHx8MTc2NTY0MDYxMXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    ],
    true
  ),
  (
    'Riverside Penthouse', 'Penthouse in Port Harcourt.', 22000000, 'apartment', 'rent', 'Port Harcourt', 'Rivers', 3, 3, 210,
    ARRAY[
      'https://images.unsplash.com/photo-1663756915301-2ba688e078cf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHxtb2Rlcm4lMjBhcGFydG1lbnQlMjBpbnRlcmlvciUyMGxpdmluZyUyMHJvb218ZW58MXx8fHwxNzY1NjQwNjExfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    ],
    false
  ),
  (
    'Smart 3-Bed Residence', 'Smart home in Asokoro.', 420000000, 'house', 'sale', 'Asokoro', 'Abuja', 3, 4, 350,
    ARRAY[
      'https://images.unsplash.com/photo-1628353100822-0229ae96e820?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHxtb2Rlcm4lMjByZXNpZGVudGlhbCUyMGVzdGF0ZSUyMG5pZ2VyaWF8ZW58MXx8fHwxNzY1NzE1OTAwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    ],
    true
  ),
  (
    'Serviced Studio Apartment', 'Studio apartment in Wuse 2.', 7200000, 'apartment', 'rent', 'Wuse 2', 'Abuja', 1, 1, 65,
    ARRAY[
      'https://images.unsplash.com/photo-1662454419736-de132ff75638?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHxtb2Rlcm4lMjBhcGFydG1lbnQlMjBpbnRlcmlvciUyMGJlZHJvb218ZW58MXx8fHwxNzY1NzE1ODk3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    ],
    false
  ),
  (
    'Commercial Retail Plaza', 'Retail plaza in Victoria Island.', 320000000, 'commercial', 'sale', 'Victoria Island', 'Lagos', 0, 3, 500,
    ARRAY[
      'https://images.unsplash.com/photo-1694702702714-a48c5fabdaf3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHxtb2Rlcm4lMjBvZmZpY2UlMjBidWlsZGluZyUyMGV4dGVyaW9yfGVufDF8fHx8MTc2NTYxMjYzNXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    ],
    false
  ),
  (
    'Affordable 3-Bed Bungalow', 'Affordable bungalow in Surulere.', 38000000, 'house', 'sale', 'Surulere', 'Lagos', 3, 3, 220,
    ARRAY[
      'https://images.unsplash.com/photo-1585011191285-8b443579631c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHxtb2Rlcm4lMjBsdXh1cnklMjBob3VzZSUyMGV4dGVyaW9yJTIwbmlnZXJpYXxlbnwxfHx8fDE3NjU2NDA2MTF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    ],
    false
  ),
  (
    'Luxury Waterfront Villa', 'Luxury villa on Banana Island.', 980000000, 'house', 'sale', 'Banana Island', 'Lagos', 6, 7, 900,
    ARRAY[
      'https://images.unsplash.com/photo-1585011191285-8b443579631c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHxtb2Rlcm4lMjBsdXh1cnklMjBob3VzZSUyMGV4dGVyaW9yJTIwbmlnZXJpYXxlbnwxfHx8fDE3NjU2NDA2MTF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    ],
    true
  ),
  (
    'Serviced 1-Bed Apartment', 'Serviced apartment in Lekki Phase 1.', 6500000, 'apartment', 'rent', 'Lekki Phase 1', 'Lagos', 1, 1, 75,
    ARRAY[
      'https://images.unsplash.com/photo-1668089677938-b52086753f77?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHxtb2Rlcm4lMjBiZWRyb29tJTIwaW50ZXJpb3J8ZW58MXx8fHwxNzY1ODIxNTIyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    ],
    false
  ),
  (
    'Corporate Office Floor', 'Corporate office floor in Ikeja.', 45000000, 'commercial', 'rent', 'Ikeja', 'Lagos', 0, 2, 300,
    ARRAY[
      'https://images.unsplash.com/photo-1694702702714-a48c5fabdaf3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHxtb2Rlcm4lMjBvZmZpY2UlMjBidWlsZGluZyUyMGV4dGVyaW9yfGVufDF8fHx8MTc2NTYxMjYzNXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    ],
    false
  ),
  (
    'Cozy 2-Bed Flat', 'Cozy flat in Ajah.', 4800000, 'apartment', 'rent', 'Ajah', 'Lagos', 2, 2, 95,
    ARRAY[
      'https://images.unsplash.com/photo-1662454419736-de132ff75638?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHxtb2Rlcm4lMjBhcGFydG1lbnQlMjBpbnRlcmlvciUyMGJlZHJvb218ZW58MXx8fHwxNzY1NzE1ODk3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    ],
    false
  ),
  (
    'Modern Family Home', 'Modern family home in Port Harcourt.', 120000000, 'house', 'sale', 'Port Harcourt', 'Rivers', 4, 4, 360,
    ARRAY[
      'https://images.unsplash.com/photo-1569706971306-de5d78f6418e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHxsYWdvcyUyMGNpdHklMjBza3lsaW5lfGVufDF8fHx8MTc2NTY0MDYxMXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    ],
    true
  ),
  (
    'Gated Estate Plot', 'Gated estate land plot.', 28000000, 'land', 'sale', 'Ibeju-Lekki', 'Lagos', 0, 0, 0,
    ARRAY[
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvcGVuJTIwZmllbGQlMjBsYW5kfGVufDF8fHx8MTc2NTg5ODQ2MHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    ],
    true
  ),
  (
    'Residential Land Parcel', 'Residential land parcel in Katampe.', 95000000, 'land', 'sale', 'Katampe', 'Abuja', 0, 0, 0,
    ARRAY[
      'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlYXJ0aCUyMHBsb3R8ZW58MXx8fHwxNzY1ODk4NTU5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    ],
    false
  ),
  (
    'Dry Land Corner Plot', 'Dry land corner plot.', 12000000, 'land', 'sale', 'Alagbole', 'Ogun', 0, 0, 0,
    ARRAY[
      'https://images.unsplash.com/photo-1501785888041-af3ef285b470?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3VudGFpbiUyMGxhbmR8ZW58MXx8fHwxNzY1ODk4NjUyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    ],
    false
  ),
  (
    'Waterfront Land Bank', 'Waterfront land bank at Eko Atlantic.', 2400000000, 'land', 'sale', 'Eko Atlantic', 'Lagos', 0, 0, 0,
    ARRAY[
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvcGVuJTIwZmllbGQlMjBsYW5kfGVufDF8fHx8MTc2NTg5ODQ2MHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    ],
    true
  ),
  (
    'Serviced 2-Bed Apartment', 'Serviced apartment in Gwarinpa.', 5500000, 'apartment', 'rent', 'Gwarinpa', 'Abuja', 2, 2, 100,
    ARRAY[
      'https://images.unsplash.com/photo-1662454419736-de132ff75638?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHxtb2Rlcm4lMjBhcGFydG1lbnQlMjBpbnRlcmlvciUyMGJlZHJvb218ZW58MXx8fHwxNzY1NzE1ODk3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    ],
    false
  ),
  (
    'Studio Loft', 'Studio loft in Yaba.', 4200000, 'apartment', 'rent', 'Yaba', 'Lagos', 1, 1, 55,
    ARRAY[
      'https://images.unsplash.com/photo-1663756915301-2ba688e078cf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHxtb2Rlcm4lMjBhcGFydG1lbnQlMjBpbnRlcmlvciUyMGxpdmluZyUyMHJvb218ZW58MXx8fHwxNzY1NjQwNjExfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    ],
    true
  ),
  (
    '2-Bed Apartment', 'Apartment in Ikeja.', 6800000, 'apartment', 'rent', 'Ikeja', 'Lagos', 2, 2, 105,
    ARRAY[
      'https://images.unsplash.com/photo-1668089677938-b52086753f77?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHxtb2Rlcm4lMjBiZWRyb29tJTIwaW50ZXJpb3J8ZW58MXx8fHwxNzY1ODIxNTIyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    ],
    false
  ),
  (
    'Serviced 3-Bed Apartment', 'Serviced apartment in Port Harcourt.', 7900000, 'apartment', 'rent', 'Port Harcourt', 'Rivers', 3, 3, 160,
    ARRAY[
      'https://images.unsplash.com/photo-1663756915301-2ba688e078cf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHxtb2Rlcm4lMjBhcGFydG1lbnQlMjBpbnRlcmlvciUyMGxpdmluZyUyMHJvb218ZW58MXx8fHwxNzY1NjQwNjExfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    ],
    true
  );
