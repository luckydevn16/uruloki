export type Cache = {
  stale: boolean,
  data: {
    cached_data: any,
    data_key: string
  }
}