/*
** DON'T EDIT THIS FILE **
It's been generated by Zapatos (v5.0.2), and is liable to be overwritten

Zapatos: https://jawj.github.io/zapatos/
Copyright (C) 2020 - 2021 George MacKerron
Released under the MIT licence: see LICENCE file
*/

declare module 'zapatos/schema' {

  import type * as db from 'zapatos/db';

  // got a type error on schemaVersionCanary below? update by running `npx zapatos`
  export interface schemaVersionCanary extends db.SchemaVersionCanary { version: 103 }

  /* === schema: public === */

  /* --- enums --- */


  /* --- tables --- */

  /**
   * **Listing**
   * - Table in database
   */
  export namespace Listing {
    export type Table = 'Listing';
    export interface Selectable {
      /**
      * **Listing.id**
      * - `int4` in database
      * - `NOT NULL`, default: `nextval('"Listing_id_seq"'::regclass)`
      */
      id: number;
      /**
      * **Listing.title**
      * - `text` in database
      * - `NOT NULL`, no default
      */
      title: string;
      /**
      * **Listing.description**
      * - `text` in database
      * - `NOT NULL`, no default
      */
      description: string;
      /**
      * **Listing.imageUrl**
      * - `text` in database
      * - `NOT NULL`, no default
      */
      imageUrl: string;
      /**
      * **Listing.dayPriceEuroCents**
      * - `int4` in database
      * - `NOT NULL`, no default
      */
      dayPriceEuroCents: number;
      /**
      * **Listing.depositEuroCents**
      * - `int4` in database
      * - Nullable, no default
      */
      depositEuroCents: number | null;
      /**
      * **Listing.ownerId**
      * - `text` in database
      * - `NOT NULL`, no default
      */
      ownerId: string;
      /**
      * **Listing.createdAt**
      * - `timestamptz` in database
      * - `NOT NULL`, default: `now()`
      */
      createdAt: Date;
      /**
      * **Listing._type**
      * - `text` in database
      * - Generated column
      */
      _type: string;
    }
    export interface JSONSelectable {
      /**
      * **Listing.id**
      * - `int4` in database
      * - `NOT NULL`, default: `nextval('"Listing_id_seq"'::regclass)`
      */
      id: number;
      /**
      * **Listing.title**
      * - `text` in database
      * - `NOT NULL`, no default
      */
      title: string;
      /**
      * **Listing.description**
      * - `text` in database
      * - `NOT NULL`, no default
      */
      description: string;
      /**
      * **Listing.imageUrl**
      * - `text` in database
      * - `NOT NULL`, no default
      */
      imageUrl: string;
      /**
      * **Listing.dayPriceEuroCents**
      * - `int4` in database
      * - `NOT NULL`, no default
      */
      dayPriceEuroCents: number;
      /**
      * **Listing.depositEuroCents**
      * - `int4` in database
      * - Nullable, no default
      */
      depositEuroCents: number | null;
      /**
      * **Listing.ownerId**
      * - `text` in database
      * - `NOT NULL`, no default
      */
      ownerId: string;
      /**
      * **Listing.createdAt**
      * - `timestamptz` in database
      * - `NOT NULL`, default: `now()`
      */
      createdAt: db.TimestampTzString;
      /**
      * **Listing._type**
      * - `text` in database
      * - Generated column
      */
      _type: string;
    }
    export interface Whereable {
      /**
      * **Listing.id**
      * - `int4` in database
      * - `NOT NULL`, default: `nextval('"Listing_id_seq"'::regclass)`
      */
      id?: number | db.Parameter<number> | db.SQLFragment | db.ParentColumn | db.SQLFragment<any, number | db.Parameter<number> | db.SQLFragment | db.ParentColumn>;
      /**
      * **Listing.title**
      * - `text` in database
      * - `NOT NULL`, no default
      */
      title?: string | db.Parameter<string> | db.SQLFragment | db.ParentColumn | db.SQLFragment<any, string | db.Parameter<string> | db.SQLFragment | db.ParentColumn>;
      /**
      * **Listing.description**
      * - `text` in database
      * - `NOT NULL`, no default
      */
      description?: string | db.Parameter<string> | db.SQLFragment | db.ParentColumn | db.SQLFragment<any, string | db.Parameter<string> | db.SQLFragment | db.ParentColumn>;
      /**
      * **Listing.imageUrl**
      * - `text` in database
      * - `NOT NULL`, no default
      */
      imageUrl?: string | db.Parameter<string> | db.SQLFragment | db.ParentColumn | db.SQLFragment<any, string | db.Parameter<string> | db.SQLFragment | db.ParentColumn>;
      /**
      * **Listing.dayPriceEuroCents**
      * - `int4` in database
      * - `NOT NULL`, no default
      */
      dayPriceEuroCents?: number | db.Parameter<number> | db.SQLFragment | db.ParentColumn | db.SQLFragment<any, number | db.Parameter<number> | db.SQLFragment | db.ParentColumn>;
      /**
      * **Listing.depositEuroCents**
      * - `int4` in database
      * - Nullable, no default
      */
      depositEuroCents?: number | db.Parameter<number> | db.SQLFragment | db.ParentColumn | db.SQLFragment<any, number | db.Parameter<number> | db.SQLFragment | db.ParentColumn>;
      /**
      * **Listing.ownerId**
      * - `text` in database
      * - `NOT NULL`, no default
      */
      ownerId?: string | db.Parameter<string> | db.SQLFragment | db.ParentColumn | db.SQLFragment<any, string | db.Parameter<string> | db.SQLFragment | db.ParentColumn>;
      /**
      * **Listing.createdAt**
      * - `timestamptz` in database
      * - `NOT NULL`, default: `now()`
      */
      createdAt?: (db.TimestampTzString | Date) | db.Parameter<(db.TimestampTzString | Date)> | db.SQLFragment | db.ParentColumn | db.SQLFragment<any, (db.TimestampTzString | Date) | db.Parameter<(db.TimestampTzString | Date)> | db.SQLFragment | db.ParentColumn>;
      /**
      * **Listing._type**
      * - `text` in database
      * - Generated column
      */
      _type?: string | db.Parameter<string> | db.SQLFragment | db.ParentColumn | db.SQLFragment<any, string | db.Parameter<string> | db.SQLFragment | db.ParentColumn>;
    }
    export interface Insertable {
      /**
      * **Listing.id**
      * - `int4` in database
      * - `NOT NULL`, default: `nextval('"Listing_id_seq"'::regclass)`
      */
      id?: number | db.Parameter<number> | db.DefaultType | db.SQLFragment;
      /**
      * **Listing.title**
      * - `text` in database
      * - `NOT NULL`, no default
      */
      title: string | db.Parameter<string> | db.SQLFragment;
      /**
      * **Listing.description**
      * - `text` in database
      * - `NOT NULL`, no default
      */
      description: string | db.Parameter<string> | db.SQLFragment;
      /**
      * **Listing.imageUrl**
      * - `text` in database
      * - `NOT NULL`, no default
      */
      imageUrl: string | db.Parameter<string> | db.SQLFragment;
      /**
      * **Listing.dayPriceEuroCents**
      * - `int4` in database
      * - `NOT NULL`, no default
      */
      dayPriceEuroCents: number | db.Parameter<number> | db.SQLFragment;
      /**
      * **Listing.depositEuroCents**
      * - `int4` in database
      * - Nullable, no default
      */
      depositEuroCents?: number | db.Parameter<number> | null | db.DefaultType | db.SQLFragment;
      /**
      * **Listing.ownerId**
      * - `text` in database
      * - `NOT NULL`, no default
      */
      ownerId: string | db.Parameter<string> | db.SQLFragment;
      /**
      * **Listing.createdAt**
      * - `timestamptz` in database
      * - `NOT NULL`, default: `now()`
      */
      createdAt?: (db.TimestampTzString | Date) | db.Parameter<(db.TimestampTzString | Date)> | db.DefaultType | db.SQLFragment;
    }
    export interface Updatable {
      /**
      * **Listing.id**
      * - `int4` in database
      * - `NOT NULL`, default: `nextval('"Listing_id_seq"'::regclass)`
      */
      id?: number | db.Parameter<number> | db.DefaultType | db.SQLFragment | db.SQLFragment<any, number | db.Parameter<number> | db.DefaultType | db.SQLFragment>;
      /**
      * **Listing.title**
      * - `text` in database
      * - `NOT NULL`, no default
      */
      title?: string | db.Parameter<string> | db.SQLFragment | db.SQLFragment<any, string | db.Parameter<string> | db.SQLFragment>;
      /**
      * **Listing.description**
      * - `text` in database
      * - `NOT NULL`, no default
      */
      description?: string | db.Parameter<string> | db.SQLFragment | db.SQLFragment<any, string | db.Parameter<string> | db.SQLFragment>;
      /**
      * **Listing.imageUrl**
      * - `text` in database
      * - `NOT NULL`, no default
      */
      imageUrl?: string | db.Parameter<string> | db.SQLFragment | db.SQLFragment<any, string | db.Parameter<string> | db.SQLFragment>;
      /**
      * **Listing.dayPriceEuroCents**
      * - `int4` in database
      * - `NOT NULL`, no default
      */
      dayPriceEuroCents?: number | db.Parameter<number> | db.SQLFragment | db.SQLFragment<any, number | db.Parameter<number> | db.SQLFragment>;
      /**
      * **Listing.depositEuroCents**
      * - `int4` in database
      * - Nullable, no default
      */
      depositEuroCents?: number | db.Parameter<number> | null | db.DefaultType | db.SQLFragment | db.SQLFragment<any, number | db.Parameter<number> | null | db.DefaultType | db.SQLFragment>;
      /**
      * **Listing.ownerId**
      * - `text` in database
      * - `NOT NULL`, no default
      */
      ownerId?: string | db.Parameter<string> | db.SQLFragment | db.SQLFragment<any, string | db.Parameter<string> | db.SQLFragment>;
      /**
      * **Listing.createdAt**
      * - `timestamptz` in database
      * - `NOT NULL`, default: `now()`
      */
      createdAt?: (db.TimestampTzString | Date) | db.Parameter<(db.TimestampTzString | Date)> | db.DefaultType | db.SQLFragment | db.SQLFragment<any, (db.TimestampTzString | Date) | db.Parameter<(db.TimestampTzString | Date)> | db.DefaultType | db.SQLFragment>;
    }
    export type UniqueIndex = 'Listing_pkey';
    export type Column = keyof Selectable;
    export type OnlyCols<T extends readonly Column[]> = Pick<Selectable, T[number]>;
    export type SQLExpression = db.GenericSQLExpression | db.ColumnNames<Updatable | (keyof Updatable)[]> | db.ColumnValues<Updatable> | Table | Whereable | Column;
    export type SQL = SQLExpression | SQLExpression[];
  }

  /**
   * **User**
   * - Table in database
   */
  export namespace User {
    export type Table = 'User';
    export interface Selectable {
      /**
      * **User.id**
      * - `text` in database
      * - `NOT NULL`, no default
      */
      id: string;
      /**
      * **User.name**
      * - `text` in database
      * - `NOT NULL`, no default
      */
      name: string;
      /**
      * **User.isAdmin**
      * - `bool` in database
      * - Nullable, default: `false`
      */
      isAdmin: boolean | null;
      /**
      * **User.createdAt**
      * - `timestamptz` in database
      * - `NOT NULL`, default: `now()`
      */
      createdAt: Date;
      /**
      * **User._type**
      * - `text` in database
      * - Generated column
      */
      _type: string;
    }
    export interface JSONSelectable {
      /**
      * **User.id**
      * - `text` in database
      * - `NOT NULL`, no default
      */
      id: string;
      /**
      * **User.name**
      * - `text` in database
      * - `NOT NULL`, no default
      */
      name: string;
      /**
      * **User.isAdmin**
      * - `bool` in database
      * - Nullable, default: `false`
      */
      isAdmin: boolean | null;
      /**
      * **User.createdAt**
      * - `timestamptz` in database
      * - `NOT NULL`, default: `now()`
      */
      createdAt: db.TimestampTzString;
      /**
      * **User._type**
      * - `text` in database
      * - Generated column
      */
      _type: string;
    }
    export interface Whereable {
      /**
      * **User.id**
      * - `text` in database
      * - `NOT NULL`, no default
      */
      id?: string | db.Parameter<string> | db.SQLFragment | db.ParentColumn | db.SQLFragment<any, string | db.Parameter<string> | db.SQLFragment | db.ParentColumn>;
      /**
      * **User.name**
      * - `text` in database
      * - `NOT NULL`, no default
      */
      name?: string | db.Parameter<string> | db.SQLFragment | db.ParentColumn | db.SQLFragment<any, string | db.Parameter<string> | db.SQLFragment | db.ParentColumn>;
      /**
      * **User.isAdmin**
      * - `bool` in database
      * - Nullable, default: `false`
      */
      isAdmin?: boolean | db.Parameter<boolean> | db.SQLFragment | db.ParentColumn | db.SQLFragment<any, boolean | db.Parameter<boolean> | db.SQLFragment | db.ParentColumn>;
      /**
      * **User.createdAt**
      * - `timestamptz` in database
      * - `NOT NULL`, default: `now()`
      */
      createdAt?: (db.TimestampTzString | Date) | db.Parameter<(db.TimestampTzString | Date)> | db.SQLFragment | db.ParentColumn | db.SQLFragment<any, (db.TimestampTzString | Date) | db.Parameter<(db.TimestampTzString | Date)> | db.SQLFragment | db.ParentColumn>;
      /**
      * **User._type**
      * - `text` in database
      * - Generated column
      */
      _type?: string | db.Parameter<string> | db.SQLFragment | db.ParentColumn | db.SQLFragment<any, string | db.Parameter<string> | db.SQLFragment | db.ParentColumn>;
    }
    export interface Insertable {
      /**
      * **User.id**
      * - `text` in database
      * - `NOT NULL`, no default
      */
      id: string | db.Parameter<string> | db.SQLFragment;
      /**
      * **User.name**
      * - `text` in database
      * - `NOT NULL`, no default
      */
      name: string | db.Parameter<string> | db.SQLFragment;
      /**
      * **User.isAdmin**
      * - `bool` in database
      * - Nullable, default: `false`
      */
      isAdmin?: boolean | db.Parameter<boolean> | null | db.DefaultType | db.SQLFragment;
      /**
      * **User.createdAt**
      * - `timestamptz` in database
      * - `NOT NULL`, default: `now()`
      */
      createdAt?: (db.TimestampTzString | Date) | db.Parameter<(db.TimestampTzString | Date)> | db.DefaultType | db.SQLFragment;
    }
    export interface Updatable {
      /**
      * **User.id**
      * - `text` in database
      * - `NOT NULL`, no default
      */
      id?: string | db.Parameter<string> | db.SQLFragment | db.SQLFragment<any, string | db.Parameter<string> | db.SQLFragment>;
      /**
      * **User.name**
      * - `text` in database
      * - `NOT NULL`, no default
      */
      name?: string | db.Parameter<string> | db.SQLFragment | db.SQLFragment<any, string | db.Parameter<string> | db.SQLFragment>;
      /**
      * **User.isAdmin**
      * - `bool` in database
      * - Nullable, default: `false`
      */
      isAdmin?: boolean | db.Parameter<boolean> | null | db.DefaultType | db.SQLFragment | db.SQLFragment<any, boolean | db.Parameter<boolean> | null | db.DefaultType | db.SQLFragment>;
      /**
      * **User.createdAt**
      * - `timestamptz` in database
      * - `NOT NULL`, default: `now()`
      */
      createdAt?: (db.TimestampTzString | Date) | db.Parameter<(db.TimestampTzString | Date)> | db.DefaultType | db.SQLFragment | db.SQLFragment<any, (db.TimestampTzString | Date) | db.Parameter<(db.TimestampTzString | Date)> | db.DefaultType | db.SQLFragment>;
    }
    export type UniqueIndex = 'User_pkey';
    export type Column = keyof Selectable;
    export type OnlyCols<T extends readonly Column[]> = Pick<Selectable, T[number]>;
    export type SQLExpression = db.GenericSQLExpression | db.ColumnNames<Updatable | (keyof Updatable)[]> | db.ColumnValues<Updatable> | Table | Whereable | Column;
    export type SQL = SQLExpression | SQLExpression[];
  }

  /* === cross-table types === */

  export type Table = Listing.Table | User.Table;
  export type Selectable = Listing.Selectable | User.Selectable;
  export type JSONSelectable = Listing.JSONSelectable | User.JSONSelectable;
  export type Whereable = Listing.Whereable | User.Whereable;
  export type Insertable = Listing.Insertable | User.Insertable;
  export type Updatable = Listing.Updatable | User.Updatable;
  export type UniqueIndex = Listing.UniqueIndex | User.UniqueIndex;
  export type Column = Listing.Column | User.Column;
  export type AllBaseTables = [Listing.Table, User.Table];
  export type AllForeignTables = [];
  export type AllViews = [];
  export type AllMaterializedViews = [];
  export type AllTablesAndViews = [Listing.Table, User.Table];


  export type SelectableForTable<T extends Table> = {
    Listing: Listing.Selectable;
    User: User.Selectable;
  }[T];

  export type JSONSelectableForTable<T extends Table> = {
    Listing: Listing.JSONSelectable;
    User: User.JSONSelectable;
  }[T];

  export type WhereableForTable<T extends Table> = {
    Listing: Listing.Whereable;
    User: User.Whereable;
  }[T];

  export type InsertableForTable<T extends Table> = {
    Listing: Listing.Insertable;
    User: User.Insertable;
  }[T];

  export type UpdatableForTable<T extends Table> = {
    Listing: Listing.Updatable;
    User: User.Updatable;
  }[T];

  export type UniqueIndexForTable<T extends Table> = {
    Listing: Listing.UniqueIndex;
    User: User.UniqueIndex;
  }[T];

  export type ColumnForTable<T extends Table> = {
    Listing: Listing.Column;
    User: User.Column;
  }[T];

  export type SQLForTable<T extends Table> = {
    Listing: Listing.SQL;
    User: User.SQL;
  }[T];

}
