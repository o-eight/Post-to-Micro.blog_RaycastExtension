import fetch from "node-fetch";
import { getAccessToken, getMicropubEndpoint } from "./auth";

// Micro.blogへの投稿関数
export async function postToMicroBlog(content: string) {
  const token = getAccessToken();
  const endpoint = getMicropubEndpoint();
  
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Authorization": `Bearer ${token}`
    },
    body: new URLSearchParams({
      "h": "entry",
      "content": content
    })
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`投稿に失敗しました (${response.status}): ${errorText}`);
  }
  
  return await response.json();
}