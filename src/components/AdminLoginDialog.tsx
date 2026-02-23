import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Shield, Lock, User, AlertCircle } from 'lucide-react';

interface AdminLoginDialogProps {
  open: boolean;
  onClose: () => void;
  onLogin: (username: string, password: string) => boolean;
}

export function AdminLoginDialog({ open, onClose, onLogin }: AdminLoginDialogProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!username.trim() || !password.trim()) {
      setError('Ingresa usuario y contraseña');
      return;
    }

    setIsLoading(true);
    
    const success = onLogin(username, password);
    
    if (success) {
      setUsername('');
      setPassword('');
      onClose();
    } else {
      setError('Usuario o contraseña incorrectos');
    }
    
    setIsLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 border-purple-500/30 text-white">
        <DialogHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-purple-500 to-violet-600 rounded-full flex items-center justify-center mb-4 shadow-lg shadow-purple-500/30">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <DialogTitle className="text-2xl font-bold text-center text-white">
            Acceso Administrador
          </DialogTitle>
          <DialogDescription className="text-gray-400 text-center">
            Ingresa tus credenciales para acceder al panel de administración
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="username" className="text-gray-300 flex items-center gap-2">
              <User className="w-4 h-4" />
              Usuario
            </Label>
            <Input
              id="username"
              type="text"
              placeholder="admin"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="bg-white/10 border-white/20 text-white placeholder:text-gray-500 focus:border-purple-400 focus:ring-purple-400/20"
              autoComplete="off"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-gray-300 flex items-center gap-2">
              <Lock className="w-4 h-4" />
              Contraseña
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-white/10 border-white/20 text-white placeholder:text-gray-500 focus:border-purple-400 focus:ring-purple-400/20"
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 rounded-lg p-3">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-purple-500 to-violet-600 hover:from-purple-400 hover:to-violet-500 text-white font-bold py-6"
          >
            <Shield className="w-5 h-5 mr-2" />
            {isLoading ? 'Verificando...' : 'Ingresar'}
          </Button>

          <p className="text-xs text-center text-gray-500">
            Credenciales por defecto: admin / rifa2025
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
}
