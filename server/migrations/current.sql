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

drop type if exists "RentingRequestStatus" cascade;
create type "RentingRequestStatus" as enum ('Pending', 'Accepted', 'Declined');

drop type if exists "RentingPaymentStatus" cascade;
create type "RentingPaymentStatus" as enum ('Pending', 'Completed', 'Canceled');

drop type if exists "RentingReturnStatus" cascade;
create type "RentingReturnStatus" as enum ('Completed', 'Canceled');

drop table if exists "Renting" cascade;
create table "Renting" (
    "id" serial primary key,
    "listingId" int references "Listing" ("id") not null,
    "ownerId" text references "User" ("id") not null,
    "renterId" text references "User" ("id") not null,
    "scheduledStartTime" timestamp with time zone not null,
    "scheduledEndTime" timestamp with time zone not null,
    "rentingRequestStatus" "RentingRequestStatus" default 'Pending',
    "rentingPaymentStatus" "RentingPaymentStatus",
    "rentingReturnStatus" "RentingReturnStatus",
    "createdAt" timestamp with time zone not null default now(),
    "_type" text not null generated always as ('Renting') stored
);