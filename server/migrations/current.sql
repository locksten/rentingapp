drop table if exists "User" cascade;
create table "User" (
    "id" text primary key,
    "name" text not null,
    "isAdmin" boolean default FALSE,
    "createdAt" timestamp with time zone not null default now(),
    "_type" text not null generated always as ('User') stored
);

drop table if exists "Listing" cascade;
create table "Listing" (
    "id" serial primary key,
    "title" text not null,
    "description" text not null,
    "imageUrl" text not null,
    "dayPriceEuroCents" int not null,
    "depositEuroCents" int,
    "ownerId" text references "User" ("id") not null,
    "createdAt" timestamp with time zone not null default now(),
    "_type" text not null generated always as ('Listing') stored
);