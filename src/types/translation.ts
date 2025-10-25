export interface WithTranslation<T> {
  translations: WithDictionary<T>;
}

export interface WithDictionary<T> {
  en: T;
  fa: T;
}
