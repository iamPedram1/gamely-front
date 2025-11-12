import { useState } from 'react';

// Components
import VerifyForm from '@/components/auth/VerifyForm';
import RegisterForm from '@/components/auth/RegisterForm';

interface RegisterProps {
  onBackToLogin: () => void;
}

export default function Register(props: RegisterProps) {
  // Props
  const { onBackToLogin } = props;

  // States
  const [step, setStep] = useState<'form' | 'verification'>('form');
  const [email, setEmail] = useState<string>('');

  // Utilities
  const handleBackToRegister = () => {
    setEmail('');
    setStep('form');
  };

  const handleNext = (email: string) => {
    setEmail(email);
    setStep('verification');
  };

  // Render
  return step === 'form' ? (
    <RegisterForm onNext={handleNext} />
  ) : (
    <VerifyForm
      email={email}
      onBackToLogin={onBackToLogin}
      onBackToRegister={handleBackToRegister}
    />
  );
}
