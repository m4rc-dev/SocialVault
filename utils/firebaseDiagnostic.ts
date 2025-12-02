// Utility to help diagnose Firebase configuration issues
export const diagnoseFirebaseConfig = () => {
  // List of required environment variables
  const requiredEnvVars = [
    'VITE_FIREBASE_API_KEY',
    'VITE_FIREBASE_AUTH_DOMAIN',
    'VITE_FIREBASE_PROJECT_ID',
    'VITE_FIREBASE_STORAGE_BUCKET',
    'VITE_FIREBASE_MESSAGING_SENDER_ID',
    'VITE_FIREBASE_APP_ID'
  ];

  // Check which variables are missing
  const missingVars = requiredEnvVars.filter(varName => {
    // @ts-ignore
    return !import.meta.env[varName];
  });

  // Get the actual config values
  const config = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
  };

  // Check if we have any values at all
  const hasAnyValues = Object.values(config).some(value => value !== undefined && value !== '');

  return {
    missingVars,
    config,
    isComplete: missingVars.length === 0,
    hasAnyValues,
    hasApiKey: !!import.meta.env.VITE_FIREBASE_API_KEY
  };
};

// Utility to get a formatted report of the environment configuration
export const getFirebaseConfigReport = () => {
  const diagnosis = diagnoseFirebaseConfig();
  
  let report = '\n=== Firebase Configuration Report ===\n';
  
  if (diagnosis.hasAnyValues) {
    report += 'Environment variables detected:\n';
    Object.entries(diagnosis.config).forEach(([key, value]) => {
      const displayValue = value ? 
        `${value.substring(0, 10)}${value.length > 10 ? '...' : ''}` : 
        'NOT SET';
      report += `  ${key}: ${displayValue}\n`;
    });
  } else {
    report += 'No Firebase environment variables detected.\n';
  }
  
  if (diagnosis.missingVars.length > 0) {
    report += `\nMissing required variables:\n`;
    diagnosis.missingVars.forEach(varName => {
      report += `  - ${varName}\n`;
    });
    report += '\nThese variables must be set in your deployment platform.\n';
  } else {
    report += '\nAll required environment variables are present.\n';
  }
  
  report += '=====================================\n';
  
  return report;
};