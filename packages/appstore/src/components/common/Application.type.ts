type ApplicationConfiguration = {
  id?: string,
  existingConfigurationId?: string,
  subdomain?: string | null,
  customURL?: string | null,
};

type Preconfigurations = {
  onpremise: boolean,
  subdomain: string,
};

export type Application = {
  id: string,
  name: string,
  categoryName?: string,
  iconURL?: string | null,
  themeColor?: string | null,
  computedApplicationURL?: string,
  configuration?: ApplicationConfiguration,
  description?: string | null,
  startUrl?: string | null,
  isPrivate?: boolean | null,
  isPreconfigurable?: boolean | null,
  preconfigurations?: Preconfigurations | null,
};
