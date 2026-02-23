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
import { Checkbox } from '@/components/ui/checkbox';
import { AlertTriangle, Shield, User } from 'lucide-react';

interface AgeVerificationDialogProps {
  open: boolean;
  onVerify: () => void;
}

export function AgeVerificationDialog({ open, onVerify }: AgeVerificationDialogProps) {
  const [nombre, setNombre] = useState('');
  const [isAdult, setIsAdult] = useState(false);
  const [error, setError] = useState('');

  const handleVerify = () => {
    if (!nombre.trim()) {
      setError('Por favor ingresa tu nombre');
      return;
    }
    if (!isAdult) {
      setError('Debes confirmar que eres mayor de 18 años');
      return;
    }
    setError('');
    onVerify();
  };

  return (
    <Dialog open={open} modal>
      <DialogContent 
        className="sm:max-w-md bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 border-purple-500/30 text-white"
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-600 rounded-full flex items-center justify-center mb-4 shadow-lg shadow-orange-500/30">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <DialogTitle className="text-2xl font-bold text-center bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-300 bg-clip-text text-transparent">
            Verificación de Edad
          </DialogTitle>
          <DialogDescription className="text-gray-300 text-center">
            Este sitio está destinado exclusivamente para mayores de edad
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Advertencia */}
          <div className="bg-red-500/20 border border-red-500/40 rounded-lg p-4 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-red-200">
              <p className="font-semibold mb-1">Advertencia Importante</p>
              <p>La participación en rifas y juegos de azar puede generar adicción. Juega responsablemente.</p>
            </div>
          </div>

          {/* Campo de nombre */}
          <div className="space-y-2">
            <Label htmlFor="nombre" className="text-gray-200 flex items-center gap-2">
              <User className="w-4 h-4" />
              Tu Nombre
            </Label>
            <Input
              id="nombre"
              placeholder="Ingresa tu nombre completo"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-amber-400 focus:ring-amber-400/20"
            />
          </div>

          {/* Checkbox de mayor de edad */}
          <div className="flex items-start space-x-3">
            <Checkbox
              id="adult"
              checked={isAdult}
              onCheckedChange={(checked) => setIsAdult(checked as boolean)}
              className="mt-1 border-amber-400/50 data-[state=checked]:bg-amber-500 data-[state=checked]:border-amber-500"
            />
            <Label
              htmlFor="adult"
              className="text-sm text-gray-300 leading-relaxed cursor-pointer"
            >
              Confirmo que soy mayor de 18 años y acepto los términos y condiciones de participación en esta rifa
            </Label>
          </div>

          {/* Error */}
          {error && (
            <div className="text-red-400 text-sm text-center bg-red-500/10 rounded-lg py-2">
              {error}
            </div>
          )}

          {/* Botón */}
          <Button
            onClick={handleVerify}
            className="w-full bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-500 hover:from-amber-400 hover:via-yellow-400 hover:to-amber-400 text-slate-900 font-bold py-6 text-lg shadow-lg shadow-amber-500/30 transition-all duration-300 hover:scale-[1.02]"
          >
            <Shield className="w-5 h-5 mr-2" />
            Soy Mayor de 18 Años
          </Button>

          <p className="text-xs text-center text-gray-400">
            Al continuar, confirmas que has leído y aceptado nuestras políticas de privacidad y términos de servicio
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
