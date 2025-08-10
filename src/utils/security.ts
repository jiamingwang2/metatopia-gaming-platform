// XSS Protection
export const escapeHtml = (text: string): string => {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
};

export const stripHtml = (html: string): string => {
  const div = document.createElement('div');
  div.innerHTML = html;
  return div.textContent || div.innerText || '';
};

// Input validation functions
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
};

export const validatePassword = (password: string): {
  isValid: boolean;
  errors: string[];
} => {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validateUsername = (username: string): {
  isValid: boolean;
  errors: string[];
} => {
  const errors: string[] = [];
  
  if (username.length < 3) {
    errors.push('Username must be at least 3 characters long');
  }
  
  if (username.length > 20) {
    errors.push('Username must be no more than 20 characters long');
  }
  
  if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
    errors.push('Username can only contain letters, numbers, underscores, and hyphens');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validateWalletAddress = (address: string, currency: string): boolean => {
  // Basic validation patterns for different cryptocurrencies
  const patterns: Record<string, RegExp> = {
    BTC: /^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$|^bc1[a-z0-9]{39,59}$/,
    ETH: /^0x[a-fA-F0-9]{40}$/,
    LTC: /^[LM3][a-km-zA-HJ-NP-Z1-9]{26,33}$/,
    USDT: /^0x[a-fA-F0-9]{40}$/, // ERC-20 USDT
    USDC: /^0x[a-fA-F0-9]{40}$/, // ERC-20 USDC
  };
  
  const pattern = patterns[currency.toUpperCase()];
  return pattern ? pattern.test(address) : false;
};

export const validateAmount = (amount: string | number, min: number = 0, max?: number): {
  isValid: boolean;
  errors: string[];
} => {
  const errors: string[] = [];
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  if (isNaN(numAmount)) {
    errors.push('Amount must be a valid number');
    return { isValid: false, errors };
  }
  
  if (numAmount < min) {
    errors.push(`Amount must be at least ${min}`);
  }
  
  if (max !== undefined && numAmount > max) {
    errors.push(`Amount must not exceed ${max}`);
  }
  
  if (numAmount <= 0) {
    errors.push('Amount must be greater than 0');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validatePhoneNumber = (phone: string): boolean => {
  // Basic international phone number validation
  const phoneRegex = /^\+?[1-9]\d{1,14}$/;
  return phoneRegex.test(phone.replace(/[\s()-]/g, ''));
};

export const validateLength = (value: string, min: number, max: number): {
  isValid: boolean;
  errors: string[];
} => {
  const errors: string[] = [];
  
  if (value.length < min) {
    errors.push(`Must be at least ${min} characters long`);
  }
  
  if (value.length > max) {
    errors.push(`Must be no more than ${max} characters long`);
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Input sanitization
export const sanitizeInput = (input: string): string => {
  return input
    .trim()
    .replace(/[<>"'&]/g, (match) => {
      const entities: Record<string, string> = {
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#x27;',
        '&': '&amp;'
      };
      return entities[match] || match;
    });
};

// CSRF Token management
export const generateCSRFToken = (): string => {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};

export const setCSRFToken = (): string => {
  const token = generateCSRFToken();
  sessionStorage.setItem('csrfToken', token);
  return token;
};

export const getCSRFToken = (): string | null => {
  return sessionStorage.getItem('csrfToken');
};

export const validateCSRFToken = (token: string): boolean => {
  const storedToken = getCSRFToken();
  return storedToken === token;
};

// SQL Injection prevention (for client-side validation)
export const containsSQLInjection = (input: string): boolean => {
  const sqlPatterns = [
    /('|(\-\-)|(;)|(\||\|)|(\*|\*))/i,
    /(union|select|insert|delete|update|drop|create|alter|exec|execute)/i,
    /(script|javascript|vbscript|onload|onerror|onclick)/i
  ];
  
  return sqlPatterns.some(pattern => pattern.test(input));
};

// Form validation
interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: string) => boolean;
  email?: boolean;
  password?: boolean;
  username?: boolean;
  phone?: boolean;
  amount?: { min?: number; max?: number };
}

interface ValidationRules {
  [key: string]: ValidationRule;
}

interface ValidationErrors {
  [key: string]: string[];
}

export const validateForm = (data: Record<string, string>, rules: ValidationRules): ValidationErrors => {
  const errors: ValidationErrors = {};
  
  Object.keys(rules).forEach(field => {
    const value = data[field] || '';
    const rule = rules[field];
    const fieldErrors: string[] = [];
    
    // Required validation
    if (rule.required && !value.trim()) {
      fieldErrors.push('This field is required');
      errors[field] = fieldErrors;
      return;
    }
    
    // Skip other validations if field is empty and not required
    if (!value.trim() && !rule.required) {
      return;
    }
    
    // Length validation
    if (rule.minLength && value.length < rule.minLength) {
      fieldErrors.push(`Must be at least ${rule.minLength} characters long`);
    }
    
    if (rule.maxLength && value.length > rule.maxLength) {
      fieldErrors.push(`Must be no more than ${rule.maxLength} characters long`);
    }
    
    // Pattern validation
    if (rule.pattern && !rule.pattern.test(value)) {
      fieldErrors.push('Invalid format');
    }
    
    // Email validation
    if (rule.email && !validateEmail(value)) {
      fieldErrors.push('Please enter a valid email address');
    }
    
    // Password validation
    if (rule.password) {
      const passwordValidation = validatePassword(value);
      if (!passwordValidation.isValid) {
        fieldErrors.push(...passwordValidation.errors);
      }
    }
    
    // Username validation
    if (rule.username) {
      const usernameValidation = validateUsername(value);
      if (!usernameValidation.isValid) {
        fieldErrors.push(...usernameValidation.errors);
      }
    }
    
    // Phone validation
    if (rule.phone && !validatePhoneNumber(value)) {
      fieldErrors.push('Please enter a valid phone number');
    }
    
    // Amount validation
    if (rule.amount) {
      const amountValidation = validateAmount(value, rule.amount.min, rule.amount.max);
      if (!amountValidation.isValid) {
        fieldErrors.push(...amountValidation.errors);
      }
    }
    
    // Custom validation
    if (rule.custom && !rule.custom(value)) {
      fieldErrors.push('Invalid value');
    }
    
    if (fieldErrors.length > 0) {
      errors[field] = fieldErrors;
    }
  });
  
  return errors;
};