import { SgpError } from './types';

export function isSgpError<T>(data: T | SgpError): data is SgpError {
  return (data as SgpError)?.error === true;
}
