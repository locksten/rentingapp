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
  depositEuroCents?: Maybe<Scalars['Int']>;
  description?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  imageUrl?: Maybe<Scalars['String']>;
  owner?: Maybe<User>;
  rentings?: Maybe<Renting>;
  title?: Maybe<Scalars['String']>;
};

export type ListingInput = {
  dayPriceEuroCents: Scalars['Int'];
  depositEuroCents?: InputMaybe<Scalars['Int']>;
  description: Scalars['String'];
  imageUrl: Scalars['String'];
  title: Scalars['String'];
};

export type MakeRentingRequestInput = {
  listingId: Scalars['ID'];
  scheduledEndTime: Scalars['String'];
  scheduledStartTime: Scalars['String'];
};

export type Me = {
  __typename?: 'Me';
  MyListings?: Maybe<MeMyListingsConnection>;
  MyRentals?: Maybe<MeMyRentalsConnection>;
  id?: Maybe<Scalars['String']>;
  user?: Maybe<User>;
};


export type MeMyListingsArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
};


export type MeMyRentalsArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
};

export type MeMyListingsConnection = {
  __typename?: 'MeMyListingsConnection';
  edges: Array<Maybe<MeMyListingsConnectionEdge>>;
  pageInfo: PageInfo;
};

export type MeMyListingsConnectionEdge = {
  __typename?: 'MeMyListingsConnectionEdge';
  cursor: Scalars['String'];
  node: Listing;
};

export type MeMyRentalsConnection = {
  __typename?: 'MeMyRentalsConnection';
  edges: Array<Maybe<MeMyRentalsConnectionEdge>>;
  pageInfo: PageInfo;
};

export type MeMyRentalsConnectionEdge = {
  __typename?: 'MeMyRentalsConnectionEdge';
  cursor: Scalars['String'];
  node: Renting;
};

export type Mutation = {
  __typename?: 'Mutation';
  createListing?: Maybe<Listing>;
  makeRentingRequest?: Maybe<Renting>;
};


export type MutationCreateListingArgs = {
  input: ListingInput;
};


export type MutationMakeRentingRequestArgs = {
  input: MakeRentingRequestInput;
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
  listings?: Maybe<QueryListingsConnection>;
  me?: Maybe<Me>;
  node?: Maybe<Node>;
  nodes: Array<Maybe<Node>>;
  users?: Maybe<QueryUsersConnection>;
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

export type Renting = Node & {
  __typename?: 'Renting';
  id: Scalars['ID'];
  listing?: Maybe<Listing>;
  renter?: Maybe<User>;
  rentingPaymentStatus?: Maybe<Scalars['String']>;
  rentingRequestStatus?: Maybe<Scalars['String']>;
  rentingReturnStatus?: Maybe<Scalars['String']>;
  scheduledEndTime?: Maybe<Scalars['String']>;
  scheduledStartTime?: Maybe<Scalars['String']>;
};

export type User = Node & {
  __typename?: 'User';
  id: Scalars['ID'];
  imageUrl?: Maybe<Scalars['String']>;
  isMe?: Maybe<Scalars['Boolean']>;
  listingCount?: Maybe<Scalars['Int']>;
  listings?: Maybe<Array<Listing>>;
  name?: Maybe<Scalars['String']>;
  rentingOwnerCount?: Maybe<Scalars['Int']>;
  rentingRenterCount?: Maybe<Scalars['Int']>;
};

export type ListingsQueryVariables = Exact<{ [key: string]: never; }>;


export type ListingsQuery = { __typename?: 'Query', listings?: { __typename?: 'QueryListingsConnection', edges: Array<{ __typename?: 'QueryListingsConnectionEdge', node: { __typename: 'Listing', id: string, title?: string | null, imageUrl?: string | null, dayPriceEuroCents?: number | null, owner?: { __typename: 'User', id: string, name?: string | null, isMe?: boolean | null, imageUrl?: string | null, listingCount?: number | null } | null } } | null> } | null };

export type CreateListingMutationVariables = Exact<{
  input: ListingInput;
}>;


export type CreateListingMutation = { __typename?: 'Mutation', createListing?: { __typename?: 'Listing', id: string, description?: string | null, imageUrl?: string | null, title?: string | null, dayPriceEuroCents?: number | null, depositEuroCents?: number | null } | null };

export type ListingQueryVariables = Exact<{
  nodeId: Scalars['ID'];
}>;


export type ListingQuery = { __typename?: 'Query', node?: { __typename: 'Listing', title?: string | null, description?: string | null, imageUrl?: string | null, dayPriceEuroCents?: number | null, id: string, owner?: { __typename: 'User', isMe?: boolean | null, id: string, name?: string | null, imageUrl?: string | null, listingCount?: number | null, rentingOwnerCount?: number | null, rentingRenterCount?: number | null } | null } | { __typename: 'Renting', id: string } | { __typename: 'User', id: string } | null };

export type ListingListItemFragmentFragment = { __typename: 'Listing', id: string, title?: string | null, imageUrl?: string | null, dayPriceEuroCents?: number | null, owner?: { __typename: 'User', id: string, name?: string | null, isMe?: boolean | null, imageUrl?: string | null, listingCount?: number | null } | null };

export type ListingListItemOwnerFragmentFragment = { __typename: 'User', id: string, name?: string | null, imageUrl?: string | null, listingCount?: number | null };

export type ListingRentalRequestQueryVariables = Exact<{
  nodeId: Scalars['ID'];
}>;


export type ListingRentalRequestQuery = { __typename?: 'Query', node?: { __typename: 'Listing', dayPriceEuroCents?: number | null, id: string } | { __typename: 'Renting', id: string } | { __typename: 'User', id: string } | null };

export type MakeRentingRequestMutationVariables = Exact<{
  input: MakeRentingRequestInput;
}>;


export type MakeRentingRequestMutation = { __typename?: 'Mutation', makeRentingRequest?: { __typename?: 'Renting', id: string } | null };

export type MyListingsQueryVariables = Exact<{ [key: string]: never; }>;


export type MyListingsQuery = { __typename?: 'Query', me?: { __typename?: 'Me', id?: string | null, MyListings?: { __typename?: 'MeMyListingsConnection', edges: Array<{ __typename?: 'MeMyListingsConnectionEdge', node: { __typename: 'Listing', id: string, title?: string | null, imageUrl?: string | null, dayPriceEuroCents?: number | null, rentings?: { __typename: 'Renting', id: string, rentingRequestStatus?: string | null } | null, owner?: { __typename: 'User', id: string, name?: string | null, isMe?: boolean | null, imageUrl?: string | null, listingCount?: number | null } | null } } | null> } | null } | null };

export type MyRentalsQueryVariables = Exact<{ [key: string]: never; }>;


export type MyRentalsQuery = { __typename?: 'Query', me?: { __typename?: 'Me', id?: string | null, MyRentals?: { __typename?: 'MeMyRentalsConnection', edges: Array<{ __typename?: 'MeMyRentalsConnectionEdge', node: { __typename: 'Renting', id: string, scheduledStartTime?: string | null, scheduledEndTime?: string | null, rentingReturnStatus?: string | null, rentingRequestStatus?: string | null, rentingPaymentStatus?: string | null, listing?: { __typename: 'Listing', id: string, title?: string | null, imageUrl?: string | null, dayPriceEuroCents?: number | null, owner?: { __typename: 'User', id: string, name?: string | null, isMe?: boolean | null, imageUrl?: string | null, listingCount?: number | null } | null } | null } } | null> } | null } | null };

export type PersonCardFragmentFragment = { __typename: 'User', id: string, isMe?: boolean | null, name?: string | null, imageUrl?: string | null, listingCount?: number | null, rentingOwnerCount?: number | null, rentingRenterCount?: number | null };

export const ListingListItemOwnerFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ListingListItemOwnerFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"imageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"listingCount"}}]}}]} as unknown as DocumentNode<ListingListItemOwnerFragmentFragment, unknown>;
export const ListingListItemFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ListingListItemFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Listing"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"imageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"dayPriceEuroCents"}},{"kind":"Field","name":{"kind":"Name","value":"owner"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"isMe"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"ListingListItemOwnerFragment"}}]}}]}},...ListingListItemOwnerFragmentFragmentDoc.definitions]} as unknown as DocumentNode<ListingListItemFragmentFragment, unknown>;
export const PersonCardFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PersonCardFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"isMe"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"imageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"listingCount"}},{"kind":"Field","name":{"kind":"Name","value":"rentingOwnerCount"}},{"kind":"Field","name":{"kind":"Name","value":"rentingRenterCount"}}]}}]} as unknown as DocumentNode<PersonCardFragmentFragment, unknown>;
export const ListingsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Listings"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"listings"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"ListingListItemFragment"}}]}}]}}]}}]}},...ListingListItemFragmentFragmentDoc.definitions]} as unknown as DocumentNode<ListingsQuery, ListingsQueryVariables>;
export const CreateListingDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"createListing"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ListingInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createListing"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"imageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"dayPriceEuroCents"}},{"kind":"Field","name":{"kind":"Name","value":"depositEuroCents"}}]}}]}}]} as unknown as DocumentNode<CreateListingMutation, CreateListingMutationVariables>;
export const ListingDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Listing"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"nodeId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"node"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"nodeId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Listing"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"imageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"dayPriceEuroCents"}},{"kind":"Field","name":{"kind":"Name","value":"owner"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"isMe"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"PersonCardFragment"}}]}}]}}]}}]}},...PersonCardFragmentFragmentDoc.definitions]} as unknown as DocumentNode<ListingQuery, ListingQueryVariables>;
export const ListingRentalRequestDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ListingRentalRequest"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"nodeId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"node"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"nodeId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Listing"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"dayPriceEuroCents"}}]}}]}}]}}]} as unknown as DocumentNode<ListingRentalRequestQuery, ListingRentalRequestQueryVariables>;
export const MakeRentingRequestDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"makeRentingRequest"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"MakeRentingRequestInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"makeRentingRequest"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<MakeRentingRequestMutation, MakeRentingRequestMutationVariables>;
export const MyListingsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"MyListings"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"MyListings"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"ListingListItemFragment"}},{"kind":"Field","name":{"kind":"Name","value":"rentings"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"rentingRequestStatus"}}]}}]}}]}}]}}]}}]}},...ListingListItemFragmentFragmentDoc.definitions]} as unknown as DocumentNode<MyListingsQuery, MyListingsQueryVariables>;
export const MyRentalsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"MyRentals"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"MyRentals"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"scheduledStartTime"}},{"kind":"Field","name":{"kind":"Name","value":"scheduledEndTime"}},{"kind":"Field","name":{"kind":"Name","value":"rentingReturnStatus"}},{"kind":"Field","name":{"kind":"Name","value":"rentingRequestStatus"}},{"kind":"Field","name":{"kind":"Name","value":"rentingPaymentStatus"}},{"kind":"Field","name":{"kind":"Name","value":"listing"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ListingListItemFragment"}}]}}]}}]}}]}}]}}]}},...ListingListItemFragmentFragmentDoc.definitions]} as unknown as DocumentNode<MyRentalsQuery, MyRentalsQueryVariables>;