import React, { useState } from 'react';
import { Calendar, Clock, User, CreditCard, Star, MessageSquare, Settings, Bell } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import { useAppContext } from '../App';

export const ClientDashboard: React.FC = () => {
  const { bookings, setBookings, addNotification, currentUser, setActiveView } = useAppContext();
  const [selectedBooking, setSelectedBooking] = useState<any>(null);

  const userBookings = bookings.filter(booking => 
    booking.clientEmail === currentUser?.email
  );

  const upcomingBookings = userBookings.filter(booking => {
    const bookingDate = new Date(`${booking.date}T${booking.time}`);
    return bookingDate > new Date() && booking.status !== 'cancelada';
  });

  const pastBookings = userBookings.filter(booking => {
    const bookingDate = new Date(`${booking.date}T${booking.time}`);
    return bookingDate < new Date() || booking.status === 'completada';
  });

  const handleCancelBooking = (bookingId: number) => {
    setBookings(prev => prev.map(booking => 
      booking.id === bookingId 
        ? { ...booking, status: 'cancelada' }
        : booking
    ));
    addNotification({
      type: 'info',
      message: 'Cita cancelada exitosamente',
      timestamp: new Date()
    });
  };

  const handleRescheduleBooking = (bookingId: number) => {
    // En una implementación real, esto abriría un modal de reprogramación
    addNotification({
      type: 'info',
      message: 'Funcionalidad de reprogramación disponible próximamente',
      timestamp: new Date()
    });
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
      case 'cancelada': return 'bg-red-100 text-red-800';
      case 'completada': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl">Bienvenida, {currentUser?.name}</h1>
          <p className="text-gray-600">Gestiona tus citas y servicios</p>
        </div>
        <Button 
          onClick={() => setActiveView('booking')}
          className="bg-pink-600 hover:bg-pink-700"
        >
          <Calendar className="w-4 h-4 mr-2" />
          Nueva Cita
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Calendar className="w-8 h-8 text-pink-600" />
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
              <Clock className="w-8 h-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{pastBookings.length}</p>
                <p className="text-sm text-gray-600">Citas Realizadas</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Star className="w-8 h-8 text-yellow-600" />
              <div>
                <p className="text-2xl font-bold">4.8</p>
                <p className="text-sm text-gray-600">Satisfacción</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <CreditCard className="w-8 h-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold">
                  ${userBookings.reduce((sum, booking) => sum + booking.price, 0).toLocaleString()}
                </p>
                <p className="text-sm text-gray-600">Total Gastado</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="upcoming" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="upcoming">Próximas Citas</TabsTrigger>
          <TabsTrigger value="history">Historial</TabsTrigger>
          <TabsTrigger value="favorites">Favoritos</TabsTrigger>
          <TabsTrigger value="profile">Perfil</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Próximas Citas</CardTitle>
              <CardDescription>
                Gestiona tus citas programadas
              </CardDescription>
            </CardHeader>
            <CardContent>
              {upcomingBookings.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg mb-2">No tienes citas programadas</h3>
                  <p className="text-gray-600 mb-4">¡Agenda tu próxima cita ahora!</p>
                  <Button 
                    onClick={() => setActiveView('booking')}
                    className="bg-pink-600 hover:bg-pink-700"
                  >
                    Reservar Cita
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {upcomingBookings.map((booking) => (
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
                              <Calendar className="w-4 h-4" />
                              {formatDate(booking.date)}
                            </p>
                            <p className="flex items-center gap-2">
                              <Clock className="w-4 h-4" />
                              {booking.time} ({booking.duration} min)
                            </p>
                            <p className="flex items-center gap-2">
                              <User className="w-4 h-4" />
                              {booking.worker}
                            </p>
                            <p className="flex items-center gap-2">
                              <CreditCard className="w-4 h-4" />
                              ${booking.price.toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleRescheduleBooking(booking.id)}
                          >
                            Reprogramar
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleCancelBooking(booking.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            Cancelar
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

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Historial de Citas</CardTitle>
              <CardDescription>
                Revisa tus servicios anteriores
              </CardDescription>
            </CardHeader>
            <CardContent>
              {pastBookings.length === 0 ? (
                <div className="text-center py-8">
                  <Clock className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg mb-2">Sin historial aún</h3>
                  <p className="text-gray-600">Tus citas completadas aparecerán aquí</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {pastBookings.map((booking) => (
                    <div 
                      key={booking.id} 
                      className="border rounded-lg p-4 opacity-75"
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
                              <Calendar className="w-4 h-4" />
                              {formatDate(booking.date)}
                            </p>
                            <p className="flex items-center gap-2">
                              <User className="w-4 h-4" />
                              {booking.worker}
                            </p>
                            <p className="flex items-center gap-2">
                              <CreditCard className="w-4 h-4" />
                              ${booking.price.toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Star className="w-4 h-4 mr-2" />
                            Calificar
                          </Button>
                          <Button variant="outline" size="sm">
                            Reservar Nuevamente
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

        <TabsContent value="favorites" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Servicios Favoritos</CardTitle>
              <CardDescription>
                Tus servicios más frecuentes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold mb-2">Corte de Cabello</h3>
                  <p className="text-sm text-gray-600 mb-3">Reservado 3 veces</p>
                  <Button size="sm" className="bg-pink-600 hover:bg-pink-700">
                    Reservar Ahora
                  </Button>
                </div>
                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold mb-2">Manicure Clásica</h3>
                  <p className="text-sm text-gray-600 mb-3">Reservado 2 veces</p>
                  <Button size="sm" className="bg-pink-600 hover:bg-pink-700">
                    Reservar Ahora
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="profile" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Mi Perfil</CardTitle>
              <CardDescription>
                Información personal y preferencias
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center space-x-4">
                <Avatar className="w-20 h-20">
                  <AvatarFallback className="bg-pink-100 text-pink-600 text-xl">
                    {currentUser?.name?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-xl font-semibold">{currentUser?.name}</h3>
                  <p className="text-gray-600">{currentUser?.email}</p>
                  <Button variant="outline" size="sm" className="mt-2">
                    Editar Foto
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-3">Información Personal</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm text-gray-600">Teléfono</label>
                      <p>+57 300 123 4567</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">Fecha de Nacimiento</label>
                      <p>15 de marzo, 1990</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-3">Preferencias</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm text-gray-600">Estilista Preferida</label>
                      <p>Ana García</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">Notificaciones</label>
                      <p>Email + WhatsApp</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button variant="outline">
                  <Settings className="w-4 h-4 mr-2" />
                  Configuración
                </Button>
                <Button variant="outline">
                  <Bell className="w-4 h-4 mr-2" />
                  Notificaciones
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};