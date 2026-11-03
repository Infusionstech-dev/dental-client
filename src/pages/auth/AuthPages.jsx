import { useState } from 'react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff, Info, MailCheck, CheckCircle2, AlertCircle, Hourglass, User, Stethoscope, ShieldCheck } from 'lucide-react';
import Button from '../../components/common/Button';
import { Field } from '../../components/common/ui';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { authService } from '../../services/authService';
import { cn, homeFor } from '../../utils/format';

const emailRule = { required: 'Email is required', pattern: { value: /^\S+@\S+\.\S+$/, message: 'Enter a valid email' } };
const passwordRule = { required: 'Password is required', minLength: { value: 8, message: 'At least 8 characters' } };

function PasswordInput({ error, reg, ...props }) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <input type={show ? 'text' : 'password'} className={cn('input pr-11', error && 'input-error')} {...reg} {...props} />
      <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-navy-400 hover:text-navy-700" aria-label={show ? 'Hide password' : 'Show password'}>
        {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </button>
    </div>
  );
}

function Header({ title, sub }) {
  return <div className="mb-8"><h1 className="text-3xl font-extrabold">{title}</h1>{sub && <p className="mt-2 text-navy-500">{sub}</p>}</div>;
}

function ErrorBox({ message }) {
  return message ? <p className="flex items-center gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700"><AlertCircle className="h-4 w-4 shrink-0" />{message}</p> : null;
}

export function Login() {
  const { login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState('');
  const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm();

  const onSubmit = async (data) => {
    setError('');
    try {
      const u = await login(data);
      toast(`Welcome back, ${u.name.split(' ')[0]}!`);
      navigate(location.state?.from?.startsWith(homeFor(u.role)) ? location.state.from : homeFor(u.role), { replace: true });
    } catch (e) {
      setError(e.message);
    }
  };

  const fill = (email, password) => { setValue('email', email); setValue('password', password); };

  return (
    <>
      <Header title="Welcome back" sub="Log in to manage your dental care." />
      <div className="mb-6 rounded-xl border border-brand-100 bg-brand-50 p-4 text-sm text-navy-700">
        <p className="flex items-center gap-2 font-semibold"><Info className="h-4 w-4 text-brand-600" />Demo accounts</p>
        <div className="mt-2 flex flex-wrap gap-2">
          <button type="button" onClick={() => fill('patient@demo.com', 'demo1234')} className="rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-brand-700 shadow-sm hover:bg-brand-100">Patient: patient@demo.com / demo1234</button>
          <button type="button" onClick={() => fill('doctor@demo.com', 'doctor1234')} className="rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-brand-700 shadow-sm hover:bg-brand-100">Doctor: doctor@demo.com / doctor1234</button>
          <button type="button" onClick={() => fill('admin@demo.com', 'admin1234')} className="rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-brand-700 shadow-sm hover:bg-brand-100">Admin: admin@demo.com / admin1234</button>
        </div>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
        <ErrorBox message={error} />
        <Field label="Email" error={errors.email?.message}><input type="email" autoComplete="email" className={cn('input', errors.email && 'input-error')} {...register('email', emailRule)} /></Field>
        <Field label="Password" error={errors.password?.message}><PasswordInput error={errors.password} autoComplete="current-password" reg={register('password', { required: 'Password is required' })} /></Field>
        <div className="flex justify-between text-sm">
          <label className="flex items-center gap-2 text-navy-600"><input type="checkbox" className="accent-brand-600" defaultChecked />Remember me</label>
          <Link to="/forgot-password" className="font-semibold text-brand-600 hover:underline">Forgot password?</Link>
        </div>
        <Button type="submit" loading={isSubmitting} className="w-full" size="lg">Log in</Button>
      </form>
      <p className="mt-6 text-center text-sm text-navy-500">New patient? <Link to="/register" className="font-semibold text-brand-600 hover:underline">Create an account</Link></p>
    </>
  );
}

export function Register() {
  const { register: signUp } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [pending, setPending] = useState(null);
  const { register, handleSubmit, watch, setValue, formState: { errors, isSubmitting } } = useForm({ defaultValues: { role: 'patient' } });
  const role = watch('role');
  const isDoctor = role === 'doctor';

  const onSubmit = async ({ confirm, terms, ...data }) => {
    setError('');
    try {
      const res = await signUp(data);
      if (res.pending) {
        setPending(res.user);
        return;
      }
      toast('Account created! Welcome to SmileCare.');
      navigate('/patient', { replace: true });
    } catch (e) {
      setError(e.message);
    }
  };

  if (pending) {
    return (
      <div className="text-center">
        <span className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-amber-50"><Hourglass className="h-8 w-8 text-amber-600" /></span>
        <Header title="Application submitted" sub={`Thank you, ${pending.name}. Your doctor account is pending verification.`} />
        <div className="space-y-2 rounded-2xl bg-navy-50 p-5 text-left text-sm">
          <p className="flex justify-between gap-3"><span className="text-navy-500">Specialization</span><strong>{pending.specialization}</strong></p>
          <p className="flex justify-between gap-3"><span className="text-navy-500">BMDC reg. no.</span><strong>{pending.regNo}</strong></p>
          <p className="flex justify-between gap-3"><span className="text-navy-500">Status</span><strong className="text-amber-700">Awaiting admin approval</strong></p>
        </div>
        <p className="mt-4 text-sm text-navy-500">Our admin team will verify your credentials. Once approved, you can log in to the doctor dashboard.</p>
        <Button to="/login" className="mt-6 w-full">Back to login</Button>
      </div>
    );
  }

  const roles = [
    { value: 'patient', label: 'Patient', desc: 'Book & manage visits', icon: User },
    { value: 'doctor', label: 'Doctor', desc: 'Requires admin approval', icon: Stethoscope },
  ];
  const req = (msg) => (isDoctor ? msg : false);

  return (
    <>
      <Header title="Create your account" sub="Join SmileCare as a patient or as a dental professional." />
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
        <ErrorBox message={error} />
        <div>
          <p className="label">I am registering as</p>
          <div className="grid grid-cols-2 gap-3" role="radiogroup">
            {roles.map(({ value, label, desc, icon: I }) => (
              <button type="button" role="radio" aria-checked={role === value} key={value} onClick={() => setValue('role', value)} className={cn('flex items-center gap-3 rounded-2xl border p-3.5 text-left transition', role === value ? 'border-brand-500 bg-brand-50 ring-2 ring-brand-100' : 'border-navy-200 hover:border-navy-400')}>
                <span className={cn('flex h-10 w-10 shrink-0 items-center justify-center rounded-xl', role === value ? 'bg-brand-600 text-white' : 'bg-navy-50 text-navy-500')}><I className="h-5 w-5" /></span>
                <span><span className="block font-semibold text-navy-900">{label}</span><span className="text-xs text-navy-500">{desc}</span></span>
              </button>
            ))}
          </div>
          <input type="hidden" {...register('role')} />
        </div>
        <Field label="Full name" error={errors.name?.message}><input className={cn('input', errors.name && 'input-error')} placeholder={isDoctor ? 'Dr. Full Name' : ''} {...register('name', { required: 'Full name is required' })} /></Field>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Email" error={errors.email?.message}><input type="email" className={cn('input', errors.email && 'input-error')} {...register('email', emailRule)} /></Field>
          <Field label="Phone" error={errors.phone?.message}><input className={cn('input', errors.phone && 'input-error')} placeholder="+880 1XXX-XXXXXX" {...register('phone', { required: 'Phone is required', pattern: { value: /^[+\d\s-]{8,}$/, message: 'Invalid phone' } })} /></Field>
        </div>
        {isDoctor && (
          <div className="space-y-5 rounded-2xl border border-brand-100 bg-brand-50/40 p-4">
            <p className="flex items-center gap-2 text-sm font-semibold text-navy-800"><ShieldCheck className="h-4 w-4 text-brand-600" />Professional details (verified by admin)</p>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="BMDC registration no." error={errors.regNo?.message}><input className={cn('input', errors.regNo && 'input-error')} placeholder="BMDC A-12345" {...register('regNo', { required: req('Registration number is required') })} /></Field>
              <Field label="Years of experience" error={errors.experience?.message}><input type="number" className={cn('input', errors.experience && 'input-error')} {...register('experience', { required: req('Required'), min: { value: 0, message: 'Invalid' } })} /></Field>
            </div>
            <Field label="Specialization" error={errors.specialization?.message}><input className={cn('input', errors.specialization && 'input-error')} placeholder="e.g. Orthodontics" {...register('specialization', { required: req('Specialization is required') })} /></Field>
            <Field label="Qualifications" error={errors.qualifications?.message}><input className={cn('input', errors.qualifications && 'input-error')} placeholder="e.g. BDS, MS Orthodontics" {...register('qualifications', { required: req('Qualifications are required') })} /></Field>
          </div>
        )}
        <Field label="Password" error={errors.password?.message} hint="At least 8 characters"><PasswordInput error={errors.password} autoComplete="new-password" reg={register('password', passwordRule)} /></Field>
        <Field label="Confirm password" error={errors.confirm?.message}><PasswordInput error={errors.confirm} autoComplete="new-password" reg={register('confirm', { required: 'Please confirm your password', validate: (v) => v === watch('password') || 'Passwords do not match' })} /></Field>
        <Field error={errors.terms?.message}><label className="flex items-start gap-2 text-sm text-navy-600"><input type="checkbox" className="mt-0.5 accent-brand-600" {...register('terms', { required: 'Please accept the terms' })} />I agree to the terms of service and privacy policy.</label></Field>
        <Button type="submit" loading={isSubmitting} className="w-full" size="lg">{isDoctor ? 'Submit for approval' : 'Create account'}</Button>
      </form>
      <p className="mt-6 text-center text-sm text-navy-500">Already have an account? <Link to="/login" className="font-semibold text-brand-600 hover:underline">Log in</Link></p>
    </>
  );
}

export function ForgotPassword() {
  const [sent, setSent] = useState(null);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();
  const onSubmit = async ({ email }) => setSent({ email, ...(await authService.forgotPassword(email)) });

  if (sent) {
    return (
      <div className="text-center">
        <MailCheck className="mx-auto h-14 w-14 text-teal-500" />
        <Header title="Check your email" sub={sent.message} />
        <p className="rounded-xl bg-brand-50 p-4 text-sm text-navy-600">Demo mode: no email is sent. Use the link below to continue.</p>
        <Button to={`/reset-password?token=${sent.token}&email=${encodeURIComponent(sent.email)}`} className="mt-5 w-full">Open reset link</Button>
        <Link to="/login" className="mt-4 inline-block text-sm font-semibold text-brand-600 hover:underline">Back to login</Link>
      </div>
    );
  }
  return (
    <>
      <Header title="Forgot password?" sub="Enter your email and we’ll send you a reset link." />
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
        <Field label="Email" error={errors.email?.message}><input type="email" className={cn('input', errors.email && 'input-error')} {...register('email', emailRule)} /></Field>
        <Button type="submit" loading={isSubmitting} className="w-full" size="lg">Send reset link</Button>
      </form>
      <p className="mt-6 text-center text-sm"><Link to="/login" className="font-semibold text-brand-600 hover:underline">Back to login</Link></p>
    </>
  );
}

export function ResetPassword() {
  const [params] = useSearchParams();
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');
  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm();
  const token = params.get('token');

  const onSubmit = async ({ password }) => {
    setError('');
    try {
      await authService.resetPassword({ token, email: params.get('email'), password });
      setDone(true);
    } catch (e) {
      setError(e.message);
    }
  };

  if (done) {
    return (
      <div className="text-center">
        <CheckCircle2 className="mx-auto h-14 w-14 text-teal-500" />
        <Header title="Password updated" sub="You can now log in with your new password." />
        <Button to="/login" className="w-full">Go to login</Button>
      </div>
    );
  }
  return (
    <>
      <Header title="Set a new password" sub="Choose a strong password you haven’t used before." />
      {!token && <div className="mb-5"><ErrorBox message="This reset link is invalid or has expired. Please request a new one." /></div>}
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
        <ErrorBox message={error} />
        <Field label="New password" error={errors.password?.message}><PasswordInput error={errors.password} reg={register('password', passwordRule)} /></Field>
        <Field label="Confirm new password" error={errors.confirm?.message}><PasswordInput error={errors.confirm} reg={register('confirm', { validate: (v) => v === watch('password') || 'Passwords do not match' })} /></Field>
        <Button type="submit" loading={isSubmitting} disabled={!token} className="w-full" size="lg">Update password</Button>
      </form>
      {!token && <p className="mt-6 text-center text-sm"><Link to="/forgot-password" className="font-semibold text-brand-600 hover:underline">Request a new link</Link></p>}
    </>
  );
}
