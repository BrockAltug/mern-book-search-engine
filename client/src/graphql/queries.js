import { gql } from '@apollo/client';

// Fetch the current logged-in user's information
export const GET_ME = gql`
  query Me {
    me {
      _id
      username
      email
      savedBooks {
        bookId
        authors
        description
        title
        image
        link
      }
    }
  }
`;