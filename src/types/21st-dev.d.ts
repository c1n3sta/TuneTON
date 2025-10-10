// Type definitions for 21st.dev Toolbar
declare module '@21st-extension/toolbar-react' {
  import { ComponentType } from 'react';
  
  interface ToolbarProps {
    config: {
      plugins: any[];
    };
  }
  
  const TwentyFirstToolbar: ComponentType<ToolbarProps>;
  export default TwentyFirstToolbar;
}

declare module '@21st-extension/react' {
  class ReactPlugin {
    constructor();
  }
  
  export { ReactPlugin };
}
