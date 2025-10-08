import React, { useState } from 'react';
import { Calendar, Clock, User, ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import { useAppContext } from '../App';

export const BookingCalendar: React.FC = () => {
  const { services, workers, bookings, setBookings, addNotification, currentUser } = useAppContext();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedService, setSelectedService] = useState<any>(null);
  const [selectedWorker, setSelectedWorker] = useState<any>(null);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [step, setStep] = useState(1);

  // Generar calendario del mes actual
  const generateCalendar = () => {
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Días vacíos al inicio
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Días del mes
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  // Horarios disponibles
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 8; hour < 20; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        slots.push(timeString);
      }
    }
    return slots;
  };

  const isTimeSlotAvailable = (time: string) => {
    if (!selectedWorker || !selectedDate) return false;
    
    const dateStr = selectedDate.toISOString().split('T')[0];
    const existingBooking = bookings.find(booking => 
      booking.worker === selectedWorker.name &&
      booking.date === dateStr &&
      booking.time === time &&
      booking.status !== 'cancelada'
    );
    
    return !existingBooking;
  };

  const handleDateClick = (date: Date | null) => {
    if (!date) return;
    if (date < new Date()) return; // No permitir fechas pasadas
    
    setSelectedDate(date);
    setSelectedTime('');
    if (selectedService && selectedWorker) {
      setStep(3);
    }
  };

  const handleServiceSelect = (service: any) => {
    setSelectedService(service);
    
    // Auto-asignar trabajador si solo hay uno disponible para este servicio
    const availableWorkers = workers.filter(worker => 
      worker.specialty === service.category
    );
    
    if (availableWorkers.length === 1) {
      setSelectedWorker(availableWorkers[0]);
      if (selectedDate) {
        setStep(3);
      } else {
        setStep(2);
      }
    } else {
      setStep(2);
    }
  };

  const handleWorkerSelect = (worker: any) => {
    setSelectedWorker(worker);
    if (selectedDate) {
      setStep(3);
    } else {
      setStep(2);
    }
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    setStep(4);
  };

  const handleBookingConfirm = () => {
    const newBooking = {
      id: Date.now(),
      clientName: currentUser?.name || 'Cliente',
      clientEmail: currentUser?.email || 'cliente@email.com',
      service: selectedService.name,
      worker: selectedWorker.name,
      date: selectedDate.toISOString().split('T')[0],
      time: selectedTime,
      status: 'confirmada',
      duration: selectedService.duration,
      price: selectedService.price
    };

    setBookings(prev => [...prev, newBooking]);
    
    addNotification({
      type: 'success',
      message: `Cita reservada para el ${selectedDate.toLocaleDateString()} a las ${selectedTime}`,
      timestamp: new Date()
    });

    // Reset form
    setSelectedService(null);
    setSelectedWorker(null);
    setSelectedTime('');
    setStep(1);
  };

  const nextMonth = () => {
    setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 1));
  };

  const prevMonth = () => {
    setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1, 1));
  };

  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl">Reservar Cita</h1>
          <p className="text-gray-600">Selecciona tu servicio, profesional y horario</p>
        </div>
        <div className="flex items-center space-x-2">
          {[1, 2, 3, 4].map((stepNumber) => (
            <div key={stepNumber} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                step >= stepNumber 
                  ? 'bg-pink-600 text-white' 
                  : 'bg-gray-200 text-gray-600'
              }`}>
                {step > stepNumber ? <Check className="w-4 h-4" /> : stepNumber}
              </div>
              {stepNumber < 4 && (
                <div className={`w-8 h-0.5 ${
                  step > stepNumber ? 'bg-pink-600' : 'bg-gray-200'
                }`} />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Step 1: Seleccionar Servicio */}
        <Card className={step === 1 ? 'ring-2 ring-pink-600' : ''}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="w-6 h-6 bg-pink-600 text-white rounded-full flex items-center justify-center text-sm">1</span>
              Seleccionar Servicio
            </CardTitle>
            {selectedService && (
              <CardDescription>
                Servicio: {selectedService.name} - ${selectedService.price.toLocaleString()}
              </CardDescription>
            )}
          </CardHeader>
          <CardContent className="space-y-3">
            {Object.entries(
              services.reduce((acc: any, service) => {
                if (!acc[service.category]) acc[service.category] = [];
                acc[service.category].push(service);
                return acc;
              }, {})
            ).map(([category, categoryServices]: [string, any]) => (
              <div key={category}>
                <h4 className="font-medium mb-2">{category}</h4>
                <div className="space-y-2">
                  {(categoryServices as any[]).map((service) => (
                    <button
                      key={service.id}
                      onClick={() => handleServiceSelect(service)}
                      className={`w-full text-left p-3 rounded-lg border transition-colors ${
                        selectedService?.id === service.id
                          ? 'border-pink-600 bg-pink-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">{service.name}</p>
                          <p className="text-sm text-gray-600">{service.duration} min</p>
                        </div>
                        <span className="font-semibold text-pink-600">
                          ${service.price.toLocaleString()}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Step 2: Seleccionar Profesional */}
        <Card className={step === 2 ? 'ring-2 ring-pink-600' : ''}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-sm ${
                step >= 2 ? 'bg-pink-600 text-white' : 'bg-gray-200 text-gray-600'
              }`}>2</span>
              Seleccionar Profesional
            </CardTitle>
            {selectedWorker && (
              <CardDescription>
                Profesional: {selectedWorker.name}
              </CardDescription>
            )}
          </CardHeader>
          <CardContent className="space-y-3">
            {selectedService ? (
              workers
                .filter(worker => worker.specialty === selectedService.category)
                .map((worker) => (
                  <button
                    key={worker.id}
                    onClick={() => handleWorkerSelect(worker)}
                    className={`w-full text-left p-3 rounded-lg border transition-colors ${
                      selectedWorker?.id === worker.id
                        ? 'border-pink-600 bg-pink-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarFallback className="bg-pink-100 text-pink-600">
                          {worker.avatar}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{worker.name}</p>
                        <p className="text-sm text-gray-600">{worker.schedule}</p>
                        <Badge variant="secondary">{worker.specialty}</Badge>
                      </div>
                    </div>
                  </button>
                ))
            ) : (
              <p className="text-gray-500 text-center py-8">
                Selecciona primero un servicio
              </p>
            )}
          </CardContent>
        </Card>

        {/* Step 3: Seleccionar Fecha y Hora */}
        <Card className={step === 3 ? 'ring-2 ring-pink-600' : ''}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-sm ${
                step >= 3 ? 'bg-pink-600 text-white' : 'bg-gray-200 text-gray-600'
              }`}>3</span>
              Fecha y Hora
            </CardTitle>
            {selectedDate && selectedTime && (
              <CardDescription>
                {selectedDate.toLocaleDateString()} a las {selectedTime}
              </CardDescription>
            )}
          </CardHeader>
          <CardContent>
            {selectedService && selectedWorker ? (
              <div className="space-y-4">
                {/* Calendar Header */}
                <div className="flex items-center justify-between">
                  <Button variant="ghost" size="sm" onClick={prevMonth}>
                    <ArrowLeft className="w-4 h-4" />
                  </Button>
                  <h3 className="font-medium">
                    {monthNames[selectedDate.getMonth()]} {selectedDate.getFullYear()}
                  </h3>
                  <Button variant="ghost" size="sm" onClick={nextMonth}>
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-1 text-sm">
                  {dayNames.map((day) => (
                    <div key={day} className="text-center text-gray-600 font-medium p-2">
                      {day}
                    </div>
                  ))}
                  {generateCalendar().map((date, index) => (
                    <button
                      key={index}
                      onClick={() => handleDateClick(date)}
                      disabled={!date || date < new Date()}
                      className={`p-2 text-center rounded transition-colors ${
                        !date 
                          ? 'invisible'
                          : date < new Date()
                          ? 'text-gray-300 cursor-not-allowed'
                          : date.toDateString() === selectedDate.toDateString()
                          ? 'bg-pink-600 text-white'
                          : 'hover:bg-gray-100'
                      }`}
                    >
                      {date?.getDate()}
                    </button>
                  ))}
                </div>

                {/* Time Slots */}
                {selectedDate && (
                  <div className="space-y-2">
                    <h4 className="font-medium">Horarios Disponibles</h4>
                    <div className="grid grid-cols-3 gap-2 max-h-40 overflow-y-auto">
                      {generateTimeSlots().map((time) => (
                        <button
                          key={time}
                          onClick={() => handleTimeSelect(time)}
                          disabled={!isTimeSlotAvailable(time)}
                          className={`p-2 text-sm rounded border transition-colors ${
                            !isTimeSlotAvailable(time)
                              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                              : selectedTime === time
                              ? 'border-pink-600 bg-pink-50 text-pink-600'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">
                Completa los pasos anteriores
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Step 4: Confirmación */}
      {step === 4 && (
        <Card className="ring-2 ring-pink-600">
          <CardHeader>
            <CardTitle>Confirmar Reserva</CardTitle>
            <CardDescription>
              Revisa los detalles de tu cita antes de confirmar
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                <div className="flex justify-between">
                  <span className="font-medium">Servicio:</span>
                  <span>{selectedService?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Profesional:</span>
                  <span>{selectedWorker?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Fecha:</span>
                  <span>{selectedDate.toLocaleDateString('es-CO', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Hora:</span>
                  <span>{selectedTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Duración:</span>
                  <span>{selectedService?.duration} minutos</span>
                </div>
                <div className="flex justify-between text-lg font-semibold border-t pt-3">
                  <span>Total:</span>
                  <span className="text-pink-600">${selectedService?.price.toLocaleString()}</span>
                </div>
              </div>

              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  onClick={() => setStep(3)}
                  className="flex-1"
                >
                  Atrás
                </Button>
                <Button 
                  onClick={handleBookingConfirm}
                  className="flex-1 bg-pink-600 hover:bg-pink-700"
                >
                  <Check className="w-4 h-4 mr-2" />
                  Confirmar Reserva
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};