import { useState, type FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import Field from '@/components/Field';
import Seo from '@/components/Seo';
import { useStatistics } from '@/hooks/useAdmin';
import { button } from '@/lib/classes';

const toInputValue = (date: Date) => date.toISOString().slice(0, 10);

const oneYearAgo = () => {
  const date = new Date();
  date.setFullYear(date.getFullYear() - 1);
  return date;
};

interface StatChartProps {
  title: string;
  labels: (string | number)[];
  values: number[];
}

const StatChart = ({ title, labels, values }: StatChartProps) => {
  const data = labels.map((label, index) => ({ label: String(label), value: values[index] }));

  return (
    <section className="rounded-lg border bg-surface p-4">
      <h2 className="font-semibold">{title}</h2>
      <div className="mt-4 h-60">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid stroke="var(--border)" vertical={false} />
            <XAxis dataKey="label" stroke="var(--muted-foreground)" fontSize={12} />
            <YAxis
              allowDecimals={false}
              stroke="var(--muted-foreground)"
              fontSize={12}
              width={30}
            />
            <Tooltip
              contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
            />
            <Line dataKey="value" stroke="var(--ring)" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
};

const Chart = () => {
  const { t } = useTranslation('admintable');
  const [startInput, setStartInput] = useState(() => toInputValue(oneYearAgo()));
  const [endInput, setEndInput] = useState(() => toInputValue(new Date()));
  const [range, setRange] = useState(() => ({ start: oneYearAgo(), end: new Date() }));

  const { data: stats } = useStatistics(range.start, range.end);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const start = new Date(startInput);
    const end = new Date(endInput);
    if (!isNaN(start.getTime()) && !isNaN(end.getTime()) && start <= end) {
      setRange({ start, end });
    }
  };

  const posts = stats?.postStatics ?? [];
  const comments = stats?.commentStatics ?? [];
  const likes = stats?.likeStatics ?? [];

  return (
    <div>
      <Seo title={t('usercount')} noindex />
      <form onSubmit={handleSubmit} className="flex flex-wrap items-end gap-4">
        <Field
          id="start"
          label={t('chartstartdate')}
          type="date"
          value={startInput}
          onChange={(e) => setStartInput(e.target.value)}
          required
        />
        <Field
          id="end"
          label={t('chartenddate')}
          type="date"
          value={endInput}
          onChange={(e) => setEndInput(e.target.value)}
          required
        />
        <button type="submit" className={button()}>
          {t('filterbutton')}
        </button>
      </form>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <StatChart
          title={t('postpermouth')}
          labels={posts.map((i) => i.month)}
          values={posts.map((i) => i.postCount)}
        />
        <StatChart
          title={t('messagepermouth')}
          labels={comments.map((i) => i.month)}
          values={comments.map((i) => i.commentCount)}
        />
        <StatChart
          title={t('likepermouth')}
          labels={likes.map((i) => i.month)}
          values={likes.map((i) => i.likeCount)}
        />
        <section className="flex flex-col justify-center rounded-lg border bg-surface p-4">
          <p className="text-sm text-muted-foreground">{t('usercount')}</p>
          <p className="mt-1 text-5xl font-bold">{stats?.userCount ?? 0}</p>
        </section>
      </div>
    </div>
  );
};

export default Chart;
