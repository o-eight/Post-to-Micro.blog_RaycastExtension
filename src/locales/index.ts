import { getPreferenceValues } from "@raycast/api";
import enStrings from "./en";
import jaStrings from "./ja";

interface Preferences {
  language?: string;
}

// 利用可能な言語のマッピング
const locales: { [key: string]: Record<string, string> } = {
  en: enStrings,
  ja: jaStrings,
};

// 現在の言語設定を取得
function getCurrentLocale(): string {
  const preferences = getPreferenceValues<Preferences>();
  const selectedLanguage = preferences.language || "en";
  
  // 要求された言語が利用可能なら返す、なければデフォルト(en)を返す
  return Object.keys(locales).includes(selectedLanguage) ? selectedLanguage : "en";
}

// 文字列内のプレースホルダーを引数で置換する
function formatString(str: string, ...args: unknown[]): string {
  return str.replace(/\{(\d+)\}/g, (match, index) => {
    return typeof args[index] !== 'undefined' ? String(args[index]) : match;
  });
}

// 翻訳文字列を取得する
export function t(key: string, ...formatArgs: unknown[]): string {
  const locale = getCurrentLocale();
  const strings = locales[locale];
  
  // キーが存在しない場合は英語のフォールバックを試みる、それもなければキー自体を返す
  const translation = strings[key] || locales.en[key] || key;
  
  // フォーマット引数があれば適用
  return formatArgs.length > 0 ? formatString(translation, ...formatArgs) : translation;
}