import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { CheckCircle, MessageCircle } from 'lucide-react';
import BookingForm from '../components/BookingForm';
import type { BookingData } from '../utils/types';

const Booking: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedData, setSubmittedData] = useState<BookingData | null>(null);

  const selectedRoom = searchParams.get('room');

  const handleBookingSubmit = (data: BookingData) => {
    setSubmittedData(data);
    setIsSubmitted(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setIsSubmitted(false);
    setSubmittedData(null);
  };

  const calculateBookingTotal = () => {
    if (!submittedData) return 0;
    
    // Get room pricing based on meal plan
    const roomPrices = {
      1: { bed_only: 1000, bb: 1200, half_board: 2500, full_board: 3500 },
      2: { bed_only: 1200, bb: 1500, half_board: 2800, full_board: 4300 },
      3: { bed_only: 2500, bb: 2900, half_board: 4300, full_board: 6300 }
    };
    
    const nights = Math.ceil(
      (new Date(submittedData.checkOut).getTime() -
        new Date(submittedData.checkIn).getTime()) /
        (1000 * 3600 * 24)
    );
    
    const roomPrice = roomPrices[submittedData.roomType as keyof typeof roomPrices];
    const pricePerNight = roomPrice ? roomPrice[submittedData.mealPlan] : 3500;
    
    return nights * pricePerNight;
  };

  const calculateDepositAmount = () => {
    const total = calculateBookingTotal();
    return Math.ceil((total * 0.5) / 50) * 50;
  };

  if (isSubmitted && submittedData) {
    const mealPlanLabel = {
      bed_only: 'Bed Only',
      bb: 'Bed & Breakfast',
      half_board: 'Half Board',
      full_board: 'Full Board',
    }[submittedData.mealPlan];
    
    const message = `Hi, I just submitted a booking request.%0A%0AName: ${submittedData.name}%0APhone: ${submittedData.phone}%0AEmail: ${submittedData.email}%0ACheck-in: ${submittedData.checkIn}%0ACheck-out: ${submittedData.checkOut}%0AGuests: ${submittedData.guests}%0AMeal Plan: ${mealPlanLabel}%0ATotal Amount: KSh ${calculateBookingTotal().toLocaleString()}%0ADeposit Required: KSh ${calculateDepositAmount().toLocaleString()}%0ASpecial Requests: ${submittedData.specialRequests || 'None'}`;

    return (
      <div className="min-h-screen bg-gray-50">
        <section className="py-20">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="h-10 w-10 text-green-600" />
              </div>

              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Booking Request Created!
              </h1>

              <p className="text-lg text-gray-600 mb-6">
                We’ve prepared your booking request. Please confirm it via WhatsApp below.
              </p>

              <div className="bg-gray-50 p-6 rounded-lg mb-8 text-left">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Booking Summary</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div><span className="font-medium">Name:</span> {submittedData.name}</div>
                  <div><span className="font-medium">Email:</span> {submittedData.email}</div>
                  <div><span className="font-medium">Phone:</span> {submittedData.phone}</div>
                  <div><span className="font-medium">Guests:</span> {submittedData.guests}</div>
                  <div><span className="font-medium">Check-in:</span> {new Date(submittedData.checkIn).toLocaleDateString()}</div>
                  <div><span className="font-medium">Check-out:</span> {new Date(submittedData.checkOut).toLocaleDateString()}</div>
                  <div><span className="font-medium">Meal Plan:</span> {mealPlanLabel}</div>
                  <div><span className="font-medium">Total:</span> KSh {calculateBookingTotal().toLocaleString()}</div>
                  <div className="md:col-span-2"><span className="font-medium">Deposit Required (50%):</span> <span className="text-amber-600 font-bold">KSh {calculateDepositAmount().toLocaleString()}</span></div>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <p className="text-gray-600">Confirm your request below:</p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  
                  <a
                    href={`https://wa.me/+254720577442?text=${message}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                  >
                    <MessageCircle className="h-5 w-5" />
                    <span>WhatsApp Us</span>
                  </a>
                </div>
              </div>

              <button
                onClick={resetForm}
                className="text-amber-600 hover:text-amber-700 font-semibold"
              >
                Make Another Booking
              </button>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="relative py-20 bg-gradient-to-r from-amber-600 to-amber-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Book Your Stay</h1>
          <p className="text-xl text-amber-100 max-w-3xl mx-auto">
            Reserve your comfortable accommodation at ACK Mt. Kenya Guest House
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Reservation Details</h2>
              <p className="text-gray-600">
                Fill in the form below. We'll prepare your booking message and help you contact us directly via WhatsApp or phone.
              </p>
            </div>

            <BookingForm
              selectedRoom={selectedRoom || undefined}
              onSubmit={handleBookingSubmit}
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Booking;
