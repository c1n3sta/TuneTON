import React, { useRef, useCallback, useState, useEffect } from 'react';

// Type definitions for the 21st.dev Toolbar components
interface IReactPlugin {
  // Add any required methods/properties if needed
}

type ToolbarComponent = React.ComponentType<{
  config: {
    plugins: IReactPlugin[];
  };
}>;

type ToolbarModule = {
  default: ToolbarComponent;
  TwentyFirstToolbar?: ToolbarComponent;
};

type ReactPluginModule = {
  default: {
    ReactPlugin: new () => IReactPlugin;
  };
  ReactPlugin?: new () => IReactPlugin;
};

// Extend the Window interface with our toolbar types
declare global {
  interface Window {
    TwentyFirstToolbar?: ToolbarComponent;
    ReactPlugin?: new () => any;
    __TWENTYFIRST_EXTENSION_INSTALLED__?: boolean;
  }
}

export const use21stDevToolbar = () => {
  const isInitialized = useRef(false);
  const [showToolbar, setShowToolbar] = useState(false);

  // Initialize the toolbar in development mode
  useEffect(() => {
    if (!import.meta.env.DEV) {
      console.log('21st.dev Toolbar: Running in production mode, skipping initialization');
      return;
    }
    
    if (isInitialized.current) {
      console.log('21st.dev Toolbar: Already initialized');
      return;
    }
    
    // Check if the 21st.dev extension is installed
    const checkExtensionInstalled = () => {
      // Don't try to connect to MCP server
      if (window.location.search.includes('21st-dev-toolbar')) {
        console.log('21st.dev Toolbar: Running in 21st.dev environment');
        return true;
      }
      
      const isInstalled = !!window.__TWENTYFIRST_EXTENSION_INSTALLED__;
      console.log('21st.dev Toolbar: Extension installed:', isInstalled);
      setShowToolbar(isInstalled);
      return isInstalled;
    };
    
    if (!checkExtensionInstalled()) {
      console.log('21st.dev Toolbar: Extension not detected, skipping initialization');
      return;
    }

    console.log('21st.dev Toolbar: Starting initialization...');
    
    const loadToolbar = async () => {
      try {
        console.log('21st.dev Toolbar: Attempting to load @21st-extension/toolbar-react...');
        const toolbarModule = (await import('@21st-extension/toolbar-react')) as ToolbarModule;
        console.log('21st.dev Toolbar: Toolbar module loaded:', {
          hasDefault: !!toolbarModule?.default,
          hasTwentyFirstToolbar: !!toolbarModule?.TwentyFirstToolbar,
          moduleKeys: Object.keys(toolbarModule || {})
        });
        
        console.log('21st.dev Toolbar: Attempting to load @21st-extension/react...');
        const reactPluginModule = (await import('@21st-extension/react')) as ReactPluginModule;
        console.log('21st.dev Toolbar: React plugin module loaded:', {
          hasDefault: !!(reactPluginModule as any)?.default,
          hasReactPlugin: !!reactPluginModule?.ReactPlugin,
          moduleKeys: Object.keys(reactPluginModule || {})
        });
        
        // Assign to window for global access if needed
        window.TwentyFirstToolbar = toolbarModule.default || toolbarModule.TwentyFirstToolbar;
        // Handle both default and direct exports
        window.ReactPlugin = (reactPluginModule as any)?.default?.ReactPlugin || reactPluginModule.ReactPlugin;
        
        console.log('21st.dev Toolbar: Initialization result', {
          hasToolbar: !!window.TwentyFirstToolbar,
          hasReactPlugin: !!window.ReactPlugin,
          isReactPluginConstructor: typeof window.ReactPlugin === 'function'
        });
        
        isInitialized.current = true;
      } catch (error) {
        console.error('Failed to load 21st.dev Toolbar:', error);
      }
    };
    
    loadToolbar();
    
    return () => {
      // Cleanup if needed
      console.log('21st.dev Toolbar cleanup');
      delete window.TwentyFirstToolbar;
      delete window.ReactPlugin;
      isInitialized.current = false;
    };
  }, []);

  // Memoize the component to prevent unnecessary re-renders
  const TwentyFirstDevToolbar = useCallback(
    (): React.ReactElement | null => {
      if (!import.meta.env.DEV || !showToolbar) {
        return null;
      }
      
      const { TwentyFirstToolbar } = window;
      
      if (!TwentyFirstToolbar) {
        console.log('21st.dev Toolbar: Toolbar component not available');
        return null;
      }
      
      try {
        const Toolbar = TwentyFirstToolbar;
        
        // Create a simple plugin object if ReactPlugin is not available
        const plugin = {
          // Add any required plugin methods here
          initialize: () => {},
          // Add a simple ID for debugging
          __isMockPlugin: true
        };
        
        return React.createElement('div', { style: { display: 'none' } },
          React.createElement(Toolbar, { 
            config: { 
              plugins: [plugin] // Pass our mock plugin
            } 
          })
        );
      } catch (error) {
        console.error('Error rendering 21st.dev Toolbar:', error);
        return null;
      }
    },
    [] // Empty dependency array since we don't use any external values
  );
  
  // Only return the toolbar component if in development and extension is installed
  // Always return null to prevent MCP server connection attempts
  return { 
    TwentyFirstDevToolbar: () => null
  };
};
