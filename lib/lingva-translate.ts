// Lingva Translate API integration
// Based on https://github.com/thedaviddelta/lingva-translate

export interface LingvaTranslation {
  translation: string;
  info?: any;
}

export interface LingvaLanguage {
  code: string;
  name: string;
}

export interface LingvaAudio {
  audio: number[];
}

class LingvaTranslateService {
  private baseUrl: string;
  private fallbackInstances: string[];

  constructor() {
    // Use the official Lingva instance as primary, with fallbacks
    this.baseUrl = 'https://lingva.ml';
    this.fallbackInstances = [
      'https://lingva.ml',
      'https://translate.igna.wtf',
      'https://translate.plausibility.cloud',
      'https://lingva.lunar.icu'
    ];
  }

  private async makeRequest<T>(endpoint: string, instanceIndex: number = 0): Promise<T> {
    const instance = this.fallbackInstances[instanceIndex];
    const url = `${instance}${endpoint}`;

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Lingva instance ${instance} failed:`, error);
      
      // Try next fallback instance
      if (instanceIndex < this.fallbackInstances.length - 1) {
        return this.makeRequest<T>(endpoint, instanceIndex + 1);
      }
      
      throw new Error('All Lingva instances are unavailable');
    }
  }

  /**
   * Translate text from source language to target language
   */
  async translate(source: string, target: string, query: string): Promise<LingvaTranslation> {
    const endpoint = `/api/v1/${source}/${target}/${encodeURIComponent(query)}`;
    return this.makeRequest<LingvaTranslation>(endpoint);
  }

  /**
   * Get audio pronunciation for text
   */
  async getAudio(lang: string, query: string): Promise<LingvaAudio> {
    const endpoint = `/api/v1/audio/${lang}/${encodeURIComponent(query)}`;
    return this.makeRequest<LingvaAudio>(endpoint);
  }

  /**
   * Get available languages
   */
  async getLanguages(type?: 'source' | 'target'): Promise<{ languages: LingvaLanguage[] }> {
    const endpoint = type ? `/api/v1/languages/${type}` : '/api/v1/languages';
    return this.makeRequest<{ languages: LingvaLanguage[] }>(endpoint);
  }

  /**
   * Translate using GraphQL API (more detailed response)
   */
  async translateGraphQL(source: string, target: string, query: string): Promise<any> {
    const graphqlQuery = `
      query {
        translation(source: "${source}", target: "${target}", query: "${query.replace(/"/g, '\\"')}") {
          source {
            lang {
              code
              name
            }
            text
            detected {
              code
              name
            }
            pronunciation
            definitions {
              type
              list {
                definition
                example
                synonyms
              }
            }
            examples
          }
          target {
            lang {
              code
              name
            }
            text
            pronunciation
            extraTranslations {
              type
              list {
                word
                meanings
              }
            }
          }
        }
      }
    `;

    const response = await fetch(`${this.baseUrl}/api/graphql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query: graphqlQuery }),
    });

    if (!response.ok) {
      throw new Error(`GraphQL request failed: ${response.status}`);
    }

    const result = await response.json();
    return result.data.translation;
  }
}

// Create singleton instance
export const lingvaTranslate = new LingvaTranslateService();

// Language mapping for our website
export const LANGUAGE_CODES = {
  en: 'en',
  ar: 'ar',
  fr: 'fr',
} as const;

export type LanguageCode = keyof typeof LANGUAGE_CODES;

// Translation cache to avoid repeated API calls
const translationCache = new Map<string, string>();

export async function translateText(
  text: string,
  fromLang: LanguageCode,
  toLang: LanguageCode,
  useCache: boolean = true
): Promise<string> {
  // Skip translation if source and target are the same
  if (fromLang === toLang) {
    return text;
  }

  // Check cache first
  const cacheKey = `${fromLang}-${toLang}-${text}`;
  if (useCache && translationCache.has(cacheKey)) {
    return translationCache.get(cacheKey)!;
  }

  try {
    const result = await lingvaTranslate.translate(
      LANGUAGE_CODES[fromLang],
      LANGUAGE_CODES[toLang],
      text
    );

    const translation = result.translation;
    
    // Cache the result
    if (useCache) {
      translationCache.set(cacheKey, translation);
    }

    return translation;
  } catch (error) {
    console.error('Translation failed:', error);
    // Return original text if translation fails
    return text;
  }
}

// Batch translation for multiple texts
export async function translateBatch(
  texts: string[],
  fromLang: LanguageCode,
  toLang: LanguageCode
): Promise<string[]> {
  const translations = await Promise.all(
    texts.map(text => translateText(text, fromLang, toLang))
  );
  return translations;
}

// Auto-translate function for dynamic content
export async function autoTranslate(
  content: string | Record<string, string>,
  targetLang: LanguageCode,
  sourceLang: LanguageCode = 'en'
): Promise<string | Record<string, string>> {
  if (typeof content === 'string') {
    return translateText(content, sourceLang, targetLang);
  }

  // Handle object with multiple strings
  const translatedContent: Record<string, string> = {};
  const entries = Object.entries(content);
  
  for (const [key, value] of entries) {
    translatedContent[key] = await translateText(value, sourceLang, targetLang);
  }

  return translatedContent;
} 