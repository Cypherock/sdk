export type FirstResponseHandler = (num: number) => void;

export interface IDummyParams {
  onFirstResponse?: FirstResponseHandler;
}

export interface IDummyResult {
  condition: boolean;
}
