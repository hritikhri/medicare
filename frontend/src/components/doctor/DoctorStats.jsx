import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchDoctorStats } from '../../redux/slices/doctorSlice.js';
import { Calendar, Clock, Users, TrendingUp, DollarSign, XCircle, CheckCircle } from 'lucide-react';

const StatSkeleton = () => (
  <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 animate-pulse">
    <div className="h-4 bg-slate-200 rounded w-3/4 mb-6"></div>
    <div className="h-10 bg-slate-200 rounded w-1/2 mb-4"></div>
    <div className="h-10 w-10 bg-slate-200 rounded-2xl"></div>
  </div>
);

const StatCard = ({ title, value, icon: Icon, gradient, loading, prefix = '' }) => {
  if (loading) return <StatSkeleton />;
  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      <div className="flex justify-between items-start gap-4">
        <div>
          <p className="uppercase tracking-widest text-xs font-medium text-slate-400">{title}</p>
          <p className="text-2xl font-semibold text-slate-900 mt-4 tracking-tight">
            {prefix}{value ?? 0}
          </p>
        </div>
        <div className={`p-4 rounded-2xl bg-gradient-to-br ${gradient} text-white shadow-md shrink-0`}>
          <Icon className="w-7 h-7" />
        </div>
      </div>
    </div>
  );
};

export default function DoctorStats() {
  const dispatch = useDispatch();
  const { stats = {}, statsLoading, error } = useSelector((state) => state.doctor);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user?.role === 'doctor') {
      dispatch(fetchDoctorStats());
    }
  }, [dispatch, user]);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  if (error) {
    return (
      <div className="p-6 text-red-600 bg-red-50 rounded-2xl">
        Failed to load statistics. Please try again.
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
          {greeting}, Doctor
        </h1>
        <p className="text-slate-500 mt-2">Here's your practice overview</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        <StatCard
          title="Total Appointments"
          value={stats.totalAppointments}
          icon={Calendar}
          gradient="from-blue-500 to-cyan-500"
          loading={statsLoading}
        />
        <StatCard
          title="Today's Appointments"
          value={stats.todaysAppointments}
          icon={Clock}
          gradient="from-emerald-500 to-teal-500"
          loading={statsLoading}
        />
        <StatCard
          title="Completed"
          value={stats.completedAppointments}
          icon={CheckCircle}
          gradient="from-green-500 to-emerald-600"
          loading={statsLoading}
        />
        <StatCard
          title="Pending"
          value={stats.pendingAppointments}
          icon={Clock}
          gradient="from-amber-400 to-orange-500"
          loading={statsLoading}
        />
        <StatCard
          title="Cancelled"
          value={stats.cancelledAppointments}
          icon={XCircle}
          gradient="from-red-400 to-rose-500"
          loading={statsLoading}
        />
        <StatCard
          title="Total Patients"
          value={stats.totalPatients}
          icon={Users}
          gradient="from-violet-500 to-purple-600"
          loading={statsLoading}
        />
        {/* <StatCard
          title="Monthly Earnings"
          value={stats.monthlyEarnings?.toLocaleString()}
          icon={TrendingUp}
          gradient="from-pink-500 to-rose-500"
          prefix="₹"
          loading={statsLoading}
        />
        <StatCard
          title="Total Earnings"
          value={stats.totalEarnings?.toLocaleString()}
          icon={DollarSign}
          gradient="from-indigo-500 to-blue-600"
          prefix="₹"
          loading={statsLoading}
        /> */}
      </div>
    </div>
  );
}