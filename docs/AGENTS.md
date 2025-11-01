This file provides guidance to Qoder (qoder.com) when working with code in this repository.                                                              
                                                                                                                                                           
  ## Project Overview                                                                                                                                      
  This is a music streaming application built with React, TypeScript, and Vite, designed to run as a Telegram WebApp. The application integrates           
  with Jamendo for music content and uses Supabase as its backend. It features NFT marketplace functionality, AI music creation tools, contests,           
  and social features.                                                                                                                                     
                                                                                                                                                           
  ## Common Development Commands                                                                                                                           
  ### Development                                                                                                                                          
  - npm run dev - Start development server on port 3001                                                                                                    
  - npm run build - Build the application for production                                                                                                   
  - npm run preview - Preview the built application locally                                                                                                
                                                                                                                                                           
  ### Testing                                                                                                                                              
  - npm run test - Run tests with Vitest                                                                                                                   
  - npm run test:watch - Run tests in watch mode                                                                                                           
  - npm run test:coverage - Run tests with coverage report                                                                                                 
  - npm run test:ui - Run tests with UI interface                                                                                                          
                                                                                                                                                           
  ### Code Quality                                                                                                                                         
  - npm run lint - Run ESLint to check for code issues                                                                                                     
  - npm run lint:fix - Run ESLint and automatically fix issues                                                                                             
  - npm run format - Format code with Prettier                                                                                                             
  - npm run type-check - Check TypeScript types without emitting files                                                                                     
                                                                                                                                                           
  ### Deployment                                                                                                                                           
  - npm run build:prod - Clean build for production                                                                                                        
  - npm run deploy - Deploy to production server                                                                                                           
  - npm run deploy:prod - Build and deploy to production                                                                                                   
                                                                                                                                                           
  ## Code Architecture                                                                                                                                     
  ### Frontend Structure                                                                                                                                   
  - src/App.tsx - Main application component                                                                                                               
  - src/main.tsx - Entry point                                                                                                                             
  - src/components/ - React components organized by feature                                                                                                
  - src/utils/ - Utility functions and API integrations                                                                                                    
  - src/hooks/ - Custom React hooks                                                                                                                        
  - src/pages/ - Page components                                                                                                                           
  - src/api/ - API service definitions                                                                                                                     
                                                                                                                                                           
  ### Key Components                                                                                                                                       
  - MusicApp.tsx - Main application shell with routing and state management                                                                                
  - TelegramAuthProvider.tsx - Handles Telegram WebApp authentication                                                                                      
  - MusicPlayer.tsx - Core audio playback functionality                                                                                                    
  - BottomNavigation.tsx - Main navigation interface                                                                                                       
  - Feature pages: Home, Library, Search, Profile, NFT Marketplace, AI Studio                                                                              
                                                                                                                                                           
  ### Backend Integration                                                                                                                                  
  - Supabase is used for backend services and database                                                                                                     
  - Jamendo API integration for music content                                                                                                              
  - Custom server functions deployed to Supabase                                                                                                           
                                                                                                                                                           
  ### State Management                                                                                                                                     
  - React built-in state management (useState, useContext)                                                                                                 
  - Custom hooks for complex state logic                                                                                                                   
  - Local storage for persisting user preferences                                                                                                          
                                                                                                                                                           
  ### Styling                                                                                                                                              
  - Tailwind CSS for styling                                                                                                                               
  - Radix UI components for accessible UI primitives                                                                                                       
  - Custom CSS modules where needed                                                                                                                        
                                                                                                                                                           
  ## Key Dependencies                                                                                                                                      
  - React 18 with TypeScript                                                                                                                               
  - Vite for build tooling                                                                                                                                 
  - Supabase for backend services                                                                                                                          
  - Telegram Web Apps SDK                                                                                                                                  
  - Jamendo API for music content                                                                                                                          
  - Tailwind CSS and Radix UI for styling                                                                                                                  
  - Vitest for testing                                                                                                                                     
                                                                                                                                                           
  ## Production Build Restoration Rules                                                                                                                    
  ### 1. Component Restoration Guidelines                                                                                                                  
  When restoring missing components like PlaylistDetailReal.tsx, LibraryPageReal.tsx, or JamendoOAuthCallback.tsx:                                         
                                                                                                                                                           
  1. Never replace entire code blocks - Only make targeted fixes to specific functions or sections                                                         
  2. Analyze surrounding context before implementing any changes:                                                                                          
    - Check import statements and their sources                                                                                                            
    - Understand component props and state management                                                                                                      
    - Examine how the component interacts with parent components                                                                                           
    - Review CSS classes and styling patterns used                                                                                                         
  3. Preserve all existing functionality:                                                                                                                  
    - Do not remove or simplify existing features                                                                                                          
    - Maintain all UI elements and their styling                                                                                                           
    - Keep all event handlers and callback functions                                                                                                       
    - Preserve error handling and loading states                                                                                                           
  4. Optimize without reducing functionality:                                                                                                              
    - Can refactor code for better performance                                                                                                             
    - Can improve code organization and readability                                                                                                        
    - Can add type safety enhancements                                                                                                                     
    - Cannot remove features or simplify UI                                                                                                                
                                                                                                                                                           
                                                                                                                                                           
  ### 2. API Integration Restoration                                                                                                                       
  When restoring API integrations:                                                                                                                         
                                                                                                                                                           
  1. Restore complete API methods from archived versions:                                                                                                  
  // Restore full tuneTONAPI implementation                                                                                                                
  export const tuneTonAPI = {                                                                                                                              
    async setupDatabase() {                                                                                                                                
      // Full implementation with error handling                                                                                                           
    },                                                                                                                                                     
    async fixRLS() {                                                                                                                                       
      // Complete RLS security fixes                                                                                                                       
    }                                                                                                                                                      
  }                                                                                                                                                        
                                                                                                                                                           
  2. Preserve all API endpoints:                                                                                                                           
    - Do not remove any existing API calls                                                                                                                 
    - Maintain all data transformation logic                                                                                                               
    - Keep error handling for each API method                                                                                                              
                                                                                                                                                           
                                                                                                                                                           
  ### 3. Audio System Restoration                                                                                                                          
  When working with audio components:                                                                                                                      
                                                                                                                                                           
  1. Maintain full audio processing chain:                                                                                                                 
  // Preserve all effect modules                                                                                                                           
  private tempoPitchIn: GainNode;                                                                                                                          
  private lofiIn: GainNode;                                                                                                                                
  private eqBands: BiquadFilterNode[] = [];                                                                                                                
  private reverbIn: GainNode;                                                                                                                              
                                                                                                                                                           
  2. Keep all audio controls:                                                                                                                              
    - Tempo and pitch shifting                                                                                                                             
    - 7-band EQ with all frequency bands                                                                                                                   
    - Reverb with pre-delay and damping                                                                                                                    
    - Lo-fi effects with noise and wow/flutter                                                                                                             
                                                                                                                                                           
                                                                                                                                                           
  ### 4. Authentication System Restoration                                                                                                                 
  When restoring authentication components:                                                                                                                
                                                                                                                                                           
  1. Preserve complete OAuth flow:                                                                                                                         
  // Keep full OAuth callback processing                                                                                                                   
  const processOAuthCallback = async () => {                                                                                                               
    // All error handling                                                                                                                                  
    // State validation                                                                                                                                    
    // Token exchange                                                                                                                                      
    // Success/failure callbacks                                                                                                                           
  };                                                                                                                                                       
                                                                                                                                                           
  2. Maintain Telegram WebApp integration:                                                                                                                 
    - User data extraction                                                                                                                                 
    - Theme parameter handling                                                                                                                             
    - Button interactions                                                                                                                                  
    - Back button management                                                                                                                               
                                                                                                                                                           
                                                                                                                                                           
  ### 5. UI/UX Preservation Rules                                                                                                                          
  1. Never simplify UI components:                                                                                                                         
    - Keep all visual elements                                                                                                                             
    - Maintain all animations and transitions                                                                                                              
    - Preserve all interactive elements                                                                                                                    
    - Retain all accessibility features                                                                                                                    
  2. Style preservation:                                                                                                                                   
    - Keep all Tailwind CSS classes                                                                                                                        
    - Maintain Radix UI component configurations                                                                                                           
    - Preserve custom CSS modules                                                                                                                          
    - Retain all color schemes and themes                                                                                                                  
                                                                                                                                                           
                                                                                                                                                           
  ### 6. Data Flow and State Management                                                                                                                    
  1. Preserve all state management patterns:                                                                                                               
  // Keep complex state structures                                                                                                                         
  const [navigationData, setNavigationData] = useState<NavigationData>({});                                                                                
                                                                                                                                                           
  2. Maintain all data flow patterns:                                                                                                                      
    - Parent-child component communication                                                                                                                 
    - Context API usage                                                                                                                                    
    - Custom hook implementations                                                                                                                          
    - Event handler patterns                                                                                                                               
                                                                                                                                                           
                                                                                                                                                           
  ### 7. Error Handling and Robustness                                                                                                                     
  1. Preserve all error handling:                                                                                                                          
  // Keep comprehensive error handling                                                                                                                     
  try {                                                                                                                                                    
    // API calls                                                                                                                                           
  } catch (error) {                                                                                                                                        
    // Detailed error logging                                                                                                                              
    // User-friendly error messages                                                                                                                        
    // Fallback behaviors                                                                                                                                  
  }                                                                                                                                                        
                                                                                                                                                           
  2. Maintain loading states:                                                                                                                              
    - All loading indicators                                                                                                                               
    - Skeleton screens                                                                                                                                     
    - Progress indicators                                                                                                                                  
    - Empty state handling                                                                                                                                 
                                                                                                                                                           
                                                                                                                                                           
  ### 8. Performance Optimization Guidelines                                                                                                               
  1. Allowed optimizations:                                                                                                                                
    - Memoization of expensive calculations                                                                                                                
    - Lazy loading of components                                                                                                                           
    - Code splitting                                                                                                                                       
    - Bundle size reduction through tree shaking                                                                                                           
  2. Prohibited optimizations:                                                                                                                             
    - Removing features or functionality                                                                                                                   
    - Simplifying UI components                                                                                                                            
    - Reducing content or information                                                                                                                      
    - Eliminating styling or visual elements                                                                                                               
                                                                                                                                                           
                                                                                                                                                           
  ### 9. Testing and Validation                                                                                                                            
  1. Before implementing changes:                                                                                                                          
    - Run existing tests to establish baseline                                                                                                             
    - Document current behavior                                                                                                                            
    - Identify all dependencies                                                                                                                            
  2. After implementing changes:                                                                                                                           
    - Run all tests to ensure no regressions                                                                                                               
    - Verify functionality in browser                                                                                                                      
    - Check for TypeScript errors                                                                                                                          
    - Validate build process                                                                                                                               
                                                                                                                                                           
                                                                                                                                                           
  ### 10. Git Workflow for Restoration                                                                                                                     
  1. Create feature branches for each component restoration                                                                                                
  2. Make small, focused commits with descriptive messages                                                                                                 
  3. Include issue references in commit messages when applicable                                                                                           
  4. Run tests before pushing any changes                                                                                                                  
  5. Create pull requests for code review before merging                                                                                                   
                                                                                                                                                           
  ### 11. Component-Specific Restoration Guidelines                                                                                                        
  #### PlaylistDetailReal Restoration                                                                                                                      
  - Restore full playlist loading from API                                                                                                                 
  - Maintain all track listing functionality                                                                                                               
  - Keep playlist editing capabilities                                                                                                                     
  - Preserve sharing and export features                                                                                                                   
                                                                                                                                                           
  #### LibraryPageReal Restoration                                                                                                                         
  - Restore complete library organization                                                                                                                  
  - Maintain all filtering and sorting options                                                                                                             
  - Keep playlist creation workflow                                                                                                                        
  - Preserve offline sync functionality                                                                                                                    
                                                                                                                                                           
  #### JamendoOAuthCallback Restoration                                                                                                                    
  - Restore complete OAuth flow handling                                                                                                                   
  - Maintain state parameter validation                                                                                                                    
  - Keep error handling for all OAuth scenarios                                                                                                            
  - Preserve redirect logic to Telegram                                                                                                                    
                                                                                                                                                           
  #### Audio Engine Restoration                                                                                                                            
  - Restore all effect modules (tempo, pitch, EQ, reverb, lo-fi)                                                                                           
  - Maintain Web Audio API node connections                                                                                                                
  - Keep all parameter controls                                                                                                                            
  - Preserve audio processing optimizations                             