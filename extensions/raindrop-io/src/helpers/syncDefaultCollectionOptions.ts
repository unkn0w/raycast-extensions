import { environment } from "@raycast/api";
import { readFileSync, writeFileSync } from "fs";

import { buildCollectionsOptions } from "./collections";
import { CollectionsResponse } from "../types";

const SOURCE_MANIFEST = "/Users/jmrugals/dev/raycast-extensions/extensions/raindrop-io/package.json";

let lastSynced = "";

export function syncDefaultCollectionOptions(collections: CollectionsResponse) {
  if (!environment.isDevelopment || !collections.result) {
    return;
  }

  const data = [
    { title: "Unsorted", value: "-1" },
    ...buildCollectionsOptions(collections)
      .filter((collection) => collection.value != null)
      .map((collection) => ({
        title:
          collection.name && collection.name !== collection.label
            ? `${collection.name} (${collection.label})`
            : collection.label,
        value: String(collection.value),
      })),
  ];
  const serialized = JSON.stringify(data);
  if (serialized === lastSynced) {
    return;
  }

  let manifest: { name?: string; preferences?: Array<{ name?: string; data?: unknown }> };
  try {
    manifest = JSON.parse(readFileSync(SOURCE_MANIFEST, "utf8"));
  } catch {
    return;
  }

  if (manifest.name !== "raindrop-io") {
    return;
  }

  const preference = manifest.preferences?.find((item) => item.name === "defaultCollection");
  if (!preference || JSON.stringify(preference.data ?? []) === serialized) {
    lastSynced = serialized;
    return;
  }

  preference.data = data;
  writeFileSync(SOURCE_MANIFEST, `${JSON.stringify(manifest, null, 2)}\n`);
  lastSynced = serialized;
}
