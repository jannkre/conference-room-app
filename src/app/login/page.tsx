"use client"
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/lib/userStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function LoginPage() 
{
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [emailError, setEmailError] = useState('');
  
  const router = useRouter();
  const { setUser } = useUserStore();

  // Email validation
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Password strength calculation
  const getPasswordStrength = (password: string): string => {
    if (password.length === 0) return '';
    if (password.length < 6) return 'Schwach';
    if (password.length < 10) return 'Mittel';
    return 'Stark';
  };

  const passwordStrength = getPasswordStrength(password);
  const passwordStrengthColor = 
    passwordStrength === 'Schwach' ? 'text-red-600' :
    passwordStrength === 'Mittel' ? 'text-yellow-600' : 
    'text-green-600';

  // Validate email on blur
  const handleEmailBlur = () => {
    if (email && !validateEmail(email)) {
      setEmailError('Bitte geben Sie eine gültige E-Mail-Adresse ein');
    } else {
      setEmailError('');
    }
  };

  // Check if form is valid
  const isFormValid = email.trim() !== '' && password.trim() !== '' && !emailError;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    // Final validation
    if (!validateEmail(email)) {
      setEmailError('Bitte geben Sie eine gültige E-Mail-Adresse ein');
      return;
    }

    setIsLoading(true);

    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
    
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Etwas ist schief gelaufen');
        setIsLoading(false);
        return;
      }

      // Show success message
      setSuccess(isLogin ? 'Erfolgreich angemeldet!' : 'Erfolgreich registriert!');
      
      // Set user in store and navigate to home after brief delay
      setUser(data);
      setTimeout(() => {
        router.push('/');
      }, 500);
    } catch (err) {
      setError('Netzwerkfehler. Bitte versuchen Sie es erneut.');
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError('');
    setSuccess('');
    setEmail('');
    setPassword('');
    setEmailError('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md" data-testid="login-card">
        <CardHeader>
          <CardTitle data-testid="form-title">{isLogin ? 'Anmelden' : 'Registrieren'}</CardTitle>
          <CardDescription>
            {isLogin 
              ? 'Geben Sie Ihre Anmeldedaten ein' 
              : 'Erstellen Sie ein neues Konto'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4" data-testid="auth-form">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                E-Mail
              </label>
              <Input
                id="email"
                type="email"
                placeholder="sie@beispiel.de"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={handleEmailBlur}
                required
                data-testid="email-input"
              />
              {emailError && (
                <div className="text-sm text-red-600" data-testid="email-error">
                  {emailError}
                </div>
              )}
            </div>
            
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                Passwort
              </label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                data-testid="password-input"
              />
              
              {/* Password length counter */}
              {password.length > 0 && (
                <div className="text-xs text-gray-500" data-testid="password-length">
                  Länge: {password.length} Zeichen
                </div>
              )}
              
              {/* Password strength indicator - only in register mode */}
              {!isLogin && password.length > 0 && (
                <div className="text-sm" data-testid="password-strength">
                  Passwortstärke: <span className={passwordStrengthColor}>{passwordStrength}</span>
                </div>
              )}
            </div>

            {error && (
              <div className="text-sm text-red-600 bg-red-50 p-2 rounded" data-testid="error-message">
                {error}
              </div>
            )}

            {success && (
              <div className="text-sm text-green-600 bg-green-50 p-2 rounded" data-testid="success-message">
                {success}
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full"
              disabled={isLoading || !isFormValid}
              data-testid="submit-button"
            >
              {isLoading ? 'Lädt...' : (isLogin ? 'Anmelden' : 'Registrieren')}
            </Button>
          </form>

          <div className="mt-4 text-center">
            <button
              onClick={toggleMode}
              className="text-sm text-blue-600 hover:underline"
              data-testid="toggle-mode-button"
            >
              {isLogin 
                ? "Haben Sie noch kein Konto? Registrieren" 
                : 'Haben Sie bereits ein Konto? Anmelden'}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

