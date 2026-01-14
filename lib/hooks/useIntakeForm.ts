'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { intakeFormSchema, type IntakeFormData } from '@/lib/validation/intakeSchema';

const STORAGE_KEY = 'intake:v1';

const defaultValues: IntakeFormData = {
  name: '',
  furigana: '',
  dob: '',
  sex: '回答しない',
  phone: '',
  email: '',
  prefecture: '',
  city: '',
  chiefComplaint: '',
  onset: '日',
  painScale: 0,
  aggravatingFactors: [],
  relievingFactors: '',
  previousTreatments: '',
  medicalHistory: '',
  injuries: '',
  medications: '',
  allergies: '',
  surgeries: '',
  sleepHours: 7,
  stressLevel: 5,
  exerciseFreq: 'ほぼなし',
  deskHours: 8,
  waterIntake: 1.5,
  smoking: false,
  alcohol: 'なし',
  goal: '',
  consent: false,
};

export function useIntakeForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoaded, setIsLoaded] = useState(false);

  const form = useForm<IntakeFormData>({
    resolver: zodResolver(intakeFormSchema),
    defaultValues,
    mode: 'onChange',
  });

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const data = JSON.parse(saved);
        form.reset(data);
      }
    } catch (error) {
      console.error('Failed to load saved form data:', error);
    } finally {
      setIsLoaded(true);
    }
  }, [form]);

  // Auto-save to localStorage
  useEffect(() => {
    if (!isLoaded) return;

    const subscription = form.watch((data) => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      } catch (error) {
        console.error('Failed to save form data:', error);
      }
    });

    return () => subscription.unsubscribe();
  }, [form, isLoaded]);

  const clearStorage = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Failed to clear form data:', error);
    }
  };

  const nextStep = () => {
    setCurrentStep((prev) => Math.min(prev + 1, 5));
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const goToStep = (step: number) => {
    setCurrentStep(Math.max(1, Math.min(step, 5)));
  };

  return {
    form,
    currentStep,
    isLoaded,
    nextStep,
    prevStep,
    goToStep,
    clearStorage,
  };
}