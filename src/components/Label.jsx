import React from 'react';
import { typeLabel } from '../constants/theme';

export default function Label({ children }) {
  return (
    <div style={typeLabel}>
      {children}
    </div>
  );
}
