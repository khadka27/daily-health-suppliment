'use client';

import { Provider } from 'react-redux';
import { store } from '@/store';
import { useRef } from 'react';

export default function ReduxProvider({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  // Use a ref to ensure the store is only created once
  const storeRef = useRef(store);
  
  return <Provider store={storeRef.current}>{children}</Provider>;
}