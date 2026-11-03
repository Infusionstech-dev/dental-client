import { Users, CalendarCheck, CalendarClock, Stethoscope, Wallet, Download } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar, PieChart, Pie, Cell, Legend } from 'recharts';
import StatCard from '../../components/dashboard/StatCard';
import DataTable from '../../components/common/DataTable';
import Button from '../../components/common/Button';
import { Badge } from '../../components/common/ui';
import { DashTitle } from '../../layouts/DashboardLayout';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';
import { monthlyAnalytics, serviceShare } from '../../data/mockRecords';
import { formatBDT, formatDate, todayISO } from '../../utils/format';
import { downloadFile } from '../../utils/download';

const COLORS = ['#1460d4', '#0b96aa', '#6a7c9e', '#1f7ae8', '#12b5cb', '#c5d1e4'];
const axis = { fontSize: 12, fill: '#6a7c9e' };
const tooltipStyle = { borderRadius: 12, border: '1px solid #e3e9f3', boxShadow: '0 8px 24px -8px rgb(13 22 40 / .12)', fontSize: 13 };

function ChartCard({ title, children, className = '' }) {
  return <div className={`card p-5 sm:p-6 ${className}`}><h2 className="mb-4 text-lg font-bold">{title}</h2>{children}</div>;
}

export function AdminDashboard() {
  const { patients, appointments, dentists, getService, getDentist } = useData();
  const today = todayISO();
  const todays = appointments.filter((a) => a.date === today);
  const revenue = monthlyAnalytics[monthlyAnalytics.length - 1].revenue;

  return (
    <>
      <DashTitle title="Dashboard overview" sub="A snapshot of clinic activity." />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard icon={Users} label="Total patients" value={patients.length.toLocaleString()} trend={12} />
        <StatCard icon={CalendarCheck} label="Total appointments" value={appointments.length} trend={8} tone="teal" />
        <StatCard icon={CalendarClock} label="Today’s appointments" value={todays.length} tone="amber" />
        <StatCard icon={Stethoscope} label="Total dentists" value={dentists.length} tone="navy" />
        <StatCard icon={Wallet} label="Est. monthly revenue" value={formatBDT(revenue)} trend={-3} />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-3">
        <ChartCard title="Appointment analytics" className="xl:col-span-2">
          <div className="h-72">
            <ResponsiveContainer>
              <AreaChart data={monthlyAnalytics} margin={{ left: -16, right: 8 }}>
                <defs><linearGradient id="g1" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#1460d4" stopOpacity={0.25} /><stop offset="100%" stopColor="#1460d4" stopOpacity={0} /></linearGradient></defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e3e9f3" vertical={false} />
                <XAxis dataKey="month" tick={axis} axisLine={false} tickLine={false} />
                <YAxis tick={axis} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Area type="monotone" dataKey="appointments" name="Appointments" stroke="#1460d4" strokeWidth={2.5} fill="url(#g1)" />
                <Area type="monotone" dataKey="newPatients" name="New patients" stroke="#0b96aa" strokeWidth={2.5} fill="transparent" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
        <ChartCard title="Today’s schedule">
          {todays.length ? (
            <ul className="space-y-3">{todays.map((a) => <li key={a.id} className="flex items-center gap-3 rounded-xl bg-navy-50/60 p-3"><span className="w-20 text-sm font-bold text-brand-700">{a.time}</span><div className="flex-1"><p className="text-sm font-semibold text-navy-900">{a.patientName}</p><p className="text-xs text-navy-500">{getService(a.service)?.name}</p></div><Badge>{a.status}</Badge></li>)}</ul>
          ) : <p className="text-sm text-navy-500">No appointments today.</p>}
        </ChartCard>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <h2 className="mb-3 text-lg font-bold">Recent appointments</h2>
          <DataTable searchable={false} pageSize={5} rows={[...appointments].sort((a, b) => b.date.localeCompare(a.date))} columns={[
            { key: 'patientName', header: 'Patient', render: (a) => <span className="font-medium text-navy-900">{a.patientName}</span> },
            { key: 'service', header: 'Service', render: (a) => getService(a.service)?.name },
            { key: 'dentist', header: 'Dentist', render: (a) => getDentist(a.dentistId)?.name },
            { key: 'date', header: 'Date', render: (a) => `${formatDate(a.date)} · ${a.time}` },
            { key: 'status', header: 'Status', render: (a) => <Badge>{a.status}</Badge> },
          ]} />
        </div>
        <div>
          <h2 className="mb-3 text-lg font-bold">Recent registrations</h2>
          <div className="card divide-y divide-navy-100">
            {[...patients].sort((a, b) => b.joined.localeCompare(a.joined)).slice(0, 5).map((p) => (
              <div key={p.id} className="flex items-center gap-3 p-4"><span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-50 text-sm font-bold text-brand-700">{p.name[0]}</span><div className="flex-1"><p className="text-sm font-semibold text-navy-900">{p.name}</p><p className="text-xs text-navy-500">{p.email}</p></div><span className="text-xs text-navy-400">{formatDate(p.joined, { day: 'numeric', month: 'short' })}</span></div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export function Reports() {
  const toast = useToast();
  const exportCsv = () => {
    const csv = ['Month,Appointments,Revenue (BDT),New patients', ...monthlyAnalytics.map((m) => `${m.month},${m.appointments},${m.revenue},${m.newPatients}`)].join('\n');
    downloadFile('smilecare-report.csv', csv, 'text/csv');
    toast('Report exported');
  };
  const totalRev = monthlyAnalytics.reduce((s, m) => s + m.revenue, 0);
  return (
    <>
      <DashTitle title="Reports & Analytics" sub="Last 6 months performance."><Button variant="outline" onClick={exportCsv}><Download className="h-4 w-4" />Export CSV</Button></DashTitle>
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard icon={Wallet} label="6-month revenue" value={formatBDT(totalRev)} trend={9} />
        <StatCard icon={CalendarCheck} label="6-month appointments" value={monthlyAnalytics.reduce((s, m) => s + m.appointments, 0)} tone="teal" trend={6} />
        <StatCard icon={Users} label="New patients" value={monthlyAnalytics.reduce((s, m) => s + m.newPatients, 0)} tone="amber" trend={14} />
      </div>
      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <ChartCard title="Monthly revenue (BDT)">
          <div className="h-72"><ResponsiveContainer><BarChart data={monthlyAnalytics} margin={{ left: 10 }}><CartesianGrid strokeDasharray="3 3" stroke="#e3e9f3" vertical={false} /><XAxis dataKey="month" tick={axis} axisLine={false} tickLine={false} /><YAxis tick={axis} axisLine={false} tickLine={false} tickFormatter={(v) => `${v / 100000}L`} /><Tooltip contentStyle={tooltipStyle} formatter={(v) => formatBDT(v)} /><Bar dataKey="revenue" name="Revenue" fill="#1460d4" radius={[8, 8, 0, 0]} /></BarChart></ResponsiveContainer></div>
        </ChartCard>
        <ChartCard title="Treatments by category (%)">
          <div className="h-72"><ResponsiveContainer><PieChart><Pie data={serviceShare} dataKey="value" nameKey="name" innerRadius={60} outerRadius={100} paddingAngle={2}>{serviceShare.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip contentStyle={tooltipStyle} formatter={(v) => `${v}%`} /><Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} /></PieChart></ResponsiveContainer></div>
        </ChartCard>
      </div>
    </>
  );
}
