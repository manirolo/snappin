import { ContextProps } from "../../_trpc";
import { PLAN_SLUG_ORDER, PlanSlug } from "@snappin/shared/billing/plan.schema";

export type GetPlans = {
  ctx: ContextProps;
  onlyActive?: boolean;
  /** When true (with onlyActive), only return public tier slugs for the customer billing page. */
  publicCatalogOnly?: boolean;
};

const slugRank = new Map<PlanSlug, number>(
  PLAN_SLUG_ORDER.map((slug, index) => [slug, index]),
);

function sortPlans<T extends { slug: string; interval: string }>(rows: T[]): T[] {
  return [...rows].sort((a, b) => {
    const ra = slugRank.get(a.slug as PlanSlug) ?? 99;
    const rb = slugRank.get(b.slug as PlanSlug) ?? 99;
    if (ra !== rb) return ra - rb;
    const intervalRank = (x: string) => (x === "month" ? 0 : 1);
    return intervalRank(a.interval) - intervalRank(b.interval);
  });
}

export async function getPlans({ ctx, onlyActive = false, publicCatalogOnly = false }: GetPlans) {
  const filter: Record<string, unknown> = onlyActive ? { isActive: true } : {};
  if (publicCatalogOnly && onlyActive) {
    filter.slug = { $in: [...PLAN_SLUG_ORDER] };
  }

  const rows = await ctx.db.plan.find(filter).lean();
  return sortPlans(rows);
}
