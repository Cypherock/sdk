export { default as logger } from './logger';
export const hexToUint8Array = (data: string) => {
  const isHex = (maybeHex: string) =>
    maybeHex.length !== 0 &&
    maybeHex.length % 2 === 0 &&
    !/[^a-fA-F0-9]/u.test(maybeHex);

  if (!isHex(data)) {
    throw new Error(`Invalid hex string: ${data}`);
  } else {
    const match = data.match(/.{1,2}/g);
    if (!match) {
      throw new Error('Invalid hex string');
    }
    return Uint8Array.from(match.map(byte => parseInt(byte, 16)));
  }
};

export const uint8ArrayToHex = (data: Uint8Array) => {
  function i2hex(i: number) {
    return `0${i.toString(16)}`.slice(-2);
  }

  return Array.from(data).map(i2hex).join('');
};

export function padStart(str: string, targetLength: number, padString: string) {
  let innerTargetLength = targetLength;
  let innerPadString = String(
    typeof padString !== 'undefined' ? padString : ' '
  );

  if (str.length > targetLength) {
    return String(str);
  }

  innerTargetLength -= str.length;
  if (innerTargetLength > innerPadString.length) {
    innerPadString += innerPadString.repeat(
      innerTargetLength / innerPadString.length
    );
  }

  return innerPadString.slice(0, innerTargetLength) + String(str);
}
