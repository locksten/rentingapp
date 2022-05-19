drop table if exists "User" cascade;
create table "User" (
    "id" text primary key,
    "name" text not null,
    "isAdmin" boolean not null default FALSE,
    "isBanned" boolean not null default FALSE,
    "createdAt" timestamp with time zone not null default now(),
    "updatedAt" timestamp with time zone not null default now(),
    "_type" text not null generated always as ('User') stored
);

drop table if exists "Listing" cascade;
create table "Listing" (
    "id" serial primary key,
    "title" text not null,
    "description" text not null,
    "fullText" text not null,
    "category" text not null,
    "imageUrl" text not null,
    "dayPriceEuroCents" int not null,
    "depositEuroCents" int,
    "ownerId" text references "User" ("id") not null,
    "latitude" float not null,
    "longitude" float not null,
    "isRemoved" boolean not null default FALSE,
    "createdAt" timestamp with time zone not null default now(),
    "updatedAt" timestamp with time zone not null default now(),
    "_type" text not null generated always as ('Listing') stored
);


drop table if exists "Feedback" cascade;
create table "Feedback" (
    "id" serial primary key,
    "rating" int not null,
    "text" text,
    "isRemoved" boolean not null default FALSE,
    "createdAt" timestamp with time zone not null default now(),
    "updatedAt" timestamp with time zone not null default now(),
    "_type" text not null generated always as ('Feedback') stored
);

drop table if exists "Report" cascade;
create table "Report" (
    "id" serial primary key,
    "listingId" int references "Listing" ("id"),
    "feedbackId" int references "Feedback" ("id"),
    "reason" text,
    "isDismissed" boolean not null default FALSE,
    "createdAt" timestamp with time zone not null default now(),
    "updatedAt" timestamp with time zone not null default now(),
    "_type" text not null generated always as ('Report') stored
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
    "rentingStatus" "RentingStatus" not null default 'RequestPending',
    "createdAt" timestamp with time zone not null default now(),
    "updatedAt" timestamp with time zone not null default now(),
    "_type" text not null generated always as ('Renting') stored
);


drop table if exists "Conversation" cascade;
create table "Conversation" (
    "id" serial primary key,
    "listingId" int references "Listing" ("id"),
    "createdAt" timestamp with time zone not null default now(),
    "updatedAt" timestamp with time zone not null default now(),
    "_type" text not null generated always as ('Conversation') stored
);

drop table if exists "ConversationUser" cascade;
create table "ConversationUser" (
    "conversationId" int references "Conversation" ("id") not null,
    "userId" text references "User" ("id") not null,
    "lastViewed" timestamp with time zone not null default now()
);

drop table if exists "Message" cascade;
create table "Message" (
    "id" serial primary key,
    "conversationId" int references "Conversation" ("id") not null,
    "senderId" text references "User" ("id") not null,
    "text" text not null,
    "createdAt" timestamp with time zone not null default now(),
    "updatedAt" timestamp with time zone not null default now(),
    "_type" text not null generated always as ('Message') stored
);