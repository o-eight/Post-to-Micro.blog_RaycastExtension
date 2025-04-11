import { getPreferenceValues } from "@raycast/api";

interface Preferences {
  micropubToken: string;
  micropubEndpoint: string;
}

export function getAccessToken(): string {
  const preferences = getPreferenceValues<Preferences>();
  
  if (!preferences.micropubToken) {
    throw new Error("Micropub APIトークンが設定されていません。Raycastの設定から入力してください。");
  }
  
  return preferences.micropubToken;
}

export function getMicropubEndpoint(): string {
  const preferences = getPreferenceValues<Preferences>();
  return preferences.micropubEndpoint || "https://micro.blog/micropub";
}