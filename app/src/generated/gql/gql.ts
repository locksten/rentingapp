/* eslint-disable */
import * as graphql from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

const documents = {
    "\n  query MyAccountDetails {\n    me {\n      id\n      user {\n        id\n        isMe\n        isAdmin\n        isStripeAccountOnboarded\n        ...PersonCardFragment\n      }\n    }\n  }\n": graphql.MyAccountDetailsDocument,
    "\n  query MyStripeOnboardingLink {\n    me {\n      id\n      stripeOnboardingLink\n    }\n  }\n": graphql.MyStripeOnboardingLinkDocument,
    "\n  query MyStripeAccountLoginLink {\n    me {\n      id\n      stripeAccountLoginLink\n    }\n  }\n": graphql.MyStripeAccountLoginLinkDocument,
    "\n  mutation cancelRenting($input: CancelRentingInput!) {\n    cancelRenting(input: $input) {\n      __typename\n      rentingStatus\n      updatedAt\n      id\n    }\n  }\n": graphql.CancelRentingDocument,
    "\n  query ConversationMessages($nodeId: ID!) {\n    node(id: $nodeId) {\n      __typename\n      id\n      ... on Conversation {\n        id\n        createdAt\n        messages {\n          edges {\n            node {\n              id\n              text\n              createdAt\n              sender {\n                imageUrl\n                id\n                isMe\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n": graphql.ConversationMessagesDocument,
    "\n  mutation sendMessage($input: SendMessageInput!) {\n    sendMessage(input: $input) {\n      __typename\n      id\n      conversation {\n        __typename\n        id\n      }\n    }\n  }\n": graphql.SendMessageDocument,
    "\n  mutation CreateSupportConversation {\n    createSupportConversation {\n      __typename\n      id\n    }\n  }\n": graphql.CreateSupportConversationDocument,
    "\n  mutation createListing($input: ListingInput!) {\n    createListing(input: $input) {\n      id\n      description\n      imageUrl\n      title\n      dayPriceEuroCents\n    }\n  }\n": graphql.CreateListingDocument,
    "\n  fragment FeedbackListItemFragment on Feedback {\n    __typename\n    id\n    createdAt\n    rating\n    text\n    renter {\n      __typename\n      id\n      name\n      imageUrl\n    }\n  }\n": graphql.FeedbackListItemFragmentFragmentDoc,
    "\n  query Feedback($nodeId: ID!) {\n    node(id: $nodeId) {\n      __typename\n      id\n      ... on Feedback {\n        id\n        text\n        reports {\n          id\n          __typename\n          ...ReportFragment\n        }\n        ...FeedbackListItemFragment\n      }\n    }\n  }\n": graphql.FeedbackDocument,
    "\n  mutation leveFeedback($input: LeaveFeedbackInput!) {\n    leaveFeedback(input: $input) {\n      __typename\n      id\n    }\n  }\n": graphql.LeveFeedbackDocument,
    "\n  query Listing($nodeId: ID!) {\n    node(id: $nodeId) {\n      __typename\n      id\n      ... on Listing {\n        id\n        title\n        description\n        imageUrl\n        dayPriceEuroCents\n        rating\n        category\n        latitude\n        longitude\n        reports {\n          id\n          __typename\n          ...ReportFragment\n        }\n        owner {\n          isMe\n          ...PersonCardFragment\n        }\n        feedback {\n          edges {\n            node {\n              ...FeedbackListItemFragment\n            }\n          }\n        }\n      }\n    }\n  }\n": graphql.ListingDocument,
    "\n  fragment ListingListItemFragment on Listing {\n    __typename\n    id\n    title\n    imageUrl\n    dayPriceEuroCents\n    owner {\n      __typename\n      id\n      name\n      isMe\n      ...PersonLineFragment\n    }\n  }\n": graphql.ListingListItemFragmentFragmentDoc,
    "\n  query ListingRentalRequest($nodeId: ID!) {\n    node(id: $nodeId) {\n      __typename\n      id\n      ... on Listing {\n        dayPriceEuroCents\n        unavailableDays\n        owner {\n          __typename\n          id\n          isStripeAccountOnboarded\n        }\n      }\n    }\n  }\n": graphql.ListingRentalRequestDocument,
    "\n  mutation makeRentingRequest($input: MakeRentingRequestInput!) {\n    makeRentingRequest(input: $input) {\n      __typename\n      id\n      rentingStatus\n      updatedAt\n    }\n  }\n": graphql.MakeRentingRequestDocument,
    "\n  mutation makeReport($input: MakeReportInput!) {\n    makeReport(input: $input) {\n      __typename\n      id\n    }\n  }\n": graphql.MakeReportDocument,
    "\n  query MyConversations {\n    me {\n      __typename\n      id\n      conversations {\n        edges {\n          node {\n            __typename\n            id\n            createdAt\n            otherParticipant {\n              __typename\n              id\n              imageUrl\n              name\n              isAdmin\n            }\n            latestMessage {\n              __typename\n              id\n              text\n              createdAt\n              sender {\n                __typename\n                id\n                name\n                imageUrl\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n": graphql.MyConversationsDocument,
    "\n  query MyListings {\n    me {\n      id\n      myListings {\n        edges {\n          node {\n            __typename\n            id\n            updatedAt\n            ...ListingListItemFragment\n            rentings {\n              __typename\n              id\n              updatedAt\n              ...OwnerRentingFragment\n            }\n          }\n        }\n      }\n    }\n  }\n": graphql.MyListingsDocument,
    "\n  fragment OwnerRentingFragment on Renting {\n    __typename\n    id\n    rentingStatus\n    scheduledStartTime\n    scheduledEndTime\n    ownerFeedback {\n      __typename\n      id\n    }\n    updatedAt\n    renter {\n      __typename\n      id\n      ...PersonLineFragment\n    }\n  }\n": graphql.OwnerRentingFragmentFragmentDoc,
    "\n  mutation declineRentingRequest($input: DeclineRentingRequestInput!) {\n    declineRentingRequest(input: $input) {\n      __typename\n      rentingStatus\n      updatedAt\n      id\n    }\n  }\n": graphql.DeclineRentingRequestDocument,
    "\n  mutation acceptRentingRequest($input: AcceptRentingRequestInput!) {\n    acceptRentingRequest(input: $input) {\n      __typename\n      rentingStatus\n      updatedAt\n      id\n    }\n  }\n": graphql.AcceptRentingRequestDocument,
    "\n  mutation acceptRentingReturn($input: AcceptRentingReturnInput!) {\n    acceptRentingReturn(input: $input) {\n      __typename\n      rentingStatus\n      updatedAt\n      id\n    }\n  }\n": graphql.AcceptRentingReturnDocument,
    "\n  mutation settleRentingOutsideApp($input: SettleRentingOutsideAppInput!) {\n    settleRentingOutsideApp(input: $input) {\n      __typename\n      rentingStatus\n      updatedAt\n      id\n    }\n  }\n": graphql.SettleRentingOutsideAppDocument,
    "\n  query MyRentals {\n    me {\n      id\n      myRentals {\n        edges {\n          node {\n            __typename\n            id\n            scheduledStartTime\n            scheduledEndTime\n            rentingStatus\n            updatedAt\n            renterFeedback {\n              __typename\n              id\n            }\n            listing {\n              ...ListingListItemFragment\n            }\n          }\n        }\n      }\n    }\n  }\n": graphql.MyRentalsDocument,
    "\n  query RentingPaymentIntent($nodeId: ID!) {\n    node(id: $nodeId) {\n      ... on Renting {\n        id\n        __typename\n        paymentIntentClientSecret\n      }\n    }\n  }\n": graphql.RentingPaymentIntentDocument,
    "\n  query RentalPaymentInfo($nodeId: ID!) {\n    node(id: $nodeId) {\n      __typename\n      id\n      ... on Renting {\n        listing {\n          __typename\n          id\n          title\n          imageUrl\n          dayPriceEuroCents\n          owner {\n            __typename\n            id\n            name\n            isMe\n            ...PersonLineFragment\n          }\n        }\n      }\n    }\n  }\n": graphql.RentalPaymentInfoDocument,
    "\n  mutation payForRentingc($input: PayForRentingInput!) {\n    payForRenting(input: $input) {\n      __typename\n      id\n      rentingStatus\n      updatedAt\n    }\n  }\n": graphql.PayForRentingcDocument,
    "\n  fragment PersonCardFragment on User {\n    __typename\n    id\n    isAdmin\n    isBanned\n    isMe\n    name\n    imageUrl\n    listingCount\n    rentingOwnerCount\n    rentingRenterCount\n    ratingCount\n    rating\n    isStripeAccountOnboarded\n    conversation {\n      __typename\n      id\n    }\n  }\n": graphql.PersonCardFragmentFragmentDoc,
    "\n  mutation banUser($input: BanUserInput!) {\n    banUser(input: $input) {\n      __typename\n      id\n      name\n      isBanned\n      isAdmin\n    }\n  }\n": graphql.BanUserDocument,
    "\n  fragment PersonLineFragment on User {\n    __typename\n    id\n    name\n    imageUrl\n    listingCount\n  }\n": graphql.PersonLineFragmentFragmentDoc,
    "\n  query User($nodeId: ID!) {\n    node(id: $nodeId) {\n      ... on User {\n        __typename\n        id\n        name\n        ...PersonCardFragment\n        listings {\n          __typename\n          id\n          updatedAt\n          ...ListingListItemFragment\n        }\n      }\n    }\n  }\n": graphql.UserDocument,
    "\n  fragment ReportFragment on Report {\n    __typename\n    id\n    isDismissed\n    reason\n  }\n": graphql.ReportFragmentFragmentDoc,
    "\n  mutation dismissReports($input: DismissReportsInput!) {\n    dismissReports(input: $input)\n  }\n": graphql.DismissReportsDocument,
    "\n  mutation removeListing($input: RemoveListingInput!) {\n    removeListing(input: $input) {\n      __typename\n      id\n      title\n      description\n      imageUrl\n      dayPriceEuroCents\n      category\n      latitude\n      longitude\n    }\n  }\n": graphql.RemoveListingDocument,
    "\n  mutation removeFeedback($input: RemoveFeedbackInput!) {\n    removeFeedback(input: $input) {\n      __typename\n      id\n      text\n      rating\n    }\n  }\n": graphql.RemoveFeedbackDocument,
    "\n  query ReportedListings {\n    reportedListings {\n      edges {\n        node {\n          id\n          __typename\n          updatedAt\n          ...ListingListItemFragment\n          reports {\n            id\n            __typename\n            ...ReportFragment\n          }\n        }\n      }\n    }\n  }\n": graphql.ReportedListingsDocument,
    "\n  query ReportedFeedbacks {\n    reportedFeedbacks {\n      edges {\n        node {\n          id\n          __typename\n          updatedAt\n          ...FeedbackListItemFragment\n          reports {\n            id\n            __typename\n            ...ReportFragment\n          }\n        }\n      }\n    }\n  }\n": graphql.ReportedFeedbacksDocument,
    "\n  fragment ListingMapMarkerFragment on Listing {\n    __typename\n    id\n    title\n    dayPriceEuroCents\n    latitude\n    longitude\n  }\n": graphql.ListingMapMarkerFragmentFragmentDoc,
    "\n  query SearchListings(\n    $searchTerm: String\n    $toPriceEuroCents: Int\n    $fromPriceEuroCents: Int\n    $category: String\n    $latitudeMin: Float\n    $latitudeMax: Float\n    $longitudeMin: Float\n    $longitudeMax: Float\n  ) {\n    listings(\n      searchTerm: $searchTerm\n      toPriceEuroCents: $toPriceEuroCents\n      fromPriceEuroCents: $fromPriceEuroCents\n      category: $category\n      latitudeMin: $latitudeMin\n      latitudeMax: $latitudeMax\n      longitudeMin: $longitudeMin\n      longitudeMax: $longitudeMax\n    ) {\n      edges {\n        node {\n          __typename\n          id\n          updatedAt\n          ...ListingListItemFragment\n          ...ListingMapMarkerFragment\n        }\n      }\n    }\n  }\n": graphql.SearchListingsDocument,
    "\n  query ListingAvailability($nodeId: ID!) {\n    node(id: $nodeId) {\n      __typename\n      id\n      ... on Listing {\n        ownerUnavailableDays\n      }\n    }\n  }\n": graphql.ListingAvailabilityDocument,
    "\n  mutation updateListingUnavailableDates(\n    $input: UpdateListingUnavailableDatesInput!\n  ) {\n    updateListingUnavailableDates(input: $input) {\n      __typename\n      id\n      updatedAt\n      ownerUnavailableDays\n    }\n  }\n": graphql.UpdateListingUnavailableDatesDocument,
};

export function gql(source: "\n  query MyAccountDetails {\n    me {\n      id\n      user {\n        id\n        isMe\n        isAdmin\n        isStripeAccountOnboarded\n        ...PersonCardFragment\n      }\n    }\n  }\n"): (typeof documents)["\n  query MyAccountDetails {\n    me {\n      id\n      user {\n        id\n        isMe\n        isAdmin\n        isStripeAccountOnboarded\n        ...PersonCardFragment\n      }\n    }\n  }\n"];
export function gql(source: "\n  query MyStripeOnboardingLink {\n    me {\n      id\n      stripeOnboardingLink\n    }\n  }\n"): (typeof documents)["\n  query MyStripeOnboardingLink {\n    me {\n      id\n      stripeOnboardingLink\n    }\n  }\n"];
export function gql(source: "\n  query MyStripeAccountLoginLink {\n    me {\n      id\n      stripeAccountLoginLink\n    }\n  }\n"): (typeof documents)["\n  query MyStripeAccountLoginLink {\n    me {\n      id\n      stripeAccountLoginLink\n    }\n  }\n"];
export function gql(source: "\n  mutation cancelRenting($input: CancelRentingInput!) {\n    cancelRenting(input: $input) {\n      __typename\n      rentingStatus\n      updatedAt\n      id\n    }\n  }\n"): (typeof documents)["\n  mutation cancelRenting($input: CancelRentingInput!) {\n    cancelRenting(input: $input) {\n      __typename\n      rentingStatus\n      updatedAt\n      id\n    }\n  }\n"];
export function gql(source: "\n  query ConversationMessages($nodeId: ID!) {\n    node(id: $nodeId) {\n      __typename\n      id\n      ... on Conversation {\n        id\n        createdAt\n        messages {\n          edges {\n            node {\n              id\n              text\n              createdAt\n              sender {\n                imageUrl\n                id\n                isMe\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query ConversationMessages($nodeId: ID!) {\n    node(id: $nodeId) {\n      __typename\n      id\n      ... on Conversation {\n        id\n        createdAt\n        messages {\n          edges {\n            node {\n              id\n              text\n              createdAt\n              sender {\n                imageUrl\n                id\n                isMe\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n"];
export function gql(source: "\n  mutation sendMessage($input: SendMessageInput!) {\n    sendMessage(input: $input) {\n      __typename\n      id\n      conversation {\n        __typename\n        id\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation sendMessage($input: SendMessageInput!) {\n    sendMessage(input: $input) {\n      __typename\n      id\n      conversation {\n        __typename\n        id\n      }\n    }\n  }\n"];
export function gql(source: "\n  mutation CreateSupportConversation {\n    createSupportConversation {\n      __typename\n      id\n    }\n  }\n"): (typeof documents)["\n  mutation CreateSupportConversation {\n    createSupportConversation {\n      __typename\n      id\n    }\n  }\n"];
export function gql(source: "\n  mutation createListing($input: ListingInput!) {\n    createListing(input: $input) {\n      id\n      description\n      imageUrl\n      title\n      dayPriceEuroCents\n    }\n  }\n"): (typeof documents)["\n  mutation createListing($input: ListingInput!) {\n    createListing(input: $input) {\n      id\n      description\n      imageUrl\n      title\n      dayPriceEuroCents\n    }\n  }\n"];
export function gql(source: "\n  fragment FeedbackListItemFragment on Feedback {\n    __typename\n    id\n    createdAt\n    rating\n    text\n    renter {\n      __typename\n      id\n      name\n      imageUrl\n    }\n  }\n"): (typeof documents)["\n  fragment FeedbackListItemFragment on Feedback {\n    __typename\n    id\n    createdAt\n    rating\n    text\n    renter {\n      __typename\n      id\n      name\n      imageUrl\n    }\n  }\n"];
export function gql(source: "\n  query Feedback($nodeId: ID!) {\n    node(id: $nodeId) {\n      __typename\n      id\n      ... on Feedback {\n        id\n        text\n        reports {\n          id\n          __typename\n          ...ReportFragment\n        }\n        ...FeedbackListItemFragment\n      }\n    }\n  }\n"): (typeof documents)["\n  query Feedback($nodeId: ID!) {\n    node(id: $nodeId) {\n      __typename\n      id\n      ... on Feedback {\n        id\n        text\n        reports {\n          id\n          __typename\n          ...ReportFragment\n        }\n        ...FeedbackListItemFragment\n      }\n    }\n  }\n"];
export function gql(source: "\n  mutation leveFeedback($input: LeaveFeedbackInput!) {\n    leaveFeedback(input: $input) {\n      __typename\n      id\n    }\n  }\n"): (typeof documents)["\n  mutation leveFeedback($input: LeaveFeedbackInput!) {\n    leaveFeedback(input: $input) {\n      __typename\n      id\n    }\n  }\n"];
export function gql(source: "\n  query Listing($nodeId: ID!) {\n    node(id: $nodeId) {\n      __typename\n      id\n      ... on Listing {\n        id\n        title\n        description\n        imageUrl\n        dayPriceEuroCents\n        rating\n        category\n        latitude\n        longitude\n        reports {\n          id\n          __typename\n          ...ReportFragment\n        }\n        owner {\n          isMe\n          ...PersonCardFragment\n        }\n        feedback {\n          edges {\n            node {\n              ...FeedbackListItemFragment\n            }\n          }\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query Listing($nodeId: ID!) {\n    node(id: $nodeId) {\n      __typename\n      id\n      ... on Listing {\n        id\n        title\n        description\n        imageUrl\n        dayPriceEuroCents\n        rating\n        category\n        latitude\n        longitude\n        reports {\n          id\n          __typename\n          ...ReportFragment\n        }\n        owner {\n          isMe\n          ...PersonCardFragment\n        }\n        feedback {\n          edges {\n            node {\n              ...FeedbackListItemFragment\n            }\n          }\n        }\n      }\n    }\n  }\n"];
export function gql(source: "\n  fragment ListingListItemFragment on Listing {\n    __typename\n    id\n    title\n    imageUrl\n    dayPriceEuroCents\n    owner {\n      __typename\n      id\n      name\n      isMe\n      ...PersonLineFragment\n    }\n  }\n"): (typeof documents)["\n  fragment ListingListItemFragment on Listing {\n    __typename\n    id\n    title\n    imageUrl\n    dayPriceEuroCents\n    owner {\n      __typename\n      id\n      name\n      isMe\n      ...PersonLineFragment\n    }\n  }\n"];
export function gql(source: "\n  query ListingRentalRequest($nodeId: ID!) {\n    node(id: $nodeId) {\n      __typename\n      id\n      ... on Listing {\n        dayPriceEuroCents\n        unavailableDays\n        owner {\n          __typename\n          id\n          isStripeAccountOnboarded\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query ListingRentalRequest($nodeId: ID!) {\n    node(id: $nodeId) {\n      __typename\n      id\n      ... on Listing {\n        dayPriceEuroCents\n        unavailableDays\n        owner {\n          __typename\n          id\n          isStripeAccountOnboarded\n        }\n      }\n    }\n  }\n"];
export function gql(source: "\n  mutation makeRentingRequest($input: MakeRentingRequestInput!) {\n    makeRentingRequest(input: $input) {\n      __typename\n      id\n      rentingStatus\n      updatedAt\n    }\n  }\n"): (typeof documents)["\n  mutation makeRentingRequest($input: MakeRentingRequestInput!) {\n    makeRentingRequest(input: $input) {\n      __typename\n      id\n      rentingStatus\n      updatedAt\n    }\n  }\n"];
export function gql(source: "\n  mutation makeReport($input: MakeReportInput!) {\n    makeReport(input: $input) {\n      __typename\n      id\n    }\n  }\n"): (typeof documents)["\n  mutation makeReport($input: MakeReportInput!) {\n    makeReport(input: $input) {\n      __typename\n      id\n    }\n  }\n"];
export function gql(source: "\n  query MyConversations {\n    me {\n      __typename\n      id\n      conversations {\n        edges {\n          node {\n            __typename\n            id\n            createdAt\n            otherParticipant {\n              __typename\n              id\n              imageUrl\n              name\n              isAdmin\n            }\n            latestMessage {\n              __typename\n              id\n              text\n              createdAt\n              sender {\n                __typename\n                id\n                name\n                imageUrl\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query MyConversations {\n    me {\n      __typename\n      id\n      conversations {\n        edges {\n          node {\n            __typename\n            id\n            createdAt\n            otherParticipant {\n              __typename\n              id\n              imageUrl\n              name\n              isAdmin\n            }\n            latestMessage {\n              __typename\n              id\n              text\n              createdAt\n              sender {\n                __typename\n                id\n                name\n                imageUrl\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n"];
export function gql(source: "\n  query MyListings {\n    me {\n      id\n      myListings {\n        edges {\n          node {\n            __typename\n            id\n            updatedAt\n            ...ListingListItemFragment\n            rentings {\n              __typename\n              id\n              updatedAt\n              ...OwnerRentingFragment\n            }\n          }\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query MyListings {\n    me {\n      id\n      myListings {\n        edges {\n          node {\n            __typename\n            id\n            updatedAt\n            ...ListingListItemFragment\n            rentings {\n              __typename\n              id\n              updatedAt\n              ...OwnerRentingFragment\n            }\n          }\n        }\n      }\n    }\n  }\n"];
export function gql(source: "\n  fragment OwnerRentingFragment on Renting {\n    __typename\n    id\n    rentingStatus\n    scheduledStartTime\n    scheduledEndTime\n    ownerFeedback {\n      __typename\n      id\n    }\n    updatedAt\n    renter {\n      __typename\n      id\n      ...PersonLineFragment\n    }\n  }\n"): (typeof documents)["\n  fragment OwnerRentingFragment on Renting {\n    __typename\n    id\n    rentingStatus\n    scheduledStartTime\n    scheduledEndTime\n    ownerFeedback {\n      __typename\n      id\n    }\n    updatedAt\n    renter {\n      __typename\n      id\n      ...PersonLineFragment\n    }\n  }\n"];
export function gql(source: "\n  mutation declineRentingRequest($input: DeclineRentingRequestInput!) {\n    declineRentingRequest(input: $input) {\n      __typename\n      rentingStatus\n      updatedAt\n      id\n    }\n  }\n"): (typeof documents)["\n  mutation declineRentingRequest($input: DeclineRentingRequestInput!) {\n    declineRentingRequest(input: $input) {\n      __typename\n      rentingStatus\n      updatedAt\n      id\n    }\n  }\n"];
export function gql(source: "\n  mutation acceptRentingRequest($input: AcceptRentingRequestInput!) {\n    acceptRentingRequest(input: $input) {\n      __typename\n      rentingStatus\n      updatedAt\n      id\n    }\n  }\n"): (typeof documents)["\n  mutation acceptRentingRequest($input: AcceptRentingRequestInput!) {\n    acceptRentingRequest(input: $input) {\n      __typename\n      rentingStatus\n      updatedAt\n      id\n    }\n  }\n"];
export function gql(source: "\n  mutation acceptRentingReturn($input: AcceptRentingReturnInput!) {\n    acceptRentingReturn(input: $input) {\n      __typename\n      rentingStatus\n      updatedAt\n      id\n    }\n  }\n"): (typeof documents)["\n  mutation acceptRentingReturn($input: AcceptRentingReturnInput!) {\n    acceptRentingReturn(input: $input) {\n      __typename\n      rentingStatus\n      updatedAt\n      id\n    }\n  }\n"];
export function gql(source: "\n  mutation settleRentingOutsideApp($input: SettleRentingOutsideAppInput!) {\n    settleRentingOutsideApp(input: $input) {\n      __typename\n      rentingStatus\n      updatedAt\n      id\n    }\n  }\n"): (typeof documents)["\n  mutation settleRentingOutsideApp($input: SettleRentingOutsideAppInput!) {\n    settleRentingOutsideApp(input: $input) {\n      __typename\n      rentingStatus\n      updatedAt\n      id\n    }\n  }\n"];
export function gql(source: "\n  query MyRentals {\n    me {\n      id\n      myRentals {\n        edges {\n          node {\n            __typename\n            id\n            scheduledStartTime\n            scheduledEndTime\n            rentingStatus\n            updatedAt\n            renterFeedback {\n              __typename\n              id\n            }\n            listing {\n              ...ListingListItemFragment\n            }\n          }\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query MyRentals {\n    me {\n      id\n      myRentals {\n        edges {\n          node {\n            __typename\n            id\n            scheduledStartTime\n            scheduledEndTime\n            rentingStatus\n            updatedAt\n            renterFeedback {\n              __typename\n              id\n            }\n            listing {\n              ...ListingListItemFragment\n            }\n          }\n        }\n      }\n    }\n  }\n"];
export function gql(source: "\n  query RentingPaymentIntent($nodeId: ID!) {\n    node(id: $nodeId) {\n      ... on Renting {\n        id\n        __typename\n        paymentIntentClientSecret\n      }\n    }\n  }\n"): (typeof documents)["\n  query RentingPaymentIntent($nodeId: ID!) {\n    node(id: $nodeId) {\n      ... on Renting {\n        id\n        __typename\n        paymentIntentClientSecret\n      }\n    }\n  }\n"];
export function gql(source: "\n  query RentalPaymentInfo($nodeId: ID!) {\n    node(id: $nodeId) {\n      __typename\n      id\n      ... on Renting {\n        listing {\n          __typename\n          id\n          title\n          imageUrl\n          dayPriceEuroCents\n          owner {\n            __typename\n            id\n            name\n            isMe\n            ...PersonLineFragment\n          }\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query RentalPaymentInfo($nodeId: ID!) {\n    node(id: $nodeId) {\n      __typename\n      id\n      ... on Renting {\n        listing {\n          __typename\n          id\n          title\n          imageUrl\n          dayPriceEuroCents\n          owner {\n            __typename\n            id\n            name\n            isMe\n            ...PersonLineFragment\n          }\n        }\n      }\n    }\n  }\n"];
export function gql(source: "\n  mutation payForRentingc($input: PayForRentingInput!) {\n    payForRenting(input: $input) {\n      __typename\n      id\n      rentingStatus\n      updatedAt\n    }\n  }\n"): (typeof documents)["\n  mutation payForRentingc($input: PayForRentingInput!) {\n    payForRenting(input: $input) {\n      __typename\n      id\n      rentingStatus\n      updatedAt\n    }\n  }\n"];
export function gql(source: "\n  fragment PersonCardFragment on User {\n    __typename\n    id\n    isAdmin\n    isBanned\n    isMe\n    name\n    imageUrl\n    listingCount\n    rentingOwnerCount\n    rentingRenterCount\n    ratingCount\n    rating\n    isStripeAccountOnboarded\n    conversation {\n      __typename\n      id\n    }\n  }\n"): (typeof documents)["\n  fragment PersonCardFragment on User {\n    __typename\n    id\n    isAdmin\n    isBanned\n    isMe\n    name\n    imageUrl\n    listingCount\n    rentingOwnerCount\n    rentingRenterCount\n    ratingCount\n    rating\n    isStripeAccountOnboarded\n    conversation {\n      __typename\n      id\n    }\n  }\n"];
export function gql(source: "\n  mutation banUser($input: BanUserInput!) {\n    banUser(input: $input) {\n      __typename\n      id\n      name\n      isBanned\n      isAdmin\n    }\n  }\n"): (typeof documents)["\n  mutation banUser($input: BanUserInput!) {\n    banUser(input: $input) {\n      __typename\n      id\n      name\n      isBanned\n      isAdmin\n    }\n  }\n"];
export function gql(source: "\n  fragment PersonLineFragment on User {\n    __typename\n    id\n    name\n    imageUrl\n    listingCount\n  }\n"): (typeof documents)["\n  fragment PersonLineFragment on User {\n    __typename\n    id\n    name\n    imageUrl\n    listingCount\n  }\n"];
export function gql(source: "\n  query User($nodeId: ID!) {\n    node(id: $nodeId) {\n      ... on User {\n        __typename\n        id\n        name\n        ...PersonCardFragment\n        listings {\n          __typename\n          id\n          updatedAt\n          ...ListingListItemFragment\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query User($nodeId: ID!) {\n    node(id: $nodeId) {\n      ... on User {\n        __typename\n        id\n        name\n        ...PersonCardFragment\n        listings {\n          __typename\n          id\n          updatedAt\n          ...ListingListItemFragment\n        }\n      }\n    }\n  }\n"];
export function gql(source: "\n  fragment ReportFragment on Report {\n    __typename\n    id\n    isDismissed\n    reason\n  }\n"): (typeof documents)["\n  fragment ReportFragment on Report {\n    __typename\n    id\n    isDismissed\n    reason\n  }\n"];
export function gql(source: "\n  mutation dismissReports($input: DismissReportsInput!) {\n    dismissReports(input: $input)\n  }\n"): (typeof documents)["\n  mutation dismissReports($input: DismissReportsInput!) {\n    dismissReports(input: $input)\n  }\n"];
export function gql(source: "\n  mutation removeListing($input: RemoveListingInput!) {\n    removeListing(input: $input) {\n      __typename\n      id\n      title\n      description\n      imageUrl\n      dayPriceEuroCents\n      category\n      latitude\n      longitude\n    }\n  }\n"): (typeof documents)["\n  mutation removeListing($input: RemoveListingInput!) {\n    removeListing(input: $input) {\n      __typename\n      id\n      title\n      description\n      imageUrl\n      dayPriceEuroCents\n      category\n      latitude\n      longitude\n    }\n  }\n"];
export function gql(source: "\n  mutation removeFeedback($input: RemoveFeedbackInput!) {\n    removeFeedback(input: $input) {\n      __typename\n      id\n      text\n      rating\n    }\n  }\n"): (typeof documents)["\n  mutation removeFeedback($input: RemoveFeedbackInput!) {\n    removeFeedback(input: $input) {\n      __typename\n      id\n      text\n      rating\n    }\n  }\n"];
export function gql(source: "\n  query ReportedListings {\n    reportedListings {\n      edges {\n        node {\n          id\n          __typename\n          updatedAt\n          ...ListingListItemFragment\n          reports {\n            id\n            __typename\n            ...ReportFragment\n          }\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query ReportedListings {\n    reportedListings {\n      edges {\n        node {\n          id\n          __typename\n          updatedAt\n          ...ListingListItemFragment\n          reports {\n            id\n            __typename\n            ...ReportFragment\n          }\n        }\n      }\n    }\n  }\n"];
export function gql(source: "\n  query ReportedFeedbacks {\n    reportedFeedbacks {\n      edges {\n        node {\n          id\n          __typename\n          updatedAt\n          ...FeedbackListItemFragment\n          reports {\n            id\n            __typename\n            ...ReportFragment\n          }\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query ReportedFeedbacks {\n    reportedFeedbacks {\n      edges {\n        node {\n          id\n          __typename\n          updatedAt\n          ...FeedbackListItemFragment\n          reports {\n            id\n            __typename\n            ...ReportFragment\n          }\n        }\n      }\n    }\n  }\n"];
export function gql(source: "\n  fragment ListingMapMarkerFragment on Listing {\n    __typename\n    id\n    title\n    dayPriceEuroCents\n    latitude\n    longitude\n  }\n"): (typeof documents)["\n  fragment ListingMapMarkerFragment on Listing {\n    __typename\n    id\n    title\n    dayPriceEuroCents\n    latitude\n    longitude\n  }\n"];
export function gql(source: "\n  query SearchListings(\n    $searchTerm: String\n    $toPriceEuroCents: Int\n    $fromPriceEuroCents: Int\n    $category: String\n    $latitudeMin: Float\n    $latitudeMax: Float\n    $longitudeMin: Float\n    $longitudeMax: Float\n  ) {\n    listings(\n      searchTerm: $searchTerm\n      toPriceEuroCents: $toPriceEuroCents\n      fromPriceEuroCents: $fromPriceEuroCents\n      category: $category\n      latitudeMin: $latitudeMin\n      latitudeMax: $latitudeMax\n      longitudeMin: $longitudeMin\n      longitudeMax: $longitudeMax\n    ) {\n      edges {\n        node {\n          __typename\n          id\n          updatedAt\n          ...ListingListItemFragment\n          ...ListingMapMarkerFragment\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query SearchListings(\n    $searchTerm: String\n    $toPriceEuroCents: Int\n    $fromPriceEuroCents: Int\n    $category: String\n    $latitudeMin: Float\n    $latitudeMax: Float\n    $longitudeMin: Float\n    $longitudeMax: Float\n  ) {\n    listings(\n      searchTerm: $searchTerm\n      toPriceEuroCents: $toPriceEuroCents\n      fromPriceEuroCents: $fromPriceEuroCents\n      category: $category\n      latitudeMin: $latitudeMin\n      latitudeMax: $latitudeMax\n      longitudeMin: $longitudeMin\n      longitudeMax: $longitudeMax\n    ) {\n      edges {\n        node {\n          __typename\n          id\n          updatedAt\n          ...ListingListItemFragment\n          ...ListingMapMarkerFragment\n        }\n      }\n    }\n  }\n"];
export function gql(source: "\n  query ListingAvailability($nodeId: ID!) {\n    node(id: $nodeId) {\n      __typename\n      id\n      ... on Listing {\n        ownerUnavailableDays\n      }\n    }\n  }\n"): (typeof documents)["\n  query ListingAvailability($nodeId: ID!) {\n    node(id: $nodeId) {\n      __typename\n      id\n      ... on Listing {\n        ownerUnavailableDays\n      }\n    }\n  }\n"];
export function gql(source: "\n  mutation updateListingUnavailableDates(\n    $input: UpdateListingUnavailableDatesInput!\n  ) {\n    updateListingUnavailableDates(input: $input) {\n      __typename\n      id\n      updatedAt\n      ownerUnavailableDays\n    }\n  }\n"): (typeof documents)["\n  mutation updateListingUnavailableDates(\n    $input: UpdateListingUnavailableDatesInput!\n  ) {\n    updateListingUnavailableDates(input: $input) {\n      __typename\n      id\n      updatedAt\n      ownerUnavailableDays\n    }\n  }\n"];

export function gql(source: string): unknown;
export function gql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;