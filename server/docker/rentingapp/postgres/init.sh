#!/bin/bash
set -e

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    CREATE DATABASE rentingapp;
    CREATE DATABASE rentingapp_shadow;
    CREATE DATABASE rentingapp_test;
EOSQL