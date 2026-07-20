import { ApplicationsAvailable } from '../graphql/queries';

export type SearchAppRequestVariables = {
  searchValue: string,
  first: number,
};

export type WithSearchApplicationsByNameProps = {
  apps?: ApplicationsAvailable[],
  loading?: boolean,
};

// export default graphql<
//   SearchAppRequestVariables,
//   ApplicationsResponse,
//   ApplicationsRequestVariables,
//   WithSearchApplicationsByNameProps>(
//   QUERY_GET_APPLICATIONS,
//   {
//     options: ({ searchValue }) => {
//       return {
//         variables: {
//           filters: {
//             search: {
//               contains: searchValue,
//             },
//           },
//           first: applicationsLimit,
//           sort: {
//             field: 'name',
//             direction: 'ASC',
//           },
//         },
//       };
//     },
//     props: ({ data }) => ({
//       apps: data && data.applications ? data.applications.list : [],
//       loading: data && data.loading,
//     }),
//   });
