import { getPreferenceValues } from "@raycast/api";
import { t } from "./locales"; // ローカライズユーティリティをインポート

interface Preferences {
  micropubToken: string;
  micropubEndpoint: string;
}

export function getAccessToken(): string {
  const preferences = getPreferenceValues<Preferences>();
  
  if (!preferences.micropubToken) {
    throw new Error(t("missingTokenError"));
  }
  
  return preferences.micropubToken;
}

export function getMicropubEndpoint(): string {
  const preferences = getPreferenceValues<Preferences>();
  return preferences.micropubEndpoint || "https://micro.blog/micropub";
}