export const validateName = (name: string): string | null => {
  if (!name || name.trim().length < 20) {
    return "Name must be at least 20 characters long";
  }
  if (name.trim().length > 60) {
    return "Name must not exceed 60 characters";
  }
  return null;
};

export const validateAddress = (address: string): string | null => {
  if (!address || address.trim().length === 0) {
    return "Address is required";
  }
  if (address.trim().length > 400) {
    return "Address must not exceed 400 characters";
  }
  return null;
};

export const validatePassword = (password: string): string | null => {
  if (!password || password.length < 8) {
    return "Password must be at least 8 characters long";
  }
  if (password.length > 16) {
    return "Password must not exceed 16 characters";
  }
  const hasUppercase = /[A-Z]/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  if (!hasUppercase) {
    return "Password must contain at least one uppercase letter";
  }
  if (!hasSpecialChar) {
    return "Password must contain at least one special character";
  }
  return null;
};

export const validateEmail = (email: string): string | null => {
  if (!email) {
    return "Email is required";
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return "Invalid email format";
  }
  return null;
};

export const validateRating = (rating: number): string | null => {
  if (!rating || rating < 1 || rating > 5) {
    return "Rating must be between 1 and 5";
  }
  return null;
};
