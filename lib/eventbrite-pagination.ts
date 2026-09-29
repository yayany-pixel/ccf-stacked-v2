/** Paginate Eventbrite listing responses without silently truncating them. */
export type PageQuery = Record<string, unknown>;
export type FetchEventbritePage = (query: PageQuery) => Promise<any>;

export interface PaginationOptions {
  allPages?: boolean;
  maxPages?: number;
}

function integer(value: unknown): number | undefined {
  return typeof value === "number" && Number.isSafeInteger(value) && value >= 0
    ? value : undefined;
}

export async function collectEventbriteEvents(
  fetchPage: FetchEventbritePage,
  initialQuery: PageQuery = {},
  options: PaginationOptions = {}
) {
  const allPages = options.allPages ?? false;
  const maxPages = options.maxPages ?? 100;
  if (!Number.isSafeInteger(maxPages) || maxPages < 1) {
    throw new Error("maxPages must be a positive integer.");
  }
  const events: any[] = [];
  const ids = new Set<string>();
  const seenRequests = new Set<string>();
  const query = { ...initialQuery };
  const startedAtBeginning = !query.continuation && (query.page === undefined || query.page === 1);
  let last: any;
  let next: { page?: number; continuation?: string } | null = null;
  let pagesFetched = 0;

  for (;;) {
    const requestKey = JSON.stringify([query.page ?? null, query.continuation ?? null]);
    if (seenRequests.has(requestKey)) throw new Error("Eventbrite repeated a pagination cursor.");
    seenRequests.add(requestKey);
    const data = await fetchPage({ ...query });
    if (!data || !Array.isArray(data.events) || !data.pagination) {
      throw new Error("Eventbrite returned no valid events/pagination; completeness is unknown.");
    }
    last = data;
    pagesFetched += 1;
    const pagination = data.pagination;
    const page = integer(pagination.page_number) ?? integer(query.page);
    const pageCount = integer(pagination.page_count);
    const hasMore = typeof pagination.has_more_items === "boolean"
      ? pagination.has_more_items
      : page !== undefined && pageCount !== undefined ? page < pageCount : undefined;
    if (hasMore === undefined) throw new Error("Eventbrite did not indicate whether more pages exist.");

    let added = 0;
    for (const event of data.events) {
      if (event?.id === undefined || event?.id === null) {
        throw new Error("Eventbrite returned an event without an ID.");
      }
      const id = String(event.id);
      if (!ids.has(id)) {
        ids.add(id);
        events.push(event);
        added += 1;
      }
    }
    if (hasMore && added === 0) throw new Error("Eventbrite pagination made no progress.");
    if (!hasMore) {
      next = null;
      break;
    }
    const continuation = typeof pagination.continuation === "string"
      ? pagination.continuation.trim() : "";
    if (continuation) next = { continuation };
    else if (page !== undefined && page > 0) next = { page: page + 1 };
    else throw new Error("Eventbrite has more results but returned no usable next-page pointer.");

    if (!allPages || pagesFetched >= maxPages) break;
    delete query.page;
    delete query.continuation;
    Object.assign(query, next);
  }

  return {
    ...last,
    events,
    pagination: { ...last.pagination, has_more_items: next !== null },
    retrieval: {
      pagesFetched,
      returnedCount: events.length,
      startedAtBeginning,
      reachedEnd: next === null,
      completeListing: startedAtBeginning && next === null,
      nextRequest: next,
      limitReached: allPages && next !== null && pagesFetched >= maxPages,
      // Listing completeness is not a claim that recurring series were expanded.
      recurringOccurrencesExpanded: false,
    },
  };
}
