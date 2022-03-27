drop table if exists "User" cascade;
create table "User" (
    "id" text primary key,
    "name" text not null,
    "createdAt" timestamp with time zone not null default now(),
);

drop table if exists "Listing" cascade;
create table "Listing" (
    "id" serial primary key,
    "title" text not null,
    "description" text not null,
    "imageUrl" text not null,
    "dayPriceEuroCents" int not null,
    "ownerId" text references "User" ("id") not null,
    "createdAt" timestamp with time zone not null default now(),
);