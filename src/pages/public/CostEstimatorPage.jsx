import CostEstimator from '../../components/cost-estimator/CostEstimator';
import { PageHeader } from '../../components/common/ui';

export default function CostEstimatorPage() {
  return (
    <>
      <PageHeader eyebrow="Smart Treatment Cost Estimator" title="Estimate your treatment cost" subtitle="Get a transparent, itemised preliminary estimate in three quick steps. All prices in BDT (৳)." />
      <section className="section pt-10">
        <div className="container-x max-w-5xl"><CostEstimator /></div>
      </section>
    </>
  );
}
