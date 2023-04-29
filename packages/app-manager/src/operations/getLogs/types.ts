import { GetLogsStatus } from '../../proto/generated/types';

export * from './error';

export type GetLogsEventHandler = (event: GetLogsStatus) => void;
