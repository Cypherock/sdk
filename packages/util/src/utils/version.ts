import semver from 'semver';

export const stringToVersion = (version: string) => {
  const parsedVersion = semver.parse(version);

  if (!parsedVersion) {
    throw new Error(`Invalid version: ${version}`);
  }

  return {
    major: parsedVersion.major,
    minor: parsedVersion.minor,
    patch: parsedVersion.patch,
  };
};
