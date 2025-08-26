// import semver from 'semver';

// export const stringToVersion = (version: string) => {
//   const parsedVersion = semver.parse(version);

//   if (!parsedVersion) {
//     throw new Error(`Invalid version: ${version}`);
//   }

//   return {
//     major: parsedVersion.major,
//     minor: parsedVersion.minor,
//     patch: parsedVersion.patch,
//     variantId: 1,
//     variantStr: "BTC_ONLY"
//   };
// };

export const stringToVersion = (version: string) => {
  const parts = version.split('.');

  if (parts.length !== 3 && parts.length !== 5) {
    throw new Error(`Invalid version format: ${version}`);
  }

  const [majorStr, minorStr, patchStr, variantIdStr, variantStr] = parts;

  const major = parseInt(majorStr, 10);
  const minor = parseInt(minorStr, 10);
  const patch = parseInt(patchStr, 10);
  const variantId = variantIdStr ? parseInt(variantIdStr, 10) : 2;

  if (
    Number.isNaN(major) ||
    Number.isNaN(minor) ||
    Number.isNaN(patch) ||
    Number.isNaN(variantId)
  ) {
    throw new Error(`Invalid version components: ${version}`);
  }

  return {
    major,
    minor,
    patch,
    variantId,
    variantStr: variantStr ?? 'MULTI_COIN',
  };
};
