import { compareVersions } from 'compare-versions';

export enum FeatureName {
  RawCommand,
  ProtoCommand,
}

// from is inclusive and to is exclusive
const FeatureMap: Record<FeatureName, { from: string; to?: string }> = {
  [FeatureName.RawCommand]: { from: '2.0.0', to: '3.0.0' },
  [FeatureName.ProtoCommand]: { from: '3.0.0', to: '4.0.0' },
};

export const isFeatureEnabled = (
  featureName: FeatureName,
  sdkVersion: string,
): boolean => {
  const { from, to } = FeatureMap[featureName];

  let enabled = compareVersions(from, sdkVersion) < 1;
  if (to) enabled = enabled && compareVersions(to, sdkVersion) > 0;

  return enabled;
};
