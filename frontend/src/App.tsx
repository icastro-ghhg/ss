import React, { useState, createContext, useContext } from 'react';
import { Calendar, User, Settings, BarChart3, Menu, X, Clock, MapPin, Phone, Instagram, MessageCircle } from 'lucide-react';
import { Button } from './components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { Badge } from './components/ui/badge';
import { ClientDashboard } from './components/ClientDashboard';
import { WorkerDashboard } from './components/WorkerDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { BookingCalendar } from './components/BookingCalendar';
import { AuthModal } from './components/AuthModal';
import { ImageWithFallback } from './components/figma/ImageWithFallback';

// Context para el estado global de la aplicación
const AppContext = createContext<any>(null);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
};

// Datos simulados
const mockServices = [
  { id: 1, name: 'Corte de Cabello', duration: 30, price: 25000, category: 'Cabello' },
  { id: 2, name: 'Coloración', duration: 90, price: 45000, category: 'Cabello' },
  { id: 3, name: 'Tratamiento Capilar', duration: 45, price: 35000, category: 'Cabello' },
  { id: 4, name: 'Manicure Clásica', duration: 45, price: 20000, category: 'Uñas' },
  { id: 5, name: 'Uñas Acrílicas', duration: 90, price: 40000, category: 'Uñas' },
  { id: 6, name: 'Nail Art', duration: 60, price: 30000, category: 'Uñas' },
  { id: 7, name: 'Facial Básico', duration: 60, price: 35000, category: 'Facial' },
  { id: 8, name: 'Limpieza Profunda', duration: 90, price: 50000, category: 'Facial' },
];

const mockWorkers = [
  { id: 1, name: 'Ana García', specialty: 'Cabello', avatar: 'AG', schedule: '9:00-17:00' },
  { id: 2, name: 'María López', specialty: 'Uñas', avatar: 'ML', schedule: '10:00-18:00' },
  { id: 3, name: 'Carmen Ruiz', specialty: 'Facial', avatar: 'CR', schedule: '8:00-16:00' },
  { id: 4, name: 'Sofia Morales', specialty: 'Cabello', avatar: 'SM', schedule: '12:00-20:00' },
];

const mockBookings = [
  {
    id: 1,
    clientName: 'Laura Martínez',
    clientEmail: 'laura@email.com',
    service: 'Corte de Cabello',
    worker: 'Ana García',
    date: '2025-10-09',
    time: '10:00',
    status: 'confirmada',
    duration: 30,
    price: 25000
  },
  {
    id: 2,
    clientName: 'Camila Rodriguez',
    clientEmail: 'camila@email.com',
    service: 'Manicure Clásica',
    worker: 'María López',
    date: '2025-10-09',
    time: '14:00',
    status: 'confirmada',
    duration: 45,
    price: 20000
  },
  {
    id: 3,
    clientName: 'Valentina Silva',
    clientEmail: 'valentina@email.com',
    service: 'Coloración',
    worker: 'Ana García',
    date: '2025-10-10',
    time: '11:00',
    status: 'pendiente',
    duration: 90,
    price: 45000
  },
];

function App() {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [userRole, setUserRole] = useState<'client' | 'worker' | 'admin' | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [activeView, setActiveView] = useState('home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [services] = useState(mockServices);
  const [workers] = useState(mockWorkers);
  const [bookings, setBookings] = useState(mockBookings);
  const [notifications, setNotifications] = useState<any[]>([]);

  const addNotification = (notification: any) => {
    setNotifications(prev => [...prev, { ...notification, id: Date.now() }]);
  };

  const contextValue = {
    currentUser,
    setCurrentUser,
    userRole,
    setUserRole,
    services,
    workers,
    bookings,
    setBookings,
    notifications,
    addNotification,
    activeView,
    setActiveView
  };

  const handleLogin = (email: string, password: string, role: 'client' | 'worker' | 'admin') => {
    // Simulación de login
    const user = {
      id: 1,
      email,
      name: role === 'client' ? 'Cliente Ejemplo' : role === 'worker' ? 'Ana García' : 'Administrador',
      role
    };
    setCurrentUser(user);
    setUserRole(role);
    setShowAuthModal(false);
    addNotification({
      type: 'success',
      message: `Bienvenido ${user.name}`,
      timestamp: new Date()
    });
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setUserRole(null);
    setActiveView('home');
    setIsMobileMenuOpen(false);
  };

  const renderMainContent = () => {
    if (activeView === 'booking' && currentUser) {
      return <BookingCalendar />;
    }

    if (currentUser && userRole === 'client') {
      return <ClientDashboard />;
    }

    if (currentUser && userRole === 'worker') {
      return <WorkerDashboard />;
    }

    if (currentUser && userRole === 'admin') {
      return <AdminDashboard />;
    }

    // Vista pública (sin login)
    return (
      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="relative h-screen flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1626383137804-ff908d2753a2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZWF1dHklMjBzYWxvbiUyMGludGVyaW9yfGVufDF8fHx8MTc1OTgzNzg3OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
              alt="Beauty Salon Interior"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/60"></div>
          </div>
          
          <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl mb-6">Bella Vista Salon</h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90">
              Tu belleza es nuestra pasión. Reserva tu cita en línea y disfruta de la mejor experiencia.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                onClick={() => setShowAuthModal(true)}
                className="bg-pink-600 hover:bg-pink-700 text-white px-8 py-4"
              >
                Reservar Cita
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                onClick={() => setActiveView('services')}
                className="border-white text-[rgba(39,24,24,1)] hover:bg-white hover:text-black px-8 py-4"
              >
                Ver Servicios
              </Button>
            </div>
          </div>
        </section>

        {/* Services Section */}
        {activeView === 'services' && (
          <section className="py-16 px-4 bg-gray-50">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl mb-4">Nuestros Servicios</h2>
                <p className="text-xl text-gray-600">Descubre todos los tratamientos que tenemos para ti</p>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                {['Cabello', 'Uñas', 'Facial'].map((category) => (
                  <Card key={category} className="overflow-hidden">
                    <CardHeader>
                      <CardTitle className="text-center">{category}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {services.filter(service => service.category === category).map((service) => (
                          <div key={service.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                            <div>
                              <p className="font-medium">{service.name}</p>
                              <p className="text-sm text-gray-600">{service.duration} min</p>
                            </div>
                            <span className="font-semibold text-pink-600">
                              ${service.price.toLocaleString()}
                            </span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="text-center mt-12">
                <Button 
                  size="lg" 
                  onClick={() => setShowAuthModal(true)}
                  className="bg-pink-600 hover:bg-pink-700 text-white"
                >
                  Reservar Ahora
                </Button>
              </div>
            </div>
          </section>
        )}

        {/* Team Section */}
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl mb-4">Nuestro Equipo</h2>
              <p className="text-xl text-gray-600">Profesionales expertos a tu servicio</p>
            </div>

            <div className="grid md:grid-cols-4 gap-6">
              {workers.map((worker) => (
                <Card key={worker.id} className="text-center">
                  <CardContent className="pt-6">
                    <div className="w-20 h-20 bg-pink-600 rounded-full flex items-center justify-center text-white text-xl mx-auto mb-4">
                      {worker.avatar}
                    </div>
                    <h3 className="font-semibold mb-2">{worker.name}</h3>
                    <Badge variant="secondary" className="mb-2">{worker.specialty}</Badge>
                    <p className="text-sm text-gray-600">{worker.schedule}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-16 px-4 bg-gray-900 text-white">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl mb-4">Contáctanos</h2>
              <p className="text-xl opacity-90">Estamos aquí para atenderte</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <MapPin className="w-12 h-12 mx-auto mb-4 text-pink-400" />
                <h3 className="text-xl mb-2">Ubicación</h3>
                <p className="opacity-80">Calle 123 #45-67<br />Bogotá, Colombia</p>
              </div>

              <div className="text-center">
                <Phone className="w-12 h-12 mx-auto mb-4 text-pink-400" />
                <h3 className="text-xl mb-2">Teléfono</h3>
                <p className="opacity-80">+57 (1) 234-5678<br />WhatsApp: +57 300 123 4567</p>
              </div>

              <div className="text-center">
                <Clock className="w-12 h-12 mx-auto mb-4 text-pink-400" />
                <h3 className="text-xl mb-2">Horarios</h3>
                <p className="opacity-80">Lun-Sáb: 8:00 AM - 8:00 PM<br />Dom: 10:00 AM - 6:00 PM</p>
              </div>
            </div>

            <div className="flex justify-center gap-6 mt-12">
              <Button variant="outline" size="lg" className="border-pink-400 text-pink-400 hover:bg-pink-400 hover:text-white">
                <Instagram className="w-5 h-5 mr-2" />
                Instagram
              </Button>
              <Button variant="outline" size="lg" className="border-pink-400 text-pink-400 hover:bg-pink-400 hover:text-white">
                <MessageCircle className="w-5 h-5 mr-2" />
                WhatsApp
              </Button>
            </div>
          </div>
        </section>
      </div>
    );
  };

  return (
    <AppContext.Provider value={contextValue}>
      <div className="min-h-screen bg-white">
        {/* Header */}
        <header className="bg-white shadow-sm border-b sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <h1 
                  className="text-2xl font-bold text-pink-600 cursor-pointer"
                  onClick={() => setActiveView('home')}
                >
                  Bella Vista
                </h1>
              </div>

              {/* Desktop Navigation */}
              <nav className="hidden md:flex space-x-6">
                <Button 
                  variant="ghost" 
                  onClick={() => setActiveView('home')}
                  className={activeView === 'home' ? 'text-pink-600' : ''}
                >
                  Inicio
                </Button>
                <Button 
                  variant="ghost" 
                  onClick={() => setActiveView('services')}
                  className={activeView === 'services' ? 'text-pink-600' : ''}
                >
                  Servicios
                </Button>
                {currentUser && (
                  <Button 
                    variant="ghost" 
                    onClick={() => setActiveView('booking')}
                    className={activeView === 'booking' ? 'text-pink-600' : ''}
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    Reservar
                  </Button>
                )}
              </nav>

              {/* User Actions */}
              <div className="hidden md:flex items-center space-x-4">
                {currentUser ? (
                  <div className="flex items-center space-x-4">
                    <span className="text-sm">Hola, {currentUser.name}</span>
                    <Button variant="outline" onClick={handleLogout}>
                      Cerrar Sesión
                    </Button>
                  </div>
                ) : (
                  <Button onClick={() => setShowAuthModal(true)}>
                    <User className="w-4 h-4 mr-2" />
                    Ingresar
                  </Button>
                )}
              </div>

              {/* Mobile Menu Button */}
              <div className="md:hidden">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                  {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </Button>
              </div>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMobileMenuOpen && (
            <div className="md:hidden border-t bg-white">
              <div className="px-4 py-4 space-y-2">
                <Button 
                  variant="ghost" 
                  className="w-full justify-start"
                  onClick={() => {
                    setActiveView('home');
                    setIsMobileMenuOpen(false);
                  }}
                >
                  Inicio
                </Button>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start"
                  onClick={() => {
                    setActiveView('services');
                    setIsMobileMenuOpen(false);
                  }}
                >
                  Servicios
                </Button>
                {currentUser && (
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start"
                    onClick={() => {
                      setActiveView('booking');
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    Reservar
                  </Button>
                )}
                {currentUser ? (
                  <div className="border-t pt-2">
                    <p className="text-sm text-gray-600 px-4 py-2">Hola, {currentUser.name}</p>
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start text-red-600"
                      onClick={handleLogout}
                    >
                      Cerrar Sesión
                    </Button>
                  </div>
                ) : (
                  <Button 
                    className="w-full"
                    onClick={() => {
                      setShowAuthModal(true);
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    <User className="w-4 h-4 mr-2" />
                    Ingresar
                  </Button>
                )}
              </div>
            </div>
          )}
        </header>

        {/* Main Content */}
        <main>
          {renderMainContent()}
        </main>

        {/* Auth Modal */}
        {showAuthModal && (
          <AuthModal
            onClose={() => setShowAuthModal(false)}
            onLogin={handleLogin}
          />
        )}
      </div>
    </AppContext.Provider>
  );
}

export default App;