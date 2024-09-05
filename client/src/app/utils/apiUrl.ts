import { environment } from '../../environments/environment.development';

export function apiUrl(url: string): string {
  return environment.apiUrl + url.replace(/^\//, '');
}
