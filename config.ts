import dotenv from 'dotenv';
dotenv.config();

// Define an interface for the folder paths
interface FolderPaths {
  // BACKEND
  CONTROLLERS_FOLDER: string;
  MODELS_FOLDER: string;
  BE_ROUTES_FOLDER: string;
  // FRONTEND
  FE_COMPONENTS_FOLDER: string;
  FE_ASSISTANT_FOLDER: string;
  FE_DASHBOARD_FOLDER: string;
  FE_MODALS_FOLDER: string;
  FE_ROUTES_FOLDER: string;
  // SHARED
  SHARED_FOLDER: string;
  }

// Define variables by reading specific folder paths from the .env file
// BACKEND
const CONTROLLERS_FOLDER = process.env.CONTROLLERS_FOLDER || 'backend/controllers';
const MODELS_FOLDER = process.env.MODELS_FOLDER || 'backend/models';
const BE_ROUTES_FOLDER = process.env.BE_ROUTES_FOLDER || 'backend/routes';
// FRONTEND
const FE_COMPONENTS_FOLDER = process.env.FE_COMPONENTS_FOLDER || 'frontend/src/components';
const FE_ASSISTANT_FOLDER = process.env.FE_ROUTES_FOLDER || 'frontend/src/components/assistant';
const FE_DASHBOARD_FOLDER = process.env.FE_ROUTES_FOLDER || 'frontend/src/components/dashboard';
const FE_MODALS_FOLDER = process.env.FE_MODALS_FOLDER || 'frontend/src/components/modals';
const FE_ROUTES_FOLDER = process.env.FE_ROUTES_FOLDER || 'frontend/src/routes';
// SHARED
const SHARED_FOLDER = process.env.SHARED_FOLDER || 'shared';

// Store them in an object that implements the FolderPaths interface
export const FOLDER_PATHS: FolderPaths = {
  // BACKEND
  CONTROLLERS_FOLDER,
  MODELS_FOLDER,
  BE_ROUTES_FOLDER,
  // FRONT
  FE_COMPONENTS_FOLDER,
  FE_ASSISTANT_FOLDER,
  FE_DASHBOARD_FOLDER,
  FE_MODALS_FOLDER,
  FE_ROUTES_FOLDER,
  // SHARED
  SHARED_FOLDER
};

// Export individual constants for direct import
export {
  // BACKEND
  CONTROLLERS_FOLDER,
  MODELS_FOLDER,
  BE_ROUTES_FOLDER,
  // FRONTEND
  FE_COMPONENTS_FOLDER,
  FE_ASSISTANT_FOLDER,
  FE_DASHBOARD_FOLDER,
  FE_MODALS_FOLDER,
  FE_ROUTES_FOLDER,
  // SHARED
  SHARED_FOLDER
};

// How to use the constants in other files
// import { FOLDER_PATHS } from './config';
