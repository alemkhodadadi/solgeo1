export interface ILanguage {
    code: string,
    label: string,
    locale: string,
}

export interface IToast {
  severity?: 'success' | 'info' | 'warn' | 'error' | 'secondary' | 'contrast';
  summary?: string;
  detail?: string;
  position?: string;
  group?: string;
  life?: number
}