import { ReactNode, useEffect, useState } from 'react';

export type BookingView = 'form' | 'confirmation';

interface AnimatedBookingViewProps {
  view: BookingView;
  children: (view: BookingView) => ReactNode;
}

const EXIT_DURATION_MS = 180;

export default function AnimatedBookingView({
  view,
  children,
}: AnimatedBookingViewProps) {
  const [renderedView, setRenderedView] = useState(view);
  const [phase, setPhase] = useState<'idle' | 'leaving' | 'entering'>('idle');

  useEffect(() => {
    if (view === renderedView) return;

    setPhase('leaving');
    const timer = window.setTimeout(() => {
      setRenderedView(view);
      setPhase('entering');
    }, EXIT_DURATION_MS);

    return () => window.clearTimeout(timer);
  }, [renderedView, view]);

  return (
    <div
      key={renderedView}
      className={`view-transition view-transition--${phase}`}
      onAnimationEnd={() => {
        if (phase === 'entering') setPhase('idle');
      }}
    >
      {children(renderedView)}
    </div>
  );
}

