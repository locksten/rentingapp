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
    "latitude" float not null,
    "longitude" float not null,
    "createdAt" timestamp with time zone not null default now(),
    "updatedAt" timestamp with time zone not null default now(),
    "_type" text not null generated always as ('Listing') stored
);


drop table if exists "Feedback" cascade;
create table "Feedback" (
    "id" serial primary key,
    "rating" int not null,
    "text" text,
    "createdAt" timestamp with time zone not null default now(),
    "_type" text not null generated always as ('Feedback') stored
);

drop type if exists "RentingStatus" cascade;
create type "RentingStatus" as enum ('RequestPending', 'RequestDeclined', 'PaymentPending', 'ReturnPending', 'Returned', 'Canceled');

drop table if exists "Renting" cascade;
create table "Renting" (
    "id" serial primary key,
    "listingId" int references "Listing" ("id") not null,
    "ownerId" text references "User" ("id") not null,
    "renterId" text references "User" ("id") not null,
    "ownerFeedbackId" int references "Feedback" ("id"),
    "renterFeedbackId" int references "Feedback" ("id"),
    "scheduledStartTime" timestamp with time zone not null,
    "scheduledEndTime" timestamp with time zone not null,
    "rentingStatus" "RentingStatus" default 'RequestPending',
    "createdAt" timestamp with time zone not null default now(),
    "updatedAt" timestamp with time zone not null default now(),
    "_type" text not null generated always as ('Renting') stored
);
