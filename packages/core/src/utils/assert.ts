export default function assert<T>(
  condition: T,
  message: string,
): asserts condition is Exclude<T, null | undefined> {
  if (condition === null || condition === undefined || condition === false) {
    throw new Error(message);
  }
}
