// Pure pricing logic for the Cost Estimator. Reads only from the pricing config passed in.
export function calculateEstimate(pricing, selection) {
  const treatment = pricing.treatments.find((t) => t.key === selection.treatmentKey);
  if (!treatment) return null;

  const teeth = treatment.perTooth ? Math.max(1, Number(selection.teeth) || 1) : 1;
  const option = treatment.options.find((o) => o.id === selection.optionId && o.enabled) || treatment.options.find((o) => o.enabled);
  const complexityKey = treatment.usesComplexity ? selection.complexity || 'simple' : 'simple';
  const complexity = pricing.complexity[complexityKey] || pricing.complexity.simple;

  const unitPrice = treatment.basePrice + (option?.price || 0);
  const basePrice = unitPrice * teeth;
  const complexityCharge = Math.round(basePrice * (complexity.multiplier - 1));

  const addons = treatment.addons
    .filter((a) => a.enabled && selection.addons?.includes(a.id))
    .map((a) => ({ ...a, total: a.perTooth ? a.price * teeth : a.price }));
  const addonsTotal = addons.reduce((s, a) => s + a.total, 0);

  const subtotal = basePrice + complexityCharge + addonsTotal;
  const d = pricing.discount;
  const discount = d?.enabled && subtotal >= d.minTotal ? Math.round((subtotal * d.percent) / 100) : 0;

  return {
    treatment,
    option,
    teeth,
    complexity: { key: complexityKey, ...complexity },
    unitPrice,
    basePrice,
    complexityCharge,
    addons,
    additionalCharges: complexityCharge + addonsTotal,
    subtotal,
    discount,
    discountLabel: discount ? `${d.label} (${d.percent}%)` : null,
    total: subtotal - discount,
    duration: treatment.duration,
  };
}

// Lowest possible price for a treatment — used for "starting from" labels.
export function startingPriceFor(pricing, key) {
  const t = pricing.treatments.find((x) => x.key === key);
  if (!t) return null;
  const minOption = Math.min(0, ...t.options.filter((o) => o.enabled).map((o) => o.price));
  return t.basePrice + minOption;
}
