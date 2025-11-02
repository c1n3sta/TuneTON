// Build verification component to check for common issues
import React from 'react';

// This component helps identify potential build issues
export const BuildCheck: React.FC = () => {
  const checkBuildReadiness = () => {
    const issues: string[] = [];
    
    // Check for environment variables
    const requiredEnvVars = ['SUPABASE_URL', 'SUPABASE_ANON_KEY'];
    requiredEnvVars.forEach(envVar => {
      if (!import.meta.env[`VITE_${envVar}`] && !process.env[envVar]) {
        issues.push(`Missing environment variable: ${envVar}`);
      }
    });
    
    // Check for common import issues
    try {
      // Test dynamic imports that might fail
      import('./HomePage').catch(() => {
        issues.push('HomePage import failed');
      });
    } catch (error) {
      issues.push(`Import error: ${error}`);
    }
    
    return issues;
  };
  
  const issues = checkBuildReadiness();
  
  if (issues.length === 0) {
    return <div>✅ Build checks passed</div>;
  }
  
  return (
    <div>
      <h3>❌ Build Issues Found:</h3>
      <ul>
        {issues.map((issue, index) => (
          <li key={index}>{issue}</li>
        ))}
      </ul>
    </div>
  );
};

export default BuildCheck;