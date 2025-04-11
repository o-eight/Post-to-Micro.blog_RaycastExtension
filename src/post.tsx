import { Form, ActionPanel, Action, showToast, Toast, getPreferenceValues } from "@raycast/api";
import React, { useState, useCallback, useEffect } from "react";
import { postToMicroBlog } from "./micropub";

interface Preferences {
  micropubToken: string;
}

export default function Command() {
  const [content, setContent] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  // 起動時にトークンの設定を確認
  useEffect(() => {
    const preferences = getPreferenceValues<Preferences>();
    if (!preferences.micropubToken) {
      showToast({
        style: Toast.Style.Failure,
        title: "APIトークンが設定されていません",
        message: "Raycastの設定からMicropub APIトークンを設定してください"
      });
    }
  }, []);
  
  const handleSubmit = useCallback(async () => {
    if (!content.trim()) {
      await showToast({
        style: Toast.Style.Failure,
        title: "投稿内容を入力してください"
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      await postToMicroBlog(content);
      await showToast({
        style: Toast.Style.Success,
        title: "投稿しました"
      });
      setContent("");
    } catch (error) {
      console.error(error);
      await showToast({
        style: Toast.Style.Failure,
        title: "投稿に失敗しました",
        message: String(error)
      });
    } finally {
      setIsLoading(false);
    }
  }, [content]);
  
  return (
    <Form
      isLoading={isLoading}
      actions={
        <ActionPanel>
          <Action.SubmitForm title="投稿" onSubmit={handleSubmit} />
        </ActionPanel>
      }
    >
      <Form.TextArea
        id="content"
        title="投稿内容"
        placeholder="ここに投稿内容を入力..."
        value={content}
        onChange={setContent}
      />
    </Form>
  );
}