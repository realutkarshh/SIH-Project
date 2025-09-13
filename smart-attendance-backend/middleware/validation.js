import { body, validationResult } from 'express-validator';

// Handle validation errors
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map(error => ({
        field: error.path,
        message: error.msg,
        value: error.value
      }))
    });
  }
  
  next();
};

// User registration validation
export const validateUserRegistration = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('Name can only contain letters and spaces'),
    
  body('email')
    .trim()
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
    
  body('employeeId')
    .trim()
    .isLength({ min: 3, max: 20 })
    .withMessage('Employee ID must be between 3 and 20 characters')
    .matches(/^[a-zA-Z0-9]+$/)
    .withMessage('Employee ID can only contain letters and numbers'),
    
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
    
  body('role')
    .isIn(['teacher', 'student'])
    .withMessage('Role must be either teacher or student'),
    
  body('department')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Department must be between 2 and 50 characters'),
    
  // Conditional validation for students
  body('class')
    .if(body('role').equals('student'))
    .trim()
    .notEmpty()
    .withMessage('Class is required for students'),
    
  body('section')
    .if(body('role').equals('student'))
    .trim()
    .notEmpty()
    .withMessage('Section is required for students'),
    
  handleValidationErrors
];

// User login validation
export const validateUserLogin = [
  body('email')
    .trim()
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
    
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
    
  handleValidationErrors
];

// Lecture creation validation
export const validateLectureCreation = [
  body('lectureNumber')
    .trim()
    .notEmpty()
    .withMessage('Lecture number is required'),
    
  body('lectureName')
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('Lecture name must be between 3 and 100 characters'),
    
  body('subject')
    .trim()
    .notEmpty()
    .withMessage('Subject is required'),
    
  body('class')
    .trim()
    .notEmpty()
    .withMessage('Class is required'),
    
  body('section')
    .trim()
    .notEmpty()
    .withMessage('Section is required'),
    
  body('startTime')
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage('Start time must be in HH:MM format'),
    
  body('endTime')
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage('End time must be in HH:MM format'),
    
  handleValidationErrors
];
