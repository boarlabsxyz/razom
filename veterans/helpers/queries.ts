import { gql } from '@apollo/client';

export interface Region {
  readonly id: string;
  readonly name: string;
  readonly numOfInitiatives: number;
  readonly order: number;
}

export const GET_REGIONS = gql`
  query GetRegions {
    regions(orderBy: { order: asc }) {
      id
      name
      numOfInitiatives
      order
    }
  }
`;
