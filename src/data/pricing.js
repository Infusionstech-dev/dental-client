// Centralized, editable mock pricing configuration for the Cost Estimator.
// Admin → Treatment Pricing saves overrides to localStorage via DataContext.
// All prices are in BDT.
export const defaultPricing = {
  discount: { enabled: true, percent: 10, minTotal: 20000, label: 'Seasonal discount' },
  complexity: {
    simple: { label: 'Simple', multiplier: 1, hint: 'Routine case, no complications expected' },
    moderate: { label: 'Moderate', multiplier: 1.25, hint: 'Some additional work likely' },
    complex: { label: 'Complex', multiplier: 1.6, hint: 'Advanced case requiring extra time/materials' },
  },
  treatments: [
    {
      key: 'cleaning', name: 'Teeth Cleaning', icon: 'Sparkles', enabled: true, basePrice: 1500, perTooth: false, usesComplexity: true, duration: '45–60 minutes',
      options: [
        { id: 'standard', name: 'Standard scaling & polishing', price: 0, enabled: true },
        { id: 'deep', name: 'Deep cleaning (root planing)', price: 2500, enabled: true },
      ],
      addons: [
        { id: 'fluoride', name: 'Fluoride treatment', price: 800, enabled: true },
        { id: 'xray', name: 'Digital X-ray', price: 500, enabled: true },
      ],
    },
    {
      key: 'whitening', name: 'Teeth Whitening', icon: 'Sun', enabled: true, basePrice: 8000, perTooth: false, usesComplexity: false, duration: '60–90 minutes',
      options: [
        { id: 'inclinic', name: 'In-clinic LED whitening', price: 0, enabled: true },
        { id: 'homekit', name: 'Custom take-home kit', price: -2000, enabled: true },
        { id: 'combo', name: 'In-clinic + take-home combo', price: 4000, enabled: true },
      ],
      addons: [
        { id: 'cleaning', name: 'Pre-whitening cleaning', price: 1200, enabled: true },
        { id: 'desens', name: 'Desensitising treatment', price: 1000, enabled: true },
      ],
    },
    {
      key: 'rootCanal', name: 'Root Canal', icon: 'Activity', enabled: true, basePrice: 6000, perTooth: true, usesComplexity: true, duration: '1–2 visits per tooth',
      options: [
        { id: 'anterior', name: 'Front tooth', price: 0, enabled: true },
        { id: 'premolar', name: 'Premolar', price: 1500, enabled: true },
        { id: 'molar', name: 'Molar', price: 3000, enabled: true },
      ],
      addons: [
        { id: 'crown', name: 'Zirconia crown (per tooth)', price: 9000, enabled: true, perTooth: true },
        { id: 'xray', name: 'Digital X-ray', price: 500, enabled: true },
      ],
    },
    {
      key: 'implants', name: 'Dental Implants', icon: 'Anchor', enabled: true, basePrice: 45000, perTooth: true, usesComplexity: true, duration: '3–6 months',
      options: [
        { id: 'standard', name: 'Standard implant (Korean)', price: 0, enabled: true },
        { id: 'premium', name: 'Premium implant (Swiss/German)', price: 25000, enabled: true },
      ],
      addons: [
        { id: 'bonegraft', name: 'Bone grafting (per site)', price: 15000, enabled: true, perTooth: true },
        { id: 'cbct', name: '3D CBCT scan', price: 3500, enabled: true },
      ],
    },
    {
      key: 'braces', name: 'Braces', icon: 'Grid3x3', enabled: true, basePrice: 50000, perTooth: false, usesComplexity: true, duration: '12–24 months',
      options: [
        { id: 'metal', name: 'Metal braces', price: 0, enabled: true },
        { id: 'ceramic', name: 'Ceramic braces', price: 20000, enabled: true },
        { id: 'aligners', name: 'Clear aligners', price: 100000, enabled: true },
      ],
      addons: [
        { id: 'retainer', name: 'Retainers (set)', price: 6000, enabled: true },
        { id: 'scan', name: 'Digital scan & simulation', price: 4000, enabled: true },
      ],
    },
    {
      key: 'veneers', name: 'Dental Veneers', icon: 'Layers', enabled: true, basePrice: 12000, perTooth: true, usesComplexity: false, duration: '2–3 visits',
      options: [
        { id: 'composite', name: 'Composite veneer', price: 0, enabled: true },
        { id: 'porcelain', name: 'Porcelain veneer', price: 10000, enabled: true },
        { id: 'emax', name: 'E.max premium veneer', price: 16000, enabled: true },
      ],
      addons: [
        { id: 'dsd', name: 'Digital smile design', price: 5000, enabled: true },
        { id: 'mockup', name: 'Trial mock-up', price: 3000, enabled: true },
      ],
    },
    {
      key: 'extraction', name: 'Tooth Extraction', icon: 'Scissors', enabled: true, basePrice: 1500, perTooth: true, usesComplexity: true, duration: '20–60 minutes',
      options: [
        { id: 'simple', name: 'Simple extraction', price: 0, enabled: true },
        { id: 'surgical', name: 'Surgical / wisdom tooth', price: 4500, enabled: true },
      ],
      addons: [
        { id: 'xray', name: 'Digital X-ray', price: 500, enabled: true },
        { id: 'prf', name: 'PRF healing therapy', price: 3000, enabled: true },
      ],
    },
    {
      key: 'filling', name: 'Dental Filling', icon: 'CircleDot', enabled: true, basePrice: 2000, perTooth: true, usesComplexity: true, duration: '30–45 minutes per tooth',
      options: [
        { id: 'composite', name: 'Composite (tooth-coloured)', price: 0, enabled: true },
        { id: 'gic', name: 'Glass ionomer', price: -500, enabled: true },
        { id: 'inlay', name: 'Ceramic inlay', price: 6000, enabled: true },
      ],
      addons: [{ id: 'xray', name: 'Digital X-ray', price: 500, enabled: true }],
    },
  ],
};
