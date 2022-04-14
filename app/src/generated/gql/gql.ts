/* eslint-disable */
import * as graphql from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

const documents = {
    "\n  query Listings {\n    listings {\n      edges {\n        node {\n          __typename\n          id\n          ...ListingListItemFragment\n        }\n      }\n    }\n  }\n": graphql.ListingsDocument,
    "\n  mutation cancelRenting($input: CancelRentingInput!) {\n    cancelRenting(input: $input) {\n      __typename\n      rentingStatus\n      updatedAt\n      id\n    }\n  }\n": graphql.CancelRentingDocument,
    "\n  query ConverstionMessages($nodeId: ID!) {\n    node(id: $nodeId) {\n      ... on Conversation {\n        messages {\n          edges {\n            node {\n              text\n              sender {\n                imageUrl\n                id\n                isMe\n              }\n              createdAt\n              id\n            }\n          }\n        }\n        id\n        createdAt\n      }\n    }\n  }\n": graphql.ConverstionMessagesDocument,
    "\n  mutation sendMessage($input: SendMessageInput!) {\n    sendMessage(input: $input) {\n      __typename\n      id\n      conversation {\n        __typename\n        id\n      }\n    }\n  }\n": graphql.SendMessageDocument,
    "\n  mutation createListing($input: ListingInput!) {\n    createListing(input: $input) {\n      id\n      description\n      imageUrl\n      title\n      dayPriceEuroCents\n      depositEuroCents\n    }\n  }\n": graphql.CreateListingDocument,
    "\n  fragment FeedbackListItemFragment on Feedback {\n    __typename\n    id\n    createdAt\n    rating\n    text\n    renter {\n      __typename\n      id\n      name\n      imageUrl\n    }\n  }\n": graphql.FeedbackListItemFragmentFragmentDoc,
    "\n  mutation leveFeedback($input: LeaveFeedbackInput!) {\n    leaveFeedback(input: $input) {\n      __typename\n      id\n    }\n  }\n": graphql.LeveFeedbackDocument,
    "\n  query Listing($nodeId: ID!) {\n    node(id: $nodeId) {\n      __typename\n      id\n      ... on Listing {\n        id\n        title\n        description\n        imageUrl\n        dayPriceEuroCents\n        rating\n        latitude\n        longitude\n        owner {\n          isMe\n          ...PersonCardFragment\n        }\n        feedback {\n          edges {\n            node {\n              ...FeedbackListItemFragment\n            }\n          }\n        }\n      }\n    }\n  }\n": graphql.ListingDocument,
    "\n  fragment ListingListItemFragment on Listing {\n    __typename\n    id\n    title\n    imageUrl\n    dayPriceEuroCents\n    owner {\n      __typename\n      id\n      name\n      isMe\n      ...PersonLineFragment\n    }\n  }\n": graphql.ListingListItemFragmentFragmentDoc,
    "\n  query ListingRentalRequest($nodeId: ID!) {\n    node(id: $nodeId) {\n      __typename\n      id\n      ... on Listing {\n        dayPriceEuroCents\n        unavailableDays\n      }\n    }\n  }\n": graphql.ListingRentalRequestDocument,
    "\n  mutation makeRentingRequest($input: MakeRentingRequestInput!) {\n    makeRentingRequest(input: $input) {\n      __typename\n      id\n      rentingStatus\n      updatedAt\n    }\n  }\n": graphql.MakeRentingRequestDocument,
    "\n  query MyConversations {\n    me {\n      __typename\n      id\n      conversations {\n        edges {\n          node {\n            __typename\n            id\n            createdAt\n            listing {\n              __typename\n              id\n              imageUrl\n            }\n            latestMessage {\n              __typename\n              id\n              text\n              createdAt\n              sender {\n                __typename\n                id\n                name\n                imageUrl\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n": graphql.MyConversationsDocument,
    "\n  query MyListings {\n    me {\n      id\n      myListings {\n        edges {\n          node {\n            __typename\n            id\n            ...ListingListItemFragment\n            rentings {\n              ...OwnerRentingFragment\n            }\n          }\n        }\n      }\n    }\n  }\n": graphql.MyListingsDocument,
    "\n  fragment OwnerRentingFragment on Renting {\n    __typename\n    id\n    rentingStatus\n    scheduledStartTime\n    scheduledEndTime\n    ownerFeedback {\n      __typename\n      id\n    }\n    updatedAt\n    renter {\n      __typename\n      id\n      ...PersonLineFragment\n    }\n  }\n": graphql.OwnerRentingFragmentFragmentDoc,
    "\n  mutation declineRentingRequest($input: DeclineRentingRequestInput!) {\n    declineRentingRequest(input: $input) {\n      __typename\n      rentingStatus\n      updatedAt\n      id\n    }\n  }\n": graphql.DeclineRentingRequestDocument,
    "\n  mutation acceptRentingRequest($input: AcceptRentingRequestInput!) {\n    acceptRentingRequest(input: $input) {\n      __typename\n      rentingStatus\n      updatedAt\n      id\n    }\n  }\n": graphql.AcceptRentingRequestDocument,
    "\n  mutation acceptRentingReturn($input: AcceptRentingReturnInput!) {\n    acceptRentingReturn(input: $input) {\n      __typename\n      rentingStatus\n      updatedAt\n      id\n    }\n  }\n": graphql.AcceptRentingReturnDocument,
    "\n  query MyRentals {\n    me {\n      id\n      myRentals {\n        edges {\n          node {\n            __typename\n            id\n            scheduledStartTime\n            scheduledEndTime\n            rentingStatus\n            updatedAt\n            renterFeedback {\n              __typename\n              id\n            }\n            listing {\n              ...ListingListItemFragment\n            }\n          }\n        }\n      }\n    }\n  }\n": graphql.MyRentalsDocument,
    "\n  query RentalPaymentInfo($nodeId: ID!) {\n    node(id: $nodeId) {\n      __typename\n      id\n      ... on Renting {\n        listing {\n          __typename\n          id\n          title\n          imageUrl\n          dayPriceEuroCents\n          owner {\n            __typename\n            id\n            name\n            isMe\n            ...PersonLineFragment\n          }\n        }\n      }\n    }\n  }\n": graphql.RentalPaymentInfoDocument,
    "\n  mutation payForRentingc($input: PayForRentingInput!) {\n    payForRenting(input: $input) {\n      __typename\n      id\n      rentingStatus\n      updatedAt\n    }\n  }\n": graphql.PayForRentingcDocument,
    "\n  fragment PersonCardFragment on User {\n    __typename\n    id\n    isMe\n    name\n    imageUrl\n    listingCount\n    rentingOwnerCount\n    rentingRenterCount\n    ratingCount\n    rating\n  }\n": graphql.PersonCardFragmentFragmentDoc,
    "\n  fragment PersonLineFragment on User {\n    __typename\n    id\n    name\n    imageUrl\n    listingCount\n  }\n": graphql.PersonLineFragmentFragmentDoc,
};

export function gql(source: "\n  query Listings {\n    listings {\n      edges {\n        node {\n          __typename\n          id\n          ...ListingListItemFragment\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query Listings {\n    listings {\n      edges {\n        node {\n          __typename\n          id\n          ...ListingListItemFragment\n        }\n      }\n    }\n  }\n"];
export function gql(source: "\n  mutation cancelRenting($input: CancelRentingInput!) {\n    cancelRenting(input: $input) {\n      __typename\n      rentingStatus\n      updatedAt\n      id\n    }\n  }\n"): (typeof documents)["\n  mutation cancelRenting($input: CancelRentingInput!) {\n    cancelRenting(input: $input) {\n      __typename\n      rentingStatus\n      updatedAt\n      id\n    }\n  }\n"];
export function gql(source: "\n  query ConverstionMessages($nodeId: ID!) {\n    node(id: $nodeId) {\n      ... on Conversation {\n        messages {\n          edges {\n            node {\n              text\n              sender {\n                imageUrl\n                id\n                isMe\n              }\n              createdAt\n              id\n            }\n          }\n        }\n        id\n        createdAt\n      }\n    }\n  }\n"): (typeof documents)["\n  query ConverstionMessages($nodeId: ID!) {\n    node(id: $nodeId) {\n      ... on Conversation {\n        messages {\n          edges {\n            node {\n              text\n              sender {\n                imageUrl\n                id\n                isMe\n              }\n              createdAt\n              id\n            }\n          }\n        }\n        id\n        createdAt\n      }\n    }\n  }\n"];
export function gql(source: "\n  mutation sendMessage($input: SendMessageInput!) {\n    sendMessage(input: $input) {\n      __typename\n      id\n      conversation {\n        __typename\n        id\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation sendMessage($input: SendMessageInput!) {\n    sendMessage(input: $input) {\n      __typename\n      id\n      conversation {\n        __typename\n        id\n      }\n    }\n  }\n"];
export function gql(source: "\n  mutation createListing($input: ListingInput!) {\n    createListing(input: $input) {\n      id\n      description\n      imageUrl\n      title\n      dayPriceEuroCents\n      depositEuroCents\n    }\n  }\n"): (typeof documents)["\n  mutation createListing($input: ListingInput!) {\n    createListing(input: $input) {\n      id\n      description\n      imageUrl\n      title\n      dayPriceEuroCents\n      depositEuroCents\n    }\n  }\n"];
export function gql(source: "\n  fragment FeedbackListItemFragment on Feedback {\n    __typename\n    id\n    createdAt\n    rating\n    text\n    renter {\n      __typename\n      id\n      name\n      imageUrl\n    }\n  }\n"): (typeof documents)["\n  fragment FeedbackListItemFragment on Feedback {\n    __typename\n    id\n    createdAt\n    rating\n    text\n    renter {\n      __typename\n      id\n      name\n      imageUrl\n    }\n  }\n"];
export function gql(source: "\n  mutation leveFeedback($input: LeaveFeedbackInput!) {\n    leaveFeedback(input: $input) {\n      __typename\n      id\n    }\n  }\n"): (typeof documents)["\n  mutation leveFeedback($input: LeaveFeedbackInput!) {\n    leaveFeedback(input: $input) {\n      __typename\n      id\n    }\n  }\n"];
export function gql(source: "\n  query Listing($nodeId: ID!) {\n    node(id: $nodeId) {\n      __typename\n      id\n      ... on Listing {\n        id\n        title\n        description\n        imageUrl\n        dayPriceEuroCents\n        rating\n        latitude\n        longitude\n        owner {\n          isMe\n          ...PersonCardFragment\n        }\n        feedback {\n          edges {\n            node {\n              ...FeedbackListItemFragment\n            }\n          }\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query Listing($nodeId: ID!) {\n    node(id: $nodeId) {\n      __typename\n      id\n      ... on Listing {\n        id\n        title\n        description\n        imageUrl\n        dayPriceEuroCents\n        rating\n        latitude\n        longitude\n        owner {\n          isMe\n          ...PersonCardFragment\n        }\n        feedback {\n          edges {\n            node {\n              ...FeedbackListItemFragment\n            }\n          }\n        }\n      }\n    }\n  }\n"];
export function gql(source: "\n  fragment ListingListItemFragment on Listing {\n    __typename\n    id\n    title\n    imageUrl\n    dayPriceEuroCents\n    owner {\n      __typename\n      id\n      name\n      isMe\n      ...PersonLineFragment\n    }\n  }\n"): (typeof documents)["\n  fragment ListingListItemFragment on Listing {\n    __typename\n    id\n    title\n    imageUrl\n    dayPriceEuroCents\n    owner {\n      __typename\n      id\n      name\n      isMe\n      ...PersonLineFragment\n    }\n  }\n"];
export function gql(source: "\n  query ListingRentalRequest($nodeId: ID!) {\n    node(id: $nodeId) {\n      __typename\n      id\n      ... on Listing {\n        dayPriceEuroCents\n        unavailableDays\n      }\n    }\n  }\n"): (typeof documents)["\n  query ListingRentalRequest($nodeId: ID!) {\n    node(id: $nodeId) {\n      __typename\n      id\n      ... on Listing {\n        dayPriceEuroCents\n        unavailableDays\n      }\n    }\n  }\n"];
export function gql(source: "\n  mutation makeRentingRequest($input: MakeRentingRequestInput!) {\n    makeRentingRequest(input: $input) {\n      __typename\n      id\n      rentingStatus\n      updatedAt\n    }\n  }\n"): (typeof documents)["\n  mutation makeRentingRequest($input: MakeRentingRequestInput!) {\n    makeRentingRequest(input: $input) {\n      __typename\n      id\n      rentingStatus\n      updatedAt\n    }\n  }\n"];
export function gql(source: "\n  query MyConversations {\n    me {\n      __typename\n      id\n      conversations {\n        edges {\n          node {\n            __typename\n            id\n            createdAt\n            listing {\n              __typename\n              id\n              imageUrl\n            }\n            latestMessage {\n              __typename\n              id\n              text\n              createdAt\n              sender {\n                __typename\n                id\n                name\n                imageUrl\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query MyConversations {\n    me {\n      __typename\n      id\n      conversations {\n        edges {\n          node {\n            __typename\n            id\n            createdAt\n            listing {\n              __typename\n              id\n              imageUrl\n            }\n            latestMessage {\n              __typename\n              id\n              text\n              createdAt\n              sender {\n                __typename\n                id\n                name\n                imageUrl\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n"];
export function gql(source: "\n  query MyListings {\n    me {\n      id\n      myListings {\n        edges {\n          node {\n            __typename\n            id\n            ...ListingListItemFragment\n            rentings {\n              ...OwnerRentingFragment\n            }\n          }\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query MyListings {\n    me {\n      id\n      myListings {\n        edges {\n          node {\n            __typename\n            id\n            ...ListingListItemFragment\n            rentings {\n              ...OwnerRentingFragment\n            }\n          }\n        }\n      }\n    }\n  }\n"];
export function gql(source: "\n  fragment OwnerRentingFragment on Renting {\n    __typename\n    id\n    rentingStatus\n    scheduledStartTime\n    scheduledEndTime\n    ownerFeedback {\n      __typename\n      id\n    }\n    updatedAt\n    renter {\n      __typename\n      id\n      ...PersonLineFragment\n    }\n  }\n"): (typeof documents)["\n  fragment OwnerRentingFragment on Renting {\n    __typename\n    id\n    rentingStatus\n    scheduledStartTime\n    scheduledEndTime\n    ownerFeedback {\n      __typename\n      id\n    }\n    updatedAt\n    renter {\n      __typename\n      id\n      ...PersonLineFragment\n    }\n  }\n"];
export function gql(source: "\n  mutation declineRentingRequest($input: DeclineRentingRequestInput!) {\n    declineRentingRequest(input: $input) {\n      __typename\n      rentingStatus\n      updatedAt\n      id\n    }\n  }\n"): (typeof documents)["\n  mutation declineRentingRequest($input: DeclineRentingRequestInput!) {\n    declineRentingRequest(input: $input) {\n      __typename\n      rentingStatus\n      updatedAt\n      id\n    }\n  }\n"];
export function gql(source: "\n  mutation acceptRentingRequest($input: AcceptRentingRequestInput!) {\n    acceptRentingRequest(input: $input) {\n      __typename\n      rentingStatus\n      updatedAt\n      id\n    }\n  }\n"): (typeof documents)["\n  mutation acceptRentingRequest($input: AcceptRentingRequestInput!) {\n    acceptRentingRequest(input: $input) {\n      __typename\n      rentingStatus\n      updatedAt\n      id\n    }\n  }\n"];
export function gql(source: "\n  mutation acceptRentingReturn($input: AcceptRentingReturnInput!) {\n    acceptRentingReturn(input: $input) {\n      __typename\n      rentingStatus\n      updatedAt\n      id\n    }\n  }\n"): (typeof documents)["\n  mutation acceptRentingReturn($input: AcceptRentingReturnInput!) {\n    acceptRentingReturn(input: $input) {\n      __typename\n      rentingStatus\n      updatedAt\n      id\n    }\n  }\n"];
export function gql(source: "\n  query MyRentals {\n    me {\n      id\n      myRentals {\n        edges {\n          node {\n            __typename\n            id\n            scheduledStartTime\n            scheduledEndTime\n            rentingStatus\n            updatedAt\n            renterFeedback {\n              __typename\n              id\n            }\n            listing {\n              ...ListingListItemFragment\n            }\n          }\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query MyRentals {\n    me {\n      id\n      myRentals {\n        edges {\n          node {\n            __typename\n            id\n            scheduledStartTime\n            scheduledEndTime\n            rentingStatus\n            updatedAt\n            renterFeedback {\n              __typename\n              id\n            }\n            listing {\n              ...ListingListItemFragment\n            }\n          }\n        }\n      }\n    }\n  }\n"];
export function gql(source: "\n  query RentalPaymentInfo($nodeId: ID!) {\n    node(id: $nodeId) {\n      __typename\n      id\n      ... on Renting {\n        listing {\n          __typename\n          id\n          title\n          imageUrl\n          dayPriceEuroCents\n          owner {\n            __typename\n            id\n            name\n            isMe\n            ...PersonLineFragment\n          }\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query RentalPaymentInfo($nodeId: ID!) {\n    node(id: $nodeId) {\n      __typename\n      id\n      ... on Renting {\n        listing {\n          __typename\n          id\n          title\n          imageUrl\n          dayPriceEuroCents\n          owner {\n            __typename\n            id\n            name\n            isMe\n            ...PersonLineFragment\n          }\n        }\n      }\n    }\n  }\n"];
export function gql(source: "\n  mutation payForRentingc($input: PayForRentingInput!) {\n    payForRenting(input: $input) {\n      __typename\n      id\n      rentingStatus\n      updatedAt\n    }\n  }\n"): (typeof documents)["\n  mutation payForRentingc($input: PayForRentingInput!) {\n    payForRenting(input: $input) {\n      __typename\n      id\n      rentingStatus\n      updatedAt\n    }\n  }\n"];
export function gql(source: "\n  fragment PersonCardFragment on User {\n    __typename\n    id\n    isMe\n    name\n    imageUrl\n    listingCount\n    rentingOwnerCount\n    rentingRenterCount\n    ratingCount\n    rating\n  }\n"): (typeof documents)["\n  fragment PersonCardFragment on User {\n    __typename\n    id\n    isMe\n    name\n    imageUrl\n    listingCount\n    rentingOwnerCount\n    rentingRenterCount\n    ratingCount\n    rating\n  }\n"];
export function gql(source: "\n  fragment PersonLineFragment on User {\n    __typename\n    id\n    name\n    imageUrl\n    listingCount\n  }\n"): (typeof documents)["\n  fragment PersonLineFragment on User {\n    __typename\n    id\n    name\n    imageUrl\n    listingCount\n  }\n"];

export function gql(source: string): unknown;
export function gql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;