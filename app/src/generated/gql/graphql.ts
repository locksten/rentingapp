/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type Listing = Node & {
  __typename?: 'Listing';
  dayPriceEuroCents?: Maybe<Scalars['Int']>;
  description?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  imageUrl?: Maybe<Scalars['String']>;
  owner?: Maybe<User>;
  title?: Maybe<Scalars['String']>;
};

export type ListingInput = {
  dayPriceEuroCents: Scalars['Int'];
  description: Scalars['String'];
  imageUrl: Scalars['String'];
  title: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createListing?: Maybe<Listing>;
};


export type MutationCreateListingArgs = {
  input: ListingInput;
};

export type Node = {
  id: Scalars['ID'];
};

export type PageInfo = {
  __typename?: 'PageInfo';
  endCursor?: Maybe<Scalars['String']>;
  hasNextPage: Scalars['Boolean'];
  hasPreviousPage: Scalars['Boolean'];
  startCursor?: Maybe<Scalars['String']>;
};

export type Query = {
  __typename?: 'Query';
  hello?: Maybe<Scalars['String']>;
  listings?: Maybe<QueryListingsConnection>;
  node?: Maybe<Node>;
  nodes: Array<Maybe<Node>>;
  users?: Maybe<QueryUsersConnection>;
};


export type QueryHelloArgs = {
  name?: InputMaybe<Scalars['String']>;
};


export type QueryListingsArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
};


export type QueryNodeArgs = {
  id: Scalars['ID'];
};


export type QueryNodesArgs = {
  ids: Array<Scalars['ID']>;
};


export type QueryUsersArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
};

export type QueryListingsConnection = {
  __typename?: 'QueryListingsConnection';
  edges: Array<Maybe<QueryListingsConnectionEdge>>;
  pageInfo: PageInfo;
};

export type QueryListingsConnectionEdge = {
  __typename?: 'QueryListingsConnectionEdge';
  cursor: Scalars['String'];
  node: Listing;
};

export type QueryUsersConnection = {
  __typename?: 'QueryUsersConnection';
  edges: Array<Maybe<QueryUsersConnectionEdge>>;
  pageInfo: PageInfo;
};

export type QueryUsersConnectionEdge = {
  __typename?: 'QueryUsersConnectionEdge';
  cursor: Scalars['String'];
  node: User;
};

export type User = Node & {
  __typename?: 'User';
  id: Scalars['ID'];
  listings?: Maybe<Array<Listing>>;
  name?: Maybe<Scalars['String']>;
};

export type ListingsQueryVariables = Exact<{ [key: string]: never; }>;


export type ListingsQuery = { __typename?: 'Query', listings?: { __typename?: 'QueryListingsConnection', edges: Array<{ __typename?: 'QueryListingsConnectionEdge', node: { __typename: 'Listing', id: string, title?: string | null, imageUrl?: string | null, dayPriceEuroCents?: number | null, owner?: { __typename: 'User', id: string, name?: string | null } | null } } | null> } | null };

export type ListingQueryVariables = Exact<{
  nodeId: Scalars['ID'];
}>;


export type ListingQuery = { __typename?: 'Query', node?: { __typename: 'Listing', title?: string | null, description?: string | null, imageUrl?: string | null, dayPriceEuroCents?: number | null, id: string } | { __typename: 'User', id: string } | null };

export type ListingListItemFragmentFragment = { __typename: 'Listing', id: string, title?: string | null, imageUrl?: string | null, dayPriceEuroCents?: number | null, owner?: { __typename: 'User', id: string, name?: string | null } | null };

export const ListingListItemFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ListingListItemFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Listing"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"imageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"dayPriceEuroCents"}},{"kind":"Field","name":{"kind":"Name","value":"owner"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<ListingListItemFragmentFragment, unknown>;
export const ListingsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Listings"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"listings"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"ListingListItemFragment"}}]}}]}}]}}]}},...ListingListItemFragmentFragmentDoc.definitions]} as unknown as DocumentNode<ListingsQuery, ListingsQueryVariables>;
export const ListingDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Listing"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"nodeId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"node"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"nodeId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Listing"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"imageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"dayPriceEuroCents"}}]}}]}}]}}]} as unknown as DocumentNode<ListingQuery, ListingQueryVariables>;