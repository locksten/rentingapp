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

export type AcceptRentingRequestInput = {
  rentingId: Scalars['ID'];
};

export type AcceptRentingReturnInput = {
  rentingId: Scalars['ID'];
};

export type CancelRentingInput = {
  rentingId: Scalars['ID'];
};

export type Conversation = Node & {
  __typename?: 'Conversation';
  createdAt?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  latestMessage?: Maybe<Message>;
  listing?: Maybe<Listing>;
  messages?: Maybe<ConversationMessagesConnection>;
};


export type ConversationMessagesArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
};

export type ConversationMessagesConnection = {
  __typename?: 'ConversationMessagesConnection';
  edges: Array<Maybe<ConversationMessagesConnectionEdge>>;
  pageInfo: PageInfo;
};

export type ConversationMessagesConnectionEdge = {
  __typename?: 'ConversationMessagesConnectionEdge';
  cursor: Scalars['String'];
  node: Message;
};

export type DeclineRentingRequestInput = {
  rentingId: Scalars['ID'];
};

export type Feedback = Node & {
  __typename?: 'Feedback';
  createdAt?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  listing?: Maybe<Listing>;
  owner?: Maybe<User>;
  rating?: Maybe<Scalars['Int']>;
  renter?: Maybe<User>;
  text?: Maybe<Scalars['String']>;
};

export type LeaveFeedbackInput = {
  rating: Scalars['Int'];
  rentingId: Scalars['ID'];
  text?: InputMaybe<Scalars['String']>;
};

export type Listing = Node & {
  __typename?: 'Listing';
  category?: Maybe<Scalars['String']>;
  dayPriceEuroCents?: Maybe<Scalars['Int']>;
  depositEuroCents?: Maybe<Scalars['Int']>;
  description?: Maybe<Scalars['String']>;
  feedback?: Maybe<ListingFeedbackConnection>;
  id: Scalars['ID'];
  imageUrl?: Maybe<Scalars['String']>;
  latitude?: Maybe<Scalars['Float']>;
  longitude?: Maybe<Scalars['Float']>;
  owner?: Maybe<User>;
  rating?: Maybe<Scalars['Float']>;
  rentings?: Maybe<Array<Renting>>;
  title?: Maybe<Scalars['String']>;
  unavailableDays?: Maybe<Array<Scalars['String']>>;
  updatedAt?: Maybe<Scalars['String']>;
};


export type ListingFeedbackArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
};

export type ListingFeedbackConnection = {
  __typename?: 'ListingFeedbackConnection';
  edges: Array<Maybe<ListingFeedbackConnectionEdge>>;
  pageInfo: PageInfo;
};

export type ListingFeedbackConnectionEdge = {
  __typename?: 'ListingFeedbackConnectionEdge';
  cursor: Scalars['String'];
  node: Feedback;
};

export type ListingInput = {
  category: Scalars['String'];
  dayPriceEuroCents: Scalars['Int'];
  depositEuroCents?: InputMaybe<Scalars['Int']>;
  description: Scalars['String'];
  imageUrl: Scalars['String'];
  latitude: Scalars['Float'];
  longitude: Scalars['Float'];
  title: Scalars['String'];
};

export type MakeRentingRequestInput = {
  listingId: Scalars['ID'];
  scheduledEndTime: Scalars['String'];
  scheduledStartTime: Scalars['String'];
};

export type Me = {
  __typename?: 'Me';
  conversations?: Maybe<MeConversationsConnection>;
  id?: Maybe<Scalars['String']>;
  myListings?: Maybe<MeMyListingsConnection>;
  myRentals?: Maybe<MeMyRentalsConnection>;
  user?: Maybe<User>;
};


export type MeConversationsArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
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

export type MeConversationsConnection = {
  __typename?: 'MeConversationsConnection';
  edges: Array<Maybe<MeConversationsConnectionEdge>>;
  pageInfo: PageInfo;
};

export type MeConversationsConnectionEdge = {
  __typename?: 'MeConversationsConnectionEdge';
  cursor: Scalars['String'];
  node: Conversation;
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

export type Message = Node & {
  __typename?: 'Message';
  conversation?: Maybe<Conversation>;
  createdAt?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  sender?: Maybe<User>;
  text?: Maybe<Scalars['String']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  acceptRentingRequest?: Maybe<Renting>;
  acceptRentingReturn?: Maybe<Renting>;
  cancelRenting?: Maybe<Renting>;
  createListing?: Maybe<Listing>;
  declineRentingRequest?: Maybe<Renting>;
  leaveFeedback?: Maybe<Feedback>;
  makeRentingRequest?: Maybe<Renting>;
  payForRenting?: Maybe<Renting>;
  sendMessage?: Maybe<Message>;
};


export type MutationAcceptRentingRequestArgs = {
  input: AcceptRentingRequestInput;
};


export type MutationAcceptRentingReturnArgs = {
  input: AcceptRentingReturnInput;
};


export type MutationCancelRentingArgs = {
  input: CancelRentingInput;
};


export type MutationCreateListingArgs = {
  input: ListingInput;
};


export type MutationDeclineRentingRequestArgs = {
  input: DeclineRentingRequestInput;
};


export type MutationLeaveFeedbackArgs = {
  input: LeaveFeedbackInput;
};


export type MutationMakeRentingRequestArgs = {
  input: MakeRentingRequestInput;
};


export type MutationPayForRentingArgs = {
  input: PayForRentingInput;
};


export type MutationSendMessageArgs = {
  input: SendMessageInput;
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

export type PayForRentingInput = {
  rentingId: Scalars['ID'];
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
  category?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  fromPriceEuroCents?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  searchTerm?: InputMaybe<Scalars['String']>;
  toPriceEuroCents?: InputMaybe<Scalars['Int']>;
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
  owner?: Maybe<User>;
  ownerFeedback?: Maybe<Feedback>;
  renter?: Maybe<User>;
  renterFeedback?: Maybe<Feedback>;
  rentingStatus?: Maybe<RentingStatus>;
  scheduledEndTime?: Maybe<Scalars['String']>;
  scheduledStartTime?: Maybe<Scalars['String']>;
  updatedAt?: Maybe<Scalars['String']>;
};

export enum RentingStatus {
  Canceled = 'Canceled',
  PaymentPending = 'PaymentPending',
  RequestDeclined = 'RequestDeclined',
  RequestPending = 'RequestPending',
  ReturnPending = 'ReturnPending',
  Returned = 'Returned'
}

export type SendMessageInput = {
  conversationId?: InputMaybe<Scalars['ID']>;
  listingId?: InputMaybe<Scalars['ID']>;
  recipientId?: InputMaybe<Scalars['ID']>;
  text: Scalars['String'];
};

export type User = Node & {
  __typename?: 'User';
  id: Scalars['ID'];
  imageUrl?: Maybe<Scalars['String']>;
  isMe?: Maybe<Scalars['Boolean']>;
  listingCount?: Maybe<Scalars['Int']>;
  listings?: Maybe<Array<Listing>>;
  name?: Maybe<Scalars['String']>;
  rating?: Maybe<Scalars['Float']>;
  ratingCount?: Maybe<Scalars['Int']>;
  rentingOwnerCount?: Maybe<Scalars['Int']>;
  rentingRenterCount?: Maybe<Scalars['Int']>;
};

export type ListingsQueryVariables = Exact<{ [key: string]: never; }>;


export type ListingsQuery = { __typename?: 'Query', listings?: { __typename?: 'QueryListingsConnection', edges: Array<{ __typename?: 'QueryListingsConnectionEdge', node: { __typename: 'Listing', id: string, updatedAt?: string | null, title?: string | null, imageUrl?: string | null, dayPriceEuroCents?: number | null, owner?: { __typename: 'User', id: string, name?: string | null, isMe?: boolean | null, imageUrl?: string | null, listingCount?: number | null } | null } } | null> } | null };

export type CancelRentingMutationVariables = Exact<{
  input: CancelRentingInput;
}>;


export type CancelRentingMutation = { __typename?: 'Mutation', cancelRenting?: { __typename: 'Renting', rentingStatus?: RentingStatus | null, updatedAt?: string | null, id: string } | null };

export type ConversationMessagesQueryVariables = Exact<{
  nodeId: Scalars['ID'];
}>;


export type ConversationMessagesQuery = { __typename?: 'Query', node?: { __typename: 'Conversation', id: string, createdAt?: string | null, messages?: { __typename?: 'ConversationMessagesConnection', edges: Array<{ __typename?: 'ConversationMessagesConnectionEdge', node: { __typename?: 'Message', id: string, text?: string | null, createdAt?: string | null, sender?: { __typename?: 'User', imageUrl?: string | null, id: string, isMe?: boolean | null } | null } } | null> } | null } | { __typename: 'Feedback', id: string } | { __typename: 'Listing', id: string } | { __typename: 'Message', id: string } | { __typename: 'Renting', id: string } | { __typename: 'User', id: string } | null };

export type SendMessageMutationVariables = Exact<{
  input: SendMessageInput;
}>;


export type SendMessageMutation = { __typename?: 'Mutation', sendMessage?: { __typename: 'Message', id: string, conversation?: { __typename: 'Conversation', id: string } | null } | null };

export type CreateListingMutationVariables = Exact<{
  input: ListingInput;
}>;


export type CreateListingMutation = { __typename?: 'Mutation', createListing?: { __typename?: 'Listing', id: string, description?: string | null, imageUrl?: string | null, title?: string | null, dayPriceEuroCents?: number | null, depositEuroCents?: number | null } | null };

export type FeedbackListItemFragmentFragment = { __typename: 'Feedback', id: string, createdAt?: string | null, rating?: number | null, text?: string | null, renter?: { __typename: 'User', id: string, name?: string | null, imageUrl?: string | null } | null };

export type LeveFeedbackMutationVariables = Exact<{
  input: LeaveFeedbackInput;
}>;


export type LeveFeedbackMutation = { __typename?: 'Mutation', leaveFeedback?: { __typename: 'Feedback', id: string } | null };

export type ListingQueryVariables = Exact<{
  nodeId: Scalars['ID'];
}>;


export type ListingQuery = { __typename?: 'Query', node?: { __typename: 'Conversation', id: string } | { __typename: 'Feedback', id: string } | { __typename: 'Listing', id: string, title?: string | null, description?: string | null, imageUrl?: string | null, dayPriceEuroCents?: number | null, depositEuroCents?: number | null, rating?: number | null, category?: string | null, latitude?: number | null, longitude?: number | null, owner?: { __typename: 'User', isMe?: boolean | null, id: string, name?: string | null, imageUrl?: string | null, listingCount?: number | null, rentingOwnerCount?: number | null, rentingRenterCount?: number | null, ratingCount?: number | null, rating?: number | null } | null, feedback?: { __typename?: 'ListingFeedbackConnection', edges: Array<{ __typename?: 'ListingFeedbackConnectionEdge', node: { __typename: 'Feedback', id: string, createdAt?: string | null, rating?: number | null, text?: string | null, renter?: { __typename: 'User', id: string, name?: string | null, imageUrl?: string | null } | null } } | null> } | null } | { __typename: 'Message', id: string } | { __typename: 'Renting', id: string } | { __typename: 'User', id: string } | null };

export type ListingListItemFragmentFragment = { __typename: 'Listing', id: string, title?: string | null, imageUrl?: string | null, dayPriceEuroCents?: number | null, owner?: { __typename: 'User', id: string, name?: string | null, isMe?: boolean | null, imageUrl?: string | null, listingCount?: number | null } | null };

export type ListingRentalRequestQueryVariables = Exact<{
  nodeId: Scalars['ID'];
}>;


export type ListingRentalRequestQuery = { __typename?: 'Query', node?: { __typename: 'Conversation', id: string } | { __typename: 'Feedback', id: string } | { __typename: 'Listing', dayPriceEuroCents?: number | null, unavailableDays?: Array<string> | null, id: string } | { __typename: 'Message', id: string } | { __typename: 'Renting', id: string } | { __typename: 'User', id: string } | null };

export type MakeRentingRequestMutationVariables = Exact<{
  input: MakeRentingRequestInput;
}>;


export type MakeRentingRequestMutation = { __typename?: 'Mutation', makeRentingRequest?: { __typename: 'Renting', id: string, rentingStatus?: RentingStatus | null, updatedAt?: string | null } | null };

export type MyConversationsQueryVariables = Exact<{ [key: string]: never; }>;


export type MyConversationsQuery = { __typename?: 'Query', me?: { __typename: 'Me', id?: string | null, conversations?: { __typename?: 'MeConversationsConnection', edges: Array<{ __typename?: 'MeConversationsConnectionEdge', node: { __typename: 'Conversation', id: string, createdAt?: string | null, listing?: { __typename: 'Listing', id: string, imageUrl?: string | null } | null, latestMessage?: { __typename: 'Message', id: string, text?: string | null, createdAt?: string | null, sender?: { __typename: 'User', id: string, name?: string | null, imageUrl?: string | null } | null } | null } } | null> } | null } | null };

export type MyListingsQueryVariables = Exact<{ [key: string]: never; }>;


export type MyListingsQuery = { __typename?: 'Query', me?: { __typename?: 'Me', id?: string | null, myListings?: { __typename?: 'MeMyListingsConnection', edges: Array<{ __typename?: 'MeMyListingsConnectionEdge', node: { __typename: 'Listing', id: string, updatedAt?: string | null, title?: string | null, imageUrl?: string | null, dayPriceEuroCents?: number | null, rentings?: Array<{ __typename: 'Renting', id: string, updatedAt?: string | null, rentingStatus?: RentingStatus | null, scheduledStartTime?: string | null, scheduledEndTime?: string | null, ownerFeedback?: { __typename: 'Feedback', id: string } | null, renter?: { __typename: 'User', id: string, name?: string | null, imageUrl?: string | null, listingCount?: number | null } | null }> | null, owner?: { __typename: 'User', id: string, name?: string | null, isMe?: boolean | null, imageUrl?: string | null, listingCount?: number | null } | null } } | null> } | null } | null };

export type OwnerRentingFragmentFragment = { __typename: 'Renting', id: string, rentingStatus?: RentingStatus | null, scheduledStartTime?: string | null, scheduledEndTime?: string | null, updatedAt?: string | null, ownerFeedback?: { __typename: 'Feedback', id: string } | null, renter?: { __typename: 'User', id: string, name?: string | null, imageUrl?: string | null, listingCount?: number | null } | null };

export type DeclineRentingRequestMutationVariables = Exact<{
  input: DeclineRentingRequestInput;
}>;


export type DeclineRentingRequestMutation = { __typename?: 'Mutation', declineRentingRequest?: { __typename: 'Renting', rentingStatus?: RentingStatus | null, updatedAt?: string | null, id: string } | null };

export type AcceptRentingRequestMutationVariables = Exact<{
  input: AcceptRentingRequestInput;
}>;


export type AcceptRentingRequestMutation = { __typename?: 'Mutation', acceptRentingRequest?: { __typename: 'Renting', rentingStatus?: RentingStatus | null, updatedAt?: string | null, id: string } | null };

export type AcceptRentingReturnMutationVariables = Exact<{
  input: AcceptRentingReturnInput;
}>;


export type AcceptRentingReturnMutation = { __typename?: 'Mutation', acceptRentingReturn?: { __typename: 'Renting', rentingStatus?: RentingStatus | null, updatedAt?: string | null, id: string } | null };

export type MyRentalsQueryVariables = Exact<{ [key: string]: never; }>;


export type MyRentalsQuery = { __typename?: 'Query', me?: { __typename?: 'Me', id?: string | null, myRentals?: { __typename?: 'MeMyRentalsConnection', edges: Array<{ __typename?: 'MeMyRentalsConnectionEdge', node: { __typename: 'Renting', id: string, scheduledStartTime?: string | null, scheduledEndTime?: string | null, rentingStatus?: RentingStatus | null, updatedAt?: string | null, renterFeedback?: { __typename: 'Feedback', id: string } | null, listing?: { __typename: 'Listing', id: string, title?: string | null, imageUrl?: string | null, dayPriceEuroCents?: number | null, owner?: { __typename: 'User', id: string, name?: string | null, isMe?: boolean | null, imageUrl?: string | null, listingCount?: number | null } | null } | null } } | null> } | null } | null };

export type RentalPaymentInfoQueryVariables = Exact<{
  nodeId: Scalars['ID'];
}>;


export type RentalPaymentInfoQuery = { __typename?: 'Query', node?: { __typename: 'Conversation', id: string } | { __typename: 'Feedback', id: string } | { __typename: 'Listing', id: string } | { __typename: 'Message', id: string } | { __typename: 'Renting', id: string, listing?: { __typename: 'Listing', id: string, title?: string | null, imageUrl?: string | null, dayPriceEuroCents?: number | null, owner?: { __typename: 'User', id: string, name?: string | null, isMe?: boolean | null, imageUrl?: string | null, listingCount?: number | null } | null } | null } | { __typename: 'User', id: string } | null };

export type PayForRentingcMutationVariables = Exact<{
  input: PayForRentingInput;
}>;


export type PayForRentingcMutation = { __typename?: 'Mutation', payForRenting?: { __typename: 'Renting', id: string, rentingStatus?: RentingStatus | null, updatedAt?: string | null } | null };

export type PersonCardFragmentFragment = { __typename: 'User', id: string, isMe?: boolean | null, name?: string | null, imageUrl?: string | null, listingCount?: number | null, rentingOwnerCount?: number | null, rentingRenterCount?: number | null, ratingCount?: number | null, rating?: number | null };

export type PersonLineFragmentFragment = { __typename: 'User', id: string, name?: string | null, imageUrl?: string | null, listingCount?: number | null };

export type SearchListingsQueryVariables = Exact<{
  searchTerm?: InputMaybe<Scalars['String']>;
  toPriceEuroCents?: InputMaybe<Scalars['Int']>;
  fromPriceEuroCents?: InputMaybe<Scalars['Int']>;
  category?: InputMaybe<Scalars['String']>;
}>;


export type SearchListingsQuery = { __typename?: 'Query', listings?: { __typename?: 'QueryListingsConnection', edges: Array<{ __typename?: 'QueryListingsConnectionEdge', node: { __typename: 'Listing', id: string, updatedAt?: string | null, title?: string | null, imageUrl?: string | null, dayPriceEuroCents?: number | null, owner?: { __typename: 'User', id: string, name?: string | null, isMe?: boolean | null, imageUrl?: string | null, listingCount?: number | null } | null } } | null> } | null };

export const FeedbackListItemFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"FeedbackListItemFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Feedback"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"rating"}},{"kind":"Field","name":{"kind":"Name","value":"text"}},{"kind":"Field","name":{"kind":"Name","value":"renter"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"imageUrl"}}]}}]}}]} as unknown as DocumentNode<FeedbackListItemFragmentFragment, unknown>;
export const PersonLineFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PersonLineFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"imageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"listingCount"}}]}}]} as unknown as DocumentNode<PersonLineFragmentFragment, unknown>;
export const ListingListItemFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ListingListItemFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Listing"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"imageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"dayPriceEuroCents"}},{"kind":"Field","name":{"kind":"Name","value":"owner"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"isMe"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"PersonLineFragment"}}]}}]}}]} as unknown as DocumentNode<ListingListItemFragmentFragment, unknown>;
export const OwnerRentingFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"OwnerRentingFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Renting"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"rentingStatus"}},{"kind":"Field","name":{"kind":"Name","value":"scheduledStartTime"}},{"kind":"Field","name":{"kind":"Name","value":"scheduledEndTime"}},{"kind":"Field","name":{"kind":"Name","value":"ownerFeedback"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"renter"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"PersonLineFragment"}}]}}]}}]} as unknown as DocumentNode<OwnerRentingFragmentFragment, unknown>;
export const PersonCardFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PersonCardFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"isMe"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"imageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"listingCount"}},{"kind":"Field","name":{"kind":"Name","value":"rentingOwnerCount"}},{"kind":"Field","name":{"kind":"Name","value":"rentingRenterCount"}},{"kind":"Field","name":{"kind":"Name","value":"ratingCount"}},{"kind":"Field","name":{"kind":"Name","value":"rating"}}]}}]} as unknown as DocumentNode<PersonCardFragmentFragment, unknown>;
export const ListingsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Listings"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"listings"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"ListingListItemFragment"}}]}}]}}]}}]}},...ListingListItemFragmentFragmentDoc.definitions,...PersonLineFragmentFragmentDoc.definitions]} as unknown as DocumentNode<ListingsQuery, ListingsQueryVariables>;
export const CancelRentingDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"cancelRenting"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CancelRentingInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cancelRenting"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"rentingStatus"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<CancelRentingMutation, CancelRentingMutationVariables>;
export const ConversationMessagesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ConversationMessages"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"nodeId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"node"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"nodeId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Conversation"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"messages"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"text"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"sender"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"imageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"isMe"}}]}}]}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<ConversationMessagesQuery, ConversationMessagesQueryVariables>;
export const SendMessageDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"sendMessage"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SendMessageInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"sendMessage"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"conversation"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<SendMessageMutation, SendMessageMutationVariables>;
export const CreateListingDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"createListing"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ListingInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createListing"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"imageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"dayPriceEuroCents"}},{"kind":"Field","name":{"kind":"Name","value":"depositEuroCents"}}]}}]}}]} as unknown as DocumentNode<CreateListingMutation, CreateListingMutationVariables>;
export const LeveFeedbackDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"leveFeedback"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"LeaveFeedbackInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"leaveFeedback"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<LeveFeedbackMutation, LeveFeedbackMutationVariables>;
export const ListingDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Listing"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"nodeId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"node"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"nodeId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Listing"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"imageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"dayPriceEuroCents"}},{"kind":"Field","name":{"kind":"Name","value":"depositEuroCents"}},{"kind":"Field","name":{"kind":"Name","value":"rating"}},{"kind":"Field","name":{"kind":"Name","value":"category"}},{"kind":"Field","name":{"kind":"Name","value":"latitude"}},{"kind":"Field","name":{"kind":"Name","value":"longitude"}},{"kind":"Field","name":{"kind":"Name","value":"owner"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"isMe"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"PersonCardFragment"}}]}},{"kind":"Field","name":{"kind":"Name","value":"feedback"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"FeedbackListItemFragment"}}]}}]}}]}}]}}]}}]}},...PersonCardFragmentFragmentDoc.definitions,...FeedbackListItemFragmentFragmentDoc.definitions]} as unknown as DocumentNode<ListingQuery, ListingQueryVariables>;
export const ListingRentalRequestDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ListingRentalRequest"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"nodeId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"node"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"nodeId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Listing"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"dayPriceEuroCents"}},{"kind":"Field","name":{"kind":"Name","value":"unavailableDays"}}]}}]}}]}}]} as unknown as DocumentNode<ListingRentalRequestQuery, ListingRentalRequestQueryVariables>;
export const MakeRentingRequestDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"makeRentingRequest"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"MakeRentingRequestInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"makeRentingRequest"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"rentingStatus"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<MakeRentingRequestMutation, MakeRentingRequestMutationVariables>;
export const MyConversationsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"MyConversations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"conversations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"listing"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"imageUrl"}}]}},{"kind":"Field","name":{"kind":"Name","value":"latestMessage"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"text"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"sender"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"imageUrl"}}]}}]}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<MyConversationsQuery, MyConversationsQueryVariables>;
export const MyListingsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"MyListings"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"myListings"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"ListingListItemFragment"}},{"kind":"Field","name":{"kind":"Name","value":"rentings"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"OwnerRentingFragment"}}]}}]}}]}}]}}]}}]}},...ListingListItemFragmentFragmentDoc.definitions,...PersonLineFragmentFragmentDoc.definitions,...OwnerRentingFragmentFragmentDoc.definitions]} as unknown as DocumentNode<MyListingsQuery, MyListingsQueryVariables>;
export const DeclineRentingRequestDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"declineRentingRequest"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"DeclineRentingRequestInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"declineRentingRequest"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"rentingStatus"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<DeclineRentingRequestMutation, DeclineRentingRequestMutationVariables>;
export const AcceptRentingRequestDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"acceptRentingRequest"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"AcceptRentingRequestInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"acceptRentingRequest"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"rentingStatus"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<AcceptRentingRequestMutation, AcceptRentingRequestMutationVariables>;
export const AcceptRentingReturnDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"acceptRentingReturn"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"AcceptRentingReturnInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"acceptRentingReturn"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"rentingStatus"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<AcceptRentingReturnMutation, AcceptRentingReturnMutationVariables>;
export const MyRentalsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"MyRentals"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"myRentals"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"scheduledStartTime"}},{"kind":"Field","name":{"kind":"Name","value":"scheduledEndTime"}},{"kind":"Field","name":{"kind":"Name","value":"rentingStatus"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"renterFeedback"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"listing"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ListingListItemFragment"}}]}}]}}]}}]}}]}}]}},...ListingListItemFragmentFragmentDoc.definitions,...PersonLineFragmentFragmentDoc.definitions]} as unknown as DocumentNode<MyRentalsQuery, MyRentalsQueryVariables>;
export const RentalPaymentInfoDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"RentalPaymentInfo"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"nodeId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"node"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"nodeId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Renting"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"listing"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"imageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"dayPriceEuroCents"}},{"kind":"Field","name":{"kind":"Name","value":"owner"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"isMe"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"PersonLineFragment"}}]}}]}}]}}]}}]}},...PersonLineFragmentFragmentDoc.definitions]} as unknown as DocumentNode<RentalPaymentInfoQuery, RentalPaymentInfoQueryVariables>;
export const PayForRentingcDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"payForRentingc"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"PayForRentingInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"payForRenting"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"rentingStatus"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<PayForRentingcMutation, PayForRentingcMutationVariables>;
export const SearchListingsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"SearchListings"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"searchTerm"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"toPriceEuroCents"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"fromPriceEuroCents"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"category"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"listings"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"searchTerm"},"value":{"kind":"Variable","name":{"kind":"Name","value":"searchTerm"}}},{"kind":"Argument","name":{"kind":"Name","value":"toPriceEuroCents"},"value":{"kind":"Variable","name":{"kind":"Name","value":"toPriceEuroCents"}}},{"kind":"Argument","name":{"kind":"Name","value":"fromPriceEuroCents"},"value":{"kind":"Variable","name":{"kind":"Name","value":"fromPriceEuroCents"}}},{"kind":"Argument","name":{"kind":"Name","value":"category"},"value":{"kind":"Variable","name":{"kind":"Name","value":"category"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"ListingListItemFragment"}}]}}]}}]}}]}},...ListingListItemFragmentFragmentDoc.definitions,...PersonLineFragmentFragmentDoc.definitions]} as unknown as DocumentNode<SearchListingsQuery, SearchListingsQueryVariables>;