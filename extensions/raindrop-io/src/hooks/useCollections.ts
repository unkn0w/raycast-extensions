import { getPreferenceValues, showToast, Toast } from "@raycast/api";
import { useFetch } from "@raycast/utils";
import { useEffect } from "react";

import { syncDefaultCollectionOptions } from "../helpers/syncDefaultCollectionOptions";
import { CollectionsResponse } from "../types";

export function useCollections() {
  const preferences: Preferences = getPreferenceValues();
  const result = useFetch<CollectionsResponse>(`https://api.raindrop.io/rest/v1/collections/all`, {
    headers: {
      Authorization: `Bearer ${preferences.token}`,
    },
    keepPreviousData: true,
    onError: () => {
      showToast(Toast.Style.Failure, "Cannot fetch collections");
    },
  });

  useEffect(() => {
    if (result.data?.result) {
      void syncDefaultCollectionOptions(result.data);
    }
  }, [result.data]);

  return result;
}
