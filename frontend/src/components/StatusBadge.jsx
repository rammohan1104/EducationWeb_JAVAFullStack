import React from 'react';

export const StatusBadge = ({ status, size = 'md' }) => {
  const s = String(status || '').toUpperCase();

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
    lg: 'text-sm px-3 py-1.5',
  };

  const getStyle = () => {
    switch (s) {
      case 'APPROVED':
      case 'ENROLLED':
      case 'ACTIVE':
      case 'COMPLETED':
      case 'GRADED':
        return 'bg-emerald-50 text-emerald-700 border border-emerald-200/80';
      case 'PENDING':
      case 'SUBMITTED':
        return 'bg-amber-50 text-amber-700 border border-amber-200/80';
      case 'REJECTED':
      case 'CANCELLED':
      case 'INACTIVE':
      case 'SUSPENDED':
        return 'bg-rose-50 text-rose-700 border border-rose-200/80';
      case 'URGENT':
        return 'bg-rose-100 text-rose-800 border border-rose-300 animate-pulse';
      default:
        return 'bg-slate-100 text-slate-700 border border-slate-200';
    }
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-semibold rounded-full uppercase tracking-wider ${sizeClasses[size]} ${getStyle()}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80"></span>
      {s}
    </span>
  );
};

export default StatusBadge;
