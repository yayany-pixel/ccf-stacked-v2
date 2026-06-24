import urllib.request, urllib.error, json

TOKEN = "oIGQJeU9lAs7kYddhguyrdXSMBF7nyKQgwXarQw3"
BASE  = "https://api.printful.com"

def get(path, store_id=None):
    headers = {"Authorization": "Bearer " + TOKEN}
    if store_id:
        headers["X-PF-Store-Id"] = str(store_id)
    req = urllib.request.Request(BASE + path, headers=headers)
    try:
        with urllib.request.urlopen(req, timeout=15) as r:
            return json.loads(r.read())
    except urllib.error.HTTPError as e:
        body = e.read().decode()
        print(f"  ERROR {e.code}: {body[:200]}")
        return None

stores_data = get("/stores")
stores = stores_data["result"] if stores_data else []

for store in stores:
    sid  = store["id"]
    name = store["name"]
    stype = store["type"]
    print(f"\n{'='*55}")
    print(f"STORE: {name} [{sid}] — {stype}")
    print('='*55)

    # Try v2 API products
    headers_v2 = {"Authorization": "Bearer " + TOKEN, "X-PF-Store-Id": str(sid)}
    endpoints_to_try = [
        f"/v2/sync/products",
        f"/v2/stores/{sid}/products",
        f"/sync/products",
    ]

    products = None
    used_endpoint = None
    for ep in endpoints_to_try:
        result = get(ep, store_id=sid)
        if result and "result" in result:
            products = result
            used_endpoint = ep
            break
        elif result and "data" in result:
            products = result
            used_endpoint = ep
            break

    if not products:
        print(f"  Could not fetch products via API for this store type ({stype}).")
        if stype == "shopify":
            print("  -> Shopify products are managed in your Shopify admin.")
            print("     Check: https://www.printful.com/dashboard/sync for sync issues.")
        elif stype == "etsy":
            print("  -> Etsy products are managed in your Etsy shop.")
            print("     Check: https://www.printful.com/dashboard/sync for sync issues.")
        continue

    # Parse response (handle both v1 and v2 shapes)
    items = products.get("result", products.get("data", []))
    total = products.get("paging", {}).get("total", len(items))
    print(f"  Found {total} products via {used_endpoint}\n")

    ok_count = 0
    bad_count = 0

    for p in items:
        pid = p.get("id")
        detail = get(f"/store/products/{pid}", store_id=sid)
        if not detail:
            continue

        prod     = detail["result"]["sync_product"]
        variants = detail["result"]["sync_variants"]
        issues   = []

        unsynced = [v for v in variants if not v.get("is_synced")]
        if unsynced:
            issues.append(f"UNSYNCED: {len(unsynced)} variant(s)")

        no_price = [v for v in variants if not v.get("retail_price") or v["retail_price"] == "0.00"]
        if no_price:
            issues.append(f"MISSING PRICE: {len(no_price)} variant(s)")

        if not prod.get("thumbnail_url"):
            issues.append("NO MOCKUP IMAGE")

        unmapped = [v for v in variants if not v.get("product", {}).get("product_id")]
        if unmapped:
            issues.append(f"UNMAPPED variants: {len(unmapped)}")

        bad_stock = [v for v in variants if v.get("availability_status") in ("discontinued", "out_of_stock")]
        if bad_stock:
            issues.append(f"DISCONTINUED/OOS: {len(bad_stock)} variant(s)")

        if prod.get("variants") != prod.get("synced"):
            issues.append(f"SYNC MISMATCH: {prod.get('synced')}/{prod.get('variants')} synced")

        if issues:
            bad_count += 1
            print(f"  [!] {prod['name']}  (id: {prod['id']})")
            for i in issues:
                print(f"       - {i}")
        else:
            ok_count += 1
            print(f"  [OK] {prod['name']}  ({prod['variants']} variants)")

    print(f"\n  Summary: {ok_count} OK, {bad_count} with issues")

print("\n=== SCAN COMPLETE ===")
