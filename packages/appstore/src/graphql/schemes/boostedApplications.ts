import gql from 'graphql-tag';

export const QUERY_GET_BOOSTED_APPLICATIONS = gql`
    query boostedApplications(
    $filterByUnifiedSearch: ApplicationsFilters,
    $filterByNotificationBadge: ApplicationsFilters,
    $filterByStatusSync: ApplicationsFilters,
    $sort: [SortOrderParameter!],
    $first: Int!
    ) {
        appsUnifiedSearch: applications(filters: $filterByUnifiedSearch, sort: $sort, first: $first) {
            list {
                id
                previousServiceId
                name
                category { name }
                themeColor
                iconURL
                startURL
                bxAppManifestURL
            }
        }
        appNotificationBadge: applications(filters: $filterByNotificationBadge, sort: $sort, first: $first) {
            list {
                id
                previousServiceId
                name
                category { name }
                themeColor
                iconURL
                startURL
                bxAppManifestURL
            }
        }
        appStatusSync: applications(filters: $filterByStatusSync, sort: $sort, first: $first) {
            list {
                id
                previousServiceId
                name
                category { name }
                themeColor
                iconURL
                bxAppManifestURL
            }
        }
    }
`;
