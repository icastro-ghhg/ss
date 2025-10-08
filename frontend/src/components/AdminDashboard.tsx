import React, { useState } from 'react';
import { 
  Users, Calendar, DollarSign, TrendingUp, Settings, UserPlus, 
  Edit, Trash2, Plus, BarChart3, Clock, Star, MessageSquare 
} from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { useAppContext } from '../App';

export const AdminDashboard: React.FC = () => {
  const { bookings, services, workers, setBookings, addNotification } = useAppContext();
  const [showAddServiceModal, setShowAddServiceModal] = useState(false);
  const [showAddWorkerModal, setShowAddWorkerModal] = useState(false);
  const [editingService, setEditingService] = useState<any>(null);
  const [editingWorker, setEditingWorker] = useState<any>(null);
  
  // Form states
  const [newService, setNewService] = useState({
    name: '',
    duration: 30,
    price: 0,
    category: 'Cabello'
  });
  
  const [newWorker, setNewWorker] = useState({
    name: '',
    specialty: 'Cabello',
    schedule: '9:00-17:00',
    phone: '',
    email: ''
  });

  // Statistics calculations
  const totalRevenue = bookings
    .filter(booking => booking.status === 'completada')
    .reduce((sum, booking) => sum + booking.price, 0);

  const monthlyBookings = bookings.filter(booking => {
    const bookingDate = new Date(booking.date);
    const currentMonth = new Date();
    return bookingDate.getMonth() === currentMonth.getMonth() &&
           bookingDate.getFullYear() === currentMonth.getFullYear();
  });

  const pendingBookings = bookings.filter(booking => booking.status === 'pendiente');
  const completedBookings = bookings.filter(booking => booking.status === 'completada');

  const serviceStats = services.map(service => {
    const serviceBookings = bookings.filter(booking => booking.service === service.name);
    const revenue = serviceBookings
      .filter(booking => booking.status === 'completada')
      .reduce((sum, booking) => sum + booking.price, 0);
    
    return {
      ...service,
      bookingCount: serviceBookings.length,
      revenue
    };
  }).sort((a, b) => b.bookingCount - a.bookingCount);

  const workerStats = workers.map(worker => {
    const workerBookings = bookings.filter(booking => booking.worker === worker.name);
    const revenue = workerBookings
      .filter(booking => booking.status === 'completada')
      .reduce((sum, booking) => sum + booking.price, 0);
    
    return {
      ...worker,
      bookingCount: workerBookings.length,
      revenue
    };
  }).sort((a, b) => b.revenue - a.revenue);

  const handleAddService = () => {
    // Simular agregar servicio
    addNotification({
      type: 'success',
      message: `Servicio "${newService.name}" agregado exitosamente`,
      timestamp: new Date()
    });
    setShowAddServiceModal(false);
    setNewService({ name: '', duration: 30, price: 0, category: 'Cabello' });
  };

  const handleAddWorker = () => {
    // Simular agregar trabajador
    addNotification({
      type: 'success',
      message: `Trabajador "${newWorker.name}" agregado exitosamente`,
      timestamp: new Date()
    });
    setShowAddWorkerModal(false);
    setNewWorker({ name: '', specialty: 'Cabello', schedule: '9:00-17:00', phone: '', email: '' });
  };

  const handleUpdateBookingStatus = (bookingId: number, newStatus: string) => {
    setBookings(prev => prev.map(booking => 
      booking.id === bookingId 
        ? { ...booking, status: newStatus }
        : booking
    ));
    
    addNotification({
      type: 'success',
      message: 'Estado de cita actualizado',
      timestamp: new Date()
    });
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('es-CO', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
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

  return (
    <div className="max-w-7xl mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl">Panel de Administración</h1>
          <p className="text-gray-600">Gestiona tu negocio y supervisa operaciones</p>
        </div>
        <div className="flex gap-3">
          <Button onClick={() => setShowAddServiceModal(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Nuevo Servicio
          </Button>
          <Button onClick={() => setShowAddWorkerModal(true)}>
            <UserPlus className="w-4 h-4 mr-2" />
            Nuevo Trabajador
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <DollarSign className="w-8 h-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold">${totalRevenue.toLocaleString()}</p>
                <p className="text-sm text-gray-600">Ingresos Totales</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Calendar className="w-8 h-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{monthlyBookings.length}</p>
                <p className="text-sm text-gray-600">Citas este Mes</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Users className="w-8 h-8 text-purple-600" />
              <div>
                <p className="text-2xl font-bold">{workers.length}</p>
                <p className="text-sm text-gray-600">Trabajadores</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-8 h-8 text-orange-600" />
              <div>
                <p className="text-2xl font-bold">{services.length}</p>
                <p className="text-sm text-gray-600">Servicios</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="bookings" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="bookings">Reservas</TabsTrigger>
          <TabsTrigger value="services">Servicios</TabsTrigger>
          <TabsTrigger value="workers">Trabajadores</TabsTrigger>
          <TabsTrigger value="reports">Reportes</TabsTrigger>
          <TabsTrigger value="settings">Configuración</TabsTrigger>
        </TabsList>

        <TabsContent value="bookings" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Pending Bookings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-yellow-600" />
                  Citas Pendientes ({pendingBookings.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {pendingBookings.map((booking) => (
                    <div key={booking.id} className="border rounded-lg p-3">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-semibold">{booking.service}</h4>
                          <p className="text-sm text-gray-600">{booking.clientName}</p>
                        </div>
                        <Badge className={getStatusColor(booking.status)}>
                          {booking.status}
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-600 mb-3">
                        <p>{formatDate(booking.date)} - {booking.time}</p>
                        <p>{booking.worker}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          onClick={() => handleUpdateBookingStatus(booking.id, 'confirmada')}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          Confirmar
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleUpdateBookingStatus(booking.id, 'cancelada')}
                          className="text-red-600"
                        >
                          Rechazar
                        </Button>
                      </div>
                    </div>
                  ))}
                  {pendingBookings.length === 0 && (
                    <p className="text-center text-gray-500 py-8">
                      No hay citas pendientes
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Recent Bookings */}
            <Card>
              <CardHeader>
                <CardTitle>Reservas Recientes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {bookings
                    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                    .slice(0, 10)
                    .map((booking) => (
                    <div key={booking.id} className="border rounded-lg p-3">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-semibold">{booking.service}</h4>
                          <p className="text-sm text-gray-600">{booking.clientName}</p>
                        </div>
                        <Badge className={getStatusColor(booking.status)}>
                          {booking.status}
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-600">
                        <p>{formatDate(booking.date)} - {booking.time}</p>
                        <p>{booking.worker}</p>
                        <p className="font-medium text-green-600">
                          ${booking.price.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="services" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Gestión de Servicios</CardTitle>
              <CardDescription>
                Administra los servicios disponibles en tu negocio
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {serviceStats.map((service) => (
                  <Card key={service.id} className="relative">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold">{service.name}</h4>
                        <div className="flex gap-1">
                          <Button size="sm" variant="ghost" onClick={() => setEditingService(service)}>
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="ghost" className="text-red-600">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      <Badge variant="secondary" className="mb-2">{service.category}</Badge>
                      <div className="space-y-1 text-sm">
                        <p><span className="font-medium">Duración:</span> {service.duration} min</p>
                        <p><span className="font-medium">Precio:</span> ${service.price.toLocaleString()}</p>
                        <p><span className="font-medium">Reservas:</span> {service.bookingCount}</p>
                        <p><span className="font-medium">Ingresos:</span> ${service.revenue.toLocaleString()}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="workers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Gestión de Trabajadores</CardTitle>
              <CardDescription>
                Administra tu equipo de trabajo
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {workerStats.map((worker) => (
                  <Card key={worker.id}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-pink-600 rounded-full flex items-center justify-center text-white font-semibold">
                            {worker.avatar}
                          </div>
                          <div>
                            <h4 className="font-semibold">{worker.name}</h4>
                            <Badge variant="secondary">{worker.specialty}</Badge>
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <Button size="sm" variant="ghost" onClick={() => setEditingWorker(worker)}>
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="ghost" className="text-red-600">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="space-y-1 text-sm">
                        <p><span className="font-medium">Horario:</span> {worker.schedule}</p>
                        <p><span className="font-medium">Citas:</span> {worker.bookingCount}</p>
                        <p><span className="font-medium">Ingresos:</span> ${worker.revenue.toLocaleString()}</p>
                      </div>
                      <div className="flex gap-2 mt-3">
                        <Button size="sm" variant="outline">
                          <MessageSquare className="w-4 h-4 mr-1" />
                          Contactar
                        </Button>
                        <Button size="sm" variant="outline">
                          <Calendar className="w-4 h-4 mr-1" />
                          Agenda
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Servicios Más Populares
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {serviceStats.slice(0, 5).map((service, index) => (
                    <div key={service.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 bg-pink-600 text-white rounded-full flex items-center justify-center text-sm">
                          {index + 1}
                        </span>
                        <span className="font-medium">{service.name}</span>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{service.bookingCount} reservas</p>
                        <p className="text-sm text-gray-600">${service.revenue.toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="w-5 h-5" />
                  Mejores Trabajadores
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {workerStats.slice(0, 4).map((worker, index) => (
                    <div key={worker.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 bg-pink-600 text-white rounded-full flex items-center justify-center text-sm">
                          {index + 1}
                        </span>
                        <div>
                          <span className="font-medium">{worker.name}</span>
                          <p className="text-sm text-gray-600">{worker.specialty}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">${worker.revenue.toLocaleString()}</p>
                        <p className="text-sm text-gray-600">{worker.bookingCount} citas</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Resumen Financiero</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between py-2 border-b">
                  <span>Ingresos Totales:</span>
                  <span className="font-bold text-green-600">${totalRevenue.toLocaleString()}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span>Citas Completadas:</span>
                  <span className="font-semibold">{completedBookings.length}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span>Promedio por Cita:</span>
                  <span className="font-semibold">
                    ${Math.round(totalRevenue / Math.max(completedBookings.length, 1)).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between py-2">
                  <span>Citas este Mes:</span>
                  <span className="font-semibold">{monthlyBookings.length}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Clientes Frecuentes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(
                    bookings.reduce((acc: any, booking) => {
                      acc[booking.clientName] = (acc[booking.clientName] || 0) + 1;
                      return acc;
                    }, {})
                  ).sort(([,a], [,b]) => (b as number) - (a as number)).slice(0, 5).map(([client, count], index) => (
                    <div key={client} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 bg-pink-600 text-white rounded-full flex items-center justify-center text-sm">
                          {index + 1}
                        </span>
                        <span className="font-medium">{client}</span>
                      </div>
                      <Badge variant="secondary">{count} citas</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Configuración del Negocio</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="business-name">Nombre del Negocio</Label>
                  <Input id="business-name" defaultValue="Bella Vista Salon" />
                </div>
                <div>
                  <Label htmlFor="business-phone">Teléfono</Label>
                  <Input id="business-phone" defaultValue="+57 (1) 234-5678" />
                </div>
                <div>
                  <Label htmlFor="business-address">Dirección</Label>
                  <Input id="business-address" defaultValue="Calle 123 #45-67, Bogotá" />
                </div>
                <div>
                  <Label htmlFor="business-hours">Horarios de Atención</Label>
                  <Input id="business-hours" defaultValue="Lun-Sáb: 8:00 AM - 8:00 PM" />
                </div>
                <Button>Guardar Cambios</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Configuración de Notificaciones</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="email-notifications">Notificaciones por Email</Label>
                  <input type="checkbox" id="email-notifications" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="sms-notifications">Notificaciones por SMS</Label>
                  <input type="checkbox" id="sms-notifications" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="whatsapp-notifications">Notificaciones por WhatsApp</Label>
                  <input type="checkbox" id="whatsapp-notifications" defaultChecked />
                </div>
                <div>
                  <Label htmlFor="reminder-time">Tiempo de Recordatorio</Label>
                  <Select defaultValue="24">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 hora antes</SelectItem>
                      <SelectItem value="24">24 horas antes</SelectItem>
                      <SelectItem value="48">48 horas antes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button>Guardar Configuración</Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Add Service Modal */}
      <Dialog open={showAddServiceModal} onOpenChange={setShowAddServiceModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Agregar Nuevo Servicio</DialogTitle>
            <DialogDescription>
              Completa la información del nuevo servicio
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="service-name">Nombre del Servicio</Label>
              <Input
                id="service-name"
                value={newService.name}
                onChange={(e) => setNewService({...newService, name: e.target.value})}
                placeholder="Ej: Corte de Cabello"
              />
            </div>
            <div>
              <Label htmlFor="service-category">Categoría</Label>
              <Select value={newService.category} onValueChange={(value) => setNewService({...newService, category: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Cabello">Cabello</SelectItem>
                  <SelectItem value="Uñas">Uñas</SelectItem>
                  <SelectItem value="Facial">Facial</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="service-duration">Duración (minutos)</Label>
              <Input
                id="service-duration"
                type="number"
                value={newService.duration}
                onChange={(e) => setNewService({...newService, duration: parseInt(e.target.value)})}
              />
            </div>
            <div>
              <Label htmlFor="service-price">Precio</Label>
              <Input
                id="service-price"
                type="number"
                value={newService.price}
                onChange={(e) => setNewService({...newService, price: parseInt(e.target.value)})}
              />
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setShowAddServiceModal(false)}>
                Cancelar
              </Button>
              <Button onClick={handleAddService}>
                Agregar Servicio
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Worker Modal */}
      <Dialog open={showAddWorkerModal} onOpenChange={setShowAddWorkerModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Agregar Nuevo Trabajador</DialogTitle>
            <DialogDescription>
              Completa la información del nuevo miembro del equipo
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="worker-name">Nombre Completo</Label>
              <Input
                id="worker-name"
                value={newWorker.name}
                onChange={(e) => setNewWorker({...newWorker, name: e.target.value})}
                placeholder="Nombre del trabajador"
              />
            </div>
            <div>
              <Label htmlFor="worker-specialty">Especialidad</Label>
              <Select value={newWorker.specialty} onValueChange={(value) => setNewWorker({...newWorker, specialty: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Cabello">Cabello</SelectItem>
                  <SelectItem value="Uñas">Uñas</SelectItem>
                  <SelectItem value="Facial">Facial</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="worker-schedule">Horario</Label>
              <Input
                id="worker-schedule"
                value={newWorker.schedule}
                onChange={(e) => setNewWorker({...newWorker, schedule: e.target.value})}
                placeholder="Ej: 9:00-17:00"
              />
            </div>
            <div>
              <Label htmlFor="worker-phone">Teléfono</Label>
              <Input
                id="worker-phone"
                value={newWorker.phone}
                onChange={(e) => setNewWorker({...newWorker, phone: e.target.value})}
                placeholder="+57 300 123 4567"
              />
            </div>
            <div>
              <Label htmlFor="worker-email">Email</Label>
              <Input
                id="worker-email"
                type="email"
                value={newWorker.email}
                onChange={(e) => setNewWorker({...newWorker, email: e.target.value})}
                placeholder="trabajador@email.com"
              />
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setShowAddWorkerModal(false)}>
                Cancelar
              </Button>
              <Button onClick={handleAddWorker}>
                Agregar Trabajador
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};