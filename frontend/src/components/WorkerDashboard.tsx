import React, { useState } from 'react';
import { Calendar, Clock, User, CheckCircle, XCircle, MessageSquare, Phone, Star } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import { useAppContext } from '../App';

export const WorkerDashboard: React.FC = () => {
  const { bookings, setBookings, addNotification, currentUser } = useAppContext();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  // Simular que el usuario logueado es "Ana García"
  const workerName = currentUser?.name || 'Ana García';

  const workerBookings = bookings.filter(booking => 
    booking.worker === workerName
  );

  const todayBookings = workerBookings.filter(booking => 
    booking.date === new Date().toISOString().split('T')[0] &&
    booking.status !== 'cancelada'
  );

  const selectedDateBookings = workerBookings.filter(booking => 
    booking.date === selectedDate &&
    booking.status !== 'cancelada'
  );

  const upcomingBookings = workerBookings.filter(booking => {
    const bookingDate = new Date(`${booking.date}T${booking.time}`);
    return bookingDate > new Date() && booking.status !== 'cancelada';
  });

  const handleUpdateBookingStatus = (bookingId: number, newStatus: string) => {
    setBookings(prev => prev.map(booking => 
      booking.id === bookingId 
        ? { ...booking, status: newStatus }
        : booking
    ));
    
    const statusMessages: { [key: string]: string } = {
      'confirmada': 'Cita confirmada',
      'completada': 'Cita marcada como completada',
      'cancelada': 'Cita cancelada'
    };
    
    addNotification({
      type: 'success',
      message: statusMessages[newStatus] || 'Estado actualizado',
      timestamp: new Date()
    });
  };

  const formatTime = (time: string) => {
    return time;
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('es-CO', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmada': return 'bg-green-100 text-green-800';
      case 'pendiente': return 'bg-yellow-100 text-yellow-800';
      case 'completada': return 'bg-blue-100 text-blue-800';
      case 'cancelada': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTotalEarnings = () => {
    return workerBookings
      .filter(booking => booking.status === 'completada')
      .reduce((sum, booking) => sum + booking.price, 0);
  };

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

  const getNextWeekDays = () => {
    const today = new Date();
    const days = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      days.push(date);
    }
    return days;
  };

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl">Panel de Trabajo</h1>
          <p className="text-gray-600">Gestiona tu agenda y citas - {workerName}</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <MessageSquare className="w-4 h-4 mr-2" />
            Mensajes
          </Button>
          <Button variant="outline">
            <Phone className="w-4 h-4 mr-2" />
            Contactar Admin
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Calendar className="w-8 h-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{todayBookings.length}</p>
                <p className="text-sm text-gray-600">Citas Hoy</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Clock className="w-8 h-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold">{upcomingBookings.length}</p>
                <p className="text-sm text-gray-600">Próximas Citas</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <User className="w-8 h-8 text-purple-600" />
              <div>
                <p className="text-2xl font-bold">
                  {workerBookings.filter(b => b.status === 'completada').length}
                </p>
                <p className="text-sm text-gray-600">Completadas</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Star className="w-8 h-8 text-yellow-600" />
              <div>
                <p className="text-2xl font-bold">${getTotalEarnings().toLocaleString()}</p>
                <p className="text-sm text-gray-600">Ganancias</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="today" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="today">Hoy</TabsTrigger>
          <TabsTrigger value="agenda">Agenda</TabsTrigger>
          <TabsTrigger value="calendar">Calendario</TabsTrigger>
          <TabsTrigger value="stats">Estadísticas</TabsTrigger>
        </TabsList>

        <TabsContent value="today" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Agenda de Hoy</CardTitle>
              <CardDescription>
                {formatDate(new Date().toISOString().split('T')[0])}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {todayBookings.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg mb-2">No tienes citas para hoy</h3>
                  <p className="text-gray-600">¡Disfruta tu día libre!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {todayBookings.sort((a, b) => a.time.localeCompare(b.time)).map((booking) => (
                    <div 
                      key={booking.id} 
                      className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold">{booking.service}</h3>
                            <Badge className={getStatusColor(booking.status)}>
                              {booking.status}
                            </Badge>
                          </div>
                          <div className="space-y-1 text-sm text-gray-600">
                            <p className="flex items-center gap-2">
                              <Clock className="w-4 h-4" />
                              {formatTime(booking.time)} ({booking.duration} min)
                            </p>
                            <p className="flex items-center gap-2">
                              <User className="w-4 h-4" />
                              {booking.clientName}
                            </p>
                            <p className="text-green-600 font-medium">
                              ${booking.price.toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          {booking.status === 'confirmada' && (
                            <>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleUpdateBookingStatus(booking.id, 'completada')}
                                className="text-green-600 hover:text-green-700"
                              >
                                <CheckCircle className="w-4 h-4 mr-1" />
                                Completar
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleUpdateBookingStatus(booking.id, 'cancelada')}
                                className="text-red-600 hover:text-red-700"
                              >
                                <XCircle className="w-4 h-4 mr-1" />
                                Cancelar
                              </Button>
                            </>
                          )}
                          <Button variant="outline" size="sm">
                            <MessageSquare className="w-4 h-4 mr-1" />
                            Contactar
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="agenda" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Agenda Semanal</CardTitle>
              <CardDescription>
                Vista general de tus próximas citas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {getNextWeekDays().map((date) => {
                  const dateStr = date.toISOString().split('T')[0];
                  const dayBookings = workerBookings.filter(booking => 
                    booking.date === dateStr && booking.status !== 'cancelada'
                  );

                  return (
                    <div key={dateStr} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold">
                          {date.toLocaleDateString('es-CO', { 
                            weekday: 'long', 
                            month: 'short', 
                            day: 'numeric' 
                          })}
                        </h3>
                        <Badge variant="secondary">
                          {dayBookings.length} citas
                        </Badge>
                      </div>
                      
                      {dayBookings.length === 0 ? (
                        <p className="text-gray-500 text-sm">Sin citas programadas</p>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                          {dayBookings.sort((a, b) => a.time.localeCompare(b.time)).map((booking) => (
                            <div key={booking.id} className="bg-gray-50 p-3 rounded">
                              <div className="flex items-center justify-between mb-1">
                                <span className="font-medium text-sm">{booking.time}</span>
                                <Badge size="sm" className={getStatusColor(booking.status)}>
                                  {booking.status}
                                </Badge>
                              </div>
                              <p className="text-sm">{booking.service}</p>
                              <p className="text-xs text-gray-600">{booking.clientName}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="calendar" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Vista de Calendario</CardTitle>
              <CardDescription>
                Selecciona una fecha para ver los detalles
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Date Selector */}
                <div className="flex items-center gap-4">
                  <label className="font-medium">Fecha:</label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="border rounded px-3 py-2"
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>

                {/* Time Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-3">Horarios del Día</h4>
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                      {generateTimeSlots().map((timeSlot) => {
                        const booking = selectedDateBookings.find(b => b.time === timeSlot);
                        return (
                          <div 
                            key={timeSlot}
                            className={`p-3 rounded border ${
                              booking 
                                ? 'bg-pink-50 border-pink-200' 
                                : 'bg-gray-50 border-gray-200'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-medium">{timeSlot}</span>
                              {booking ? (
                                <Badge className={getStatusColor(booking.status)}>
                                  Ocupado
                                </Badge>
                              ) : (
                                <Badge variant="outline">Libre</Badge>
                              )}
                            </div>
                            {booking && (
                              <div className="mt-2 text-sm">
                                <p className="font-medium">{booking.service}</p>
                                <p className="text-gray-600">{booking.clientName}</p>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-3">
                      Citas para {formatDate(selectedDate)}
                    </h4>
                    {selectedDateBookings.length === 0 ? (
                      <p className="text-gray-500">No hay citas programadas para este día</p>
                    ) : (
                      <div className="space-y-3">
                        {selectedDateBookings.sort((a, b) => a.time.localeCompare(b.time)).map((booking) => (
                          <div key={booking.id} className="border rounded p-3">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-medium">{booking.time}</span>
                              <Badge className={getStatusColor(booking.status)}>
                                {booking.status}
                              </Badge>
                            </div>
                            <h4 className="font-semibold">{booking.service}</h4>
                            <p className="text-sm text-gray-600">{booking.clientName}</p>
                            <p className="text-sm font-medium text-green-600">
                              ${booking.price.toLocaleString()}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stats" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Estadísticas del Mes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Citas Completadas:</span>
                  <span className="font-semibold">
                    {workerBookings.filter(b => b.status === 'completada').length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Citas Canceladas:</span>
                  <span className="font-semibold text-red-600">
                    {workerBookings.filter(b => b.status === 'cancelada').length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Total de Ingresos:</span>
                  <span className="font-semibold text-green-600">
                    ${getTotalEarnings().toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Promedio por Cita:</span>
                  <span className="font-semibold">
                    ${Math.round(getTotalEarnings() / Math.max(workerBookings.filter(b => b.status === 'completada').length, 1)).toLocaleString()}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Servicios Más Populares</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {Object.entries(
                  workerBookings.reduce((acc: any, booking) => {
                    acc[booking.service] = (acc[booking.service] || 0) + 1;
                    return acc;
                  }, {})
                ).sort(([,a], [,b]) => (b as number) - (a as number)).map(([service, count]) => (
                  <div key={service} className="flex justify-between items-center">
                    <span>{service}</span>
                    <Badge variant="secondary">{count} veces</Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};