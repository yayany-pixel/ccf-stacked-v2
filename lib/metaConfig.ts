/** Public identifier only. Credentials belong exclusively in server runtime variables. */
export const DEFAULT_META_DATASET_ID = "315271500363564";
export function resolveMetaDatasetId(value?: string) {
  return value?.trim() || DEFAULT_META_DATASET_ID;
}
