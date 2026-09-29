import { Clipboard, getPreferenceValues } from "@raycast/api";

type AddLinkPreferenceValues = {
  pasteClipboardLink?: boolean;
  defaultCollection?: string;
  defaultHashtags?: string;
};

export type AddLinkSettings = {
  defaultTags: string[];
  defaultCollection: string;
  pasteClipboard: boolean;
};

export function parseHashtags(value: string | undefined) {
  if (!value) {
    return [];
  }

  return value
    .split(/[,;#]+/)
    .map((tag) => tag.trim().replace(/^#/, ""))
    .filter(Boolean);
}

export function getAddLinkSettings(): AddLinkSettings {
  const preferences = getPreferenceValues<AddLinkPreferenceValues>();

  return {
    defaultTags: parseHashtags(preferences.defaultHashtags),
    defaultCollection: preferences.defaultCollection || "-1",
    pasteClipboard: preferences.pasteClipboardLink === true,
  };
}

export async function readClipboardText() {
  try {
    const text = await Clipboard.readText();
    return text?.trim() ?? "";
  } catch {
    return "";
  }
}

export function isProbablyUrl(value: string) {
  const candidate = value.trim();
  if (!candidate || /\s/.test(candidate)) {
    return false;
  }

  try {
    const url = new URL(/^https?:\/\//i.test(candidate) ? candidate : `https://${candidate}`);
    return url.hostname.includes(".");
  } catch {
    return false;
  }
}
