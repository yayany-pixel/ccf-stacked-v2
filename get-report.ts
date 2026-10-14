import { getVisitorComparisonData } from "./lib/analyticsVisitorMetrics";

async function main() {
  const data = await getVisitorComparisonData("America/Chicago");
  console.log(JSON.stringify(data, null, 2));
}

main().catch(console.error);
