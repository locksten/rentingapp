/* eslint-disable */
import * as graphql from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

const documents = {
    "\n  query Listings {\n    listings {\n      edges {\n        node {\n          __typename\n          id\n          ...ListingListItemFragment\n        }\n      }\n    }\n  }\n": graphql.ListingsDocument,
    "\n  query Listing($nodeId: ID!) {\n    node(id: $nodeId) {\n      __typename\n      id\n      ... on Listing {\n        title\n        description\n        imageUrl\n        dayPriceEuroCents\n        owner {\n          ...PersonCardFragment\n        }\n      }\n    }\n  }\n": graphql.ListingDocument,
    "\n  fragment ListingListItemFragment on Listing {\n    __typename\n    id\n    title\n    imageUrl\n    dayPriceEuroCents\n    owner {\n      __typename\n      id\n      name\n    }\n  }\n": graphql.ListingListItemFragmentFragmentDoc,
    "\n  query MyListings {\n    me {\n      id\n      MyListings {\n        edges {\n          node {\n            __typename\n            id\n            ...ListingListItemFragment\n          }\n        }\n      }\n    }\n  }\n": graphql.MyListingsDocument,
    "\n  fragment PersonCardFragment on User {\n    __typename\n    id\n    isMe\n    name\n    listingCount\n  }\n": graphql.PersonCardFragmentFragmentDoc,
};

export function gql(source: "\n  query Listings {\n    listings {\n      edges {\n        node {\n          __typename\n          id\n          ...ListingListItemFragment\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query Listings {\n    listings {\n      edges {\n        node {\n          __typename\n          id\n          ...ListingListItemFragment\n        }\n      }\n    }\n  }\n"];
export function gql(source: "\n  query Listing($nodeId: ID!) {\n    node(id: $nodeId) {\n      __typename\n      id\n      ... on Listing {\n        title\n        description\n        imageUrl\n        dayPriceEuroCents\n        owner {\n          ...PersonCardFragment\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query Listing($nodeId: ID!) {\n    node(id: $nodeId) {\n      __typename\n      id\n      ... on Listing {\n        title\n        description\n        imageUrl\n        dayPriceEuroCents\n        owner {\n          ...PersonCardFragment\n        }\n      }\n    }\n  }\n"];
export function gql(source: "\n  fragment ListingListItemFragment on Listing {\n    __typename\n    id\n    title\n    imageUrl\n    dayPriceEuroCents\n    owner {\n      __typename\n      id\n      name\n    }\n  }\n"): (typeof documents)["\n  fragment ListingListItemFragment on Listing {\n    __typename\n    id\n    title\n    imageUrl\n    dayPriceEuroCents\n    owner {\n      __typename\n      id\n      name\n    }\n  }\n"];
export function gql(source: "\n  query MyListings {\n    me {\n      id\n      MyListings {\n        edges {\n          node {\n            __typename\n            id\n            ...ListingListItemFragment\n          }\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query MyListings {\n    me {\n      id\n      MyListings {\n        edges {\n          node {\n            __typename\n            id\n            ...ListingListItemFragment\n          }\n        }\n      }\n    }\n  }\n"];
export function gql(source: "\n  fragment PersonCardFragment on User {\n    __typename\n    id\n    isMe\n    name\n    listingCount\n  }\n"): (typeof documents)["\n  fragment PersonCardFragment on User {\n    __typename\n    id\n    isMe\n    name\n    listingCount\n  }\n"];

export function gql(source: string): unknown;
export function gql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;