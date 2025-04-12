import { Form, ActionPanel, Action, showToast, Toast, getPreferenceValues } from "@raycast/api";
import React, { useState, useCallback, useEffect } from "react";
import { postToMicroBlog } from "./micropub";
import { t } from "./locales"; // ローカライズユーティリティをインポート

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
        title: t("missingToken"),
        message: t("configureToken")
      });
    }
  }, []);
  
  const handleSubmit = useCallback(async () => {
    if (!content.trim()) {
      await showToast({
        style: Toast.Style.Failure,
        title: t("emptyContentError")
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      await postToMicroBlog(content);
      await showToast({
        style: Toast.Style.Success,
        title: t("posted")
      });
      setContent("");
    } catch (error) {
      console.error(error);
      await showToast({
        style: Toast.Style.Failure,
        title: t("postFailed"),
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
          <Action.SubmitForm title={t("postButton")} onSubmit={handleSubmit} />
        </ActionPanel>
      }
    >
      <Form.TextArea
        id="content"
        title={t("postContent")}
        placeholder={t("postContentPlaceholder")}
        value={content}
        onChange={setContent}
      />
    </Form>
  );
}