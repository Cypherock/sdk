export type IDerivationPathGenerator = (
  from: number,
  count: number,
) => { derivationPath: string; index: number }[];

export const createDerivationPathGenerator =
  (basePath: string): IDerivationPathGenerator =>
  (from, count) => {
    const derivationPaths: { derivationPath: string; index: number }[] = [];

    let startIndex = from;

    while (derivationPaths.length < count) {
      const nextDerivationPath = basePath.replace('i', startIndex.toString());

      derivationPaths.push({
        derivationPath: nextDerivationPath,
        index: startIndex,
      });

      if (!basePath.includes('i')) break;

      startIndex += 1;
    }

    return derivationPaths;
  };

export const EvmDerivationSchemeMap = {
  ledger: 'ledger',
  metamask: 'metamask',
  legacy: 'legacy',
} as const;

export type EvmDerivationSchemeName =
  (typeof EvmDerivationSchemeMap)[keyof typeof EvmDerivationSchemeMap];

export interface IEvmDerivationScheme {
  name: EvmDerivationSchemeName;
  generator: IDerivationPathGenerator;
}

export const derivationPathSchemes: Record<
  EvmDerivationSchemeName,
  IEvmDerivationScheme
> = {
  ledger: {
    name: 'ledger',
    generator: createDerivationPathGenerator("m/44'/60'/i'/0/0"),
  },
  metamask: {
    name: 'metamask',
    generator: createDerivationPathGenerator("m/44'/60'/0'/0/i"),
  },
  legacy: {
    name: 'legacy',
    generator: createDerivationPathGenerator("m/44'/60'/0'/i"),
  },
};

export const mapDerivationPathForSdk = (derivationPath: string) => {
  const paths: number[] = [];

  const pathArr = derivationPath.split('/');

  for (const path of pathArr) {
    if (path !== 'm') {
      const isHardened = path.includes("'");
      let index = parseInt(path.replace("'", ''), 10);

      if (isHardened) {
        index += 0x80000000;
      }

      paths.push(index);
    }
  }

  return paths;
};
