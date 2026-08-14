import { useState } from 'react';
import Head from 'next/head';
import BookingForm from '@/components/BookingForm';
import ConfirmationScreen from '@/components/ConfirmationScreen';
import AnimatedBookingView, {
  BookingView,
} from '@/components/AnimatedBookingView';
import { BookingFormData, BookingStatus } from '@/types/booking';

export default function Home() {
  const [status, setStatus] = useState<BookingStatus>('idle');
  const [bookingData, setBookingData] = useState<BookingFormData | null>(null);

  function handleSubmit(data: BookingFormData) {
    setStatus('loading');
    setTimeout(() => {
      setBookingData(data);
      setStatus('success');
    }, 1500);
  }

  function handleReset() {
    setStatus('idle');
  }

  const view: BookingView = status === 'success' ? 'confirmation' : 'form';

  return (
    <>
      <Head>
        <title>SAVEUR — Бронирование столика</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main className="page">
        <div className="card">
          <AnimatedBookingView view={view}>
            {(renderedView) =>
              renderedView === 'form' ? (
                <>
                  <p className="brand">SAVEUR</p>
                  <h1 className="title">Бронирование столика</h1>
                  <p className="subtitle">
                    Заполните форму — мы подтвердим бронь и будем ждать вас в
                    ресторане.
                  </p>
                  <BookingForm status={status} onSubmit={handleSubmit} />
                </>
              ) : (
                bookingData && (
                  <ConfirmationScreen data={bookingData} onReset={handleReset} />
                )
              )
            }
          </AnimatedBookingView>
        </div>
      </main>
    </>
  );
}
