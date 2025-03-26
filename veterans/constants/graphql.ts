import { gql } from '@apollo/client';

export const CURRENT_USER_QUERY = gql`
  query {
    authenticatedItem {
      ... on User {
        id
        name
        email
        role
      }
    }
  }
`;

export const GET_REGIONS = gql`
  query GetRegions {
    regions {
      id
      name
      order
    }
  }
`;

export const LOGIN_MUTATION = gql`
  mutation AuthenticateUser($email: String!, $password: String!) {
    authenticateUserWithPassword(email: $email, password: $password) {
      ... on UserAuthenticationWithPasswordSuccess {
        item {
          id
          email
          role
          name
        }
      }
      ... on UserAuthenticationWithPasswordFailure {
        message
      }
    }
  }
`;

export const LOGOUT_MUTATION = gql`
  mutation {
    endSession
  }
`;

export const REGISTER_MUTATION = gql`
  mutation CreateUser($name: String!, $email: String!, $password: String!) {
    createUser(data: { name: $name, email: $email, password: $password }) {
      id
      name
      email
      role
    }
  }
`;

export const GET_INITIATIVES = gql`
  query GetInitiatives {
    initiatives {
      id
      title
      description {
        document
      }
    }
  }
`;

export const CHECK_USER_QUERY = gql`
  query CheckUser($email: String!) {
    user(where: { email: $email }) {
      id
      email
      name
    }
  }
`;
