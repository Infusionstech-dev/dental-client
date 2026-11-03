import AppointmentForm from '../../components/appointment/AppointmentForm';
import { PageHeader } from '../../components/common/ui';

export default function Appointment() {
  return (
    <>
      <PageHeader eyebrow="Book an appointment" title="Book your visit in six easy steps" subtitle="Choose a service, dentist and time that suits you. No account required." />
      <section className="section pt-10">
        <div className="container-x max-w-5xl"><AppointmentForm /></div>
      </section>
    </>
  );
}
