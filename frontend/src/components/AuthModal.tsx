import React, { useState } from 'react';
import { X, Eye, EyeOff } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

interface AuthModalProps {
  onClose: () => void;
  onLogin: (email: string, password: string, role: 'client' | 'worker' | 'admin') => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ onClose, onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<'client' | 'worker' | 'admin'>('client');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulación de procesamiento
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (!isLogin && password !== confirmPassword) {
      alert('Las contraseñas no coinciden');
      setLoading(false);
      return;
    }

    onLogin(email, password, role);
    setLoading(false);
  };

  const demoAccounts = [
    { type: 'cliente', email: 'cliente@demo.com', password: 'demo123', role: 'client' as const },
    { type: 'trabajador', email: 'trabajador@demo.com', password: 'demo123', role: 'worker' as const },
    { type: 'administrador', email: 'admin@demo.com', password: 'demo123', role: 'admin' as const }
  ];

  const handleDemoLogin = (account: typeof demoAccounts[0]) => {
    onLogin(account.email, account.password, account.role);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-md relative max-h-[90vh] overflow-y-auto">
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="absolute right-2 top-2 z-10"
        >
          <X className="w-4 h-4" />
        </Button>

        <div className="p-6">
          <Tabs value={isLogin ? 'login' : 'register'} onValueChange={(value) => setIsLogin(value === 'login')}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Iniciar Sesión</TabsTrigger>
              <TabsTrigger value="register">Registrarse</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <Card>
                <CardHeader>
                  <CardTitle>Iniciar Sesión</CardTitle>
                  <CardDescription>
                    Ingresa tus credenciales para acceder a tu cuenta
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Correo Electrónico</Label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder="tu@email.com"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="password">Contraseña</Label>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? 'text' : 'password'}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          placeholder="••••••••"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-2 top-1/2 -translate-y-1/2"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="role">Tipo de Usuario</Label>
                      <Select value={role} onValueChange={(value: 'client' | 'worker' | 'admin') => setRole(value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="client">Cliente</SelectItem>
                          <SelectItem value="worker">Trabajador</SelectItem>
                          <SelectItem value="admin">Administrador</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading ? 'Ingresando...' : 'Iniciar Sesión'}
                    </Button>
                  </form>

                  {/* Demo Accounts */}
                  <div className="mt-6 pt-6 border-t">
                    <p className="text-sm text-gray-600 mb-3">Cuentas de demostración:</p>
                    <div className="space-y-2">
                      {demoAccounts.map((account) => (
                        <Button
                          key={account.type}
                          variant="outline"
                          size="sm"
                          className="w-full justify-start text-xs"
                          onClick={() => handleDemoLogin(account)}
                        >
                          <span className="capitalize mr-2">{account.type}:</span>
                          <span className="text-gray-500">{account.email}</span>
                        </Button>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="register">
              <Card>
                <CardHeader>
                  <CardTitle>Crear Cuenta</CardTitle>
                  <CardDescription>
                    Regístrate para comenzar a reservar tus citas
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nombre Completo</Label>
                      <Input
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        placeholder="Tu nombre completo"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="register-email">Correo Electrónico</Label>
                      <Input
                        id="register-email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder="tu@email.com"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Teléfono</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                        placeholder="+57 300 123 4567"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="register-password">Contraseña</Label>
                      <div className="relative">
                        <Input
                          id="register-password"
                          type={showPassword ? 'text' : 'password'}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          placeholder="••••••••"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-2 top-1/2 -translate-y-1/2"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirmar Contraseña</Label>
                      <Input
                        id="confirm-password"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        placeholder="••••••••"
                      />
                    </div>

                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading ? 'Creando cuenta...' : 'Crear Cuenta'}
                    </Button>
                  </form>

                  <p className="text-xs text-gray-600 mt-4">
                    Al registrarte, aceptas nuestros términos de servicio y política de privacidad.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};