import gql from 'graphql-tag';

export const GET_SELECTED_CUSTOM_APP = gql`
    query {
        selectedCustomApp @client {
            app {
                bxAppManifestURL
                category {
                    name
                }
                iconURL
                startURL
                id
                name
                themeColor
            }
        }
    }
`;

export const SET_SELECTED_CUSTOM_APP = gql`
    mutation SetSelectedCustomApp(
        $app: CustomAppInput!,
    ) {
        setSelectedCustomApp(
            app: $app,
        ) @client {
            app {
                bxAppManifestURL
                category {
                    name
                }
                iconURL
                startURL
                id
                name
                previousServiceId
                themeColor
            }
        }
    }
`;
