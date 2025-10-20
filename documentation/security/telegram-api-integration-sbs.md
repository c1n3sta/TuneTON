# Telegram API Integration Step-by-Step Guide for tuneTON_MVP

This guide provides a comprehensive, step-by-step approach to integrating Telegram Bot API and Mini Apps functionality into the tuneTON_MVP project.

## Prerequisites

Before starting the integration, ensure you have:

1. A Telegram account
2. Node.js and npm installed
3. Access to the tuneTON_MVP codebase
4. Basic understanding of React and TypeScript

## Phase 1: Setting up Telegram Bot

### Step 1: Create a Telegram Bot

1. Open Telegram and search for `@BotFather`
2. Start a chat with BotFather
3. Send `/newbot` command
4. Follow the prompts to:
   - Choose a name for your bot (e.g., "tuneTON Bot")
   - Choose a username for your bot (must end in 'bot', e.g., "tuneTON_bot")
5. Copy the HTTP API token provided by BotFather - you'll need this later

### Step 2: Configure Bot Settings

1. In the chat with @BotFather, use the `/mybots` command
2. Select your bot from the list
3. Configure the following settings:
   - **Bot Settings** → **Inline Mode** → **Turn inline mode on** (for inline queries)
   - **Bot Settings** → **Allow Groups?** → **Yes** (if you want the bot in groups)
   - **Edit Description** and **Edit About** with relevant information

### Step 3: Set up Webhook (Optional but Recommended)

For production environments, set up a webhook to receive updates:

```bash
curl -F "url=https://yourdomain.com/telegram/webhook" https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook
```

## Phase 2: Installing Required Packages

### Step 4: Install Telegram SDKs

Navigate to your tuneTON_MVP project directory and install the required packages:

```bash
# Navigate to the TuneTON directory
cd TuneTON

# Install core Telegram SDK
npm install @telegram-apps/sdk

# Install React bindings for Telegram SDK
npm install @telegram-apps/sdk-react

# Install Telegram UI components
npm install @telegram-apps/telegram-ui

# Install TypeScript typings
npm install telegram-webapps-types
```

### Step 5: Configure TypeScript

Update your `tsconfig.json` to include the Telegram webapps types:

```json
{
  "compilerOptions": {
    "typeRoots": ["./node_modules/@types", "./node_modules/telegram-webapps-types"]
  }
}
```

## Phase 3: Setting up the Mini App Environment

### Step 6: Initialize the SDK Provider

In your main App component (`src/App.tsx`), wrap your application with the SDKProvider:

```tsx
// src/App.tsx
import React from 'react';
import { SDKProvider } from '@telegram-apps/sdk-react';
import { AppRoot } from '@telegram-apps/telegram-ui';
import './App.css';

function App() {
  return (
    <SDKProvider acceptCustomStyles debug>
      <AppRoot>
        {/* Your existing app content */}
        <div className="App">
          {/* ... */}
        </div>
      </AppRoot>
    </SDKProvider>
  );
}

export default App;
```

### Step 7: Create a Mock Environment for Development

Create a file `src/mockEnv.ts` for local development:

```ts
// src/mockEnv.ts
import { mockTelegramEnv, parseInitData } from '@telegram-apps/sdk';

// Check if we're in a Telegram environment
if (!('Telegram' in window)) {
  // Parse init data
  const initDataRaw = new URLSearchParams([
    ['user', JSON.stringify({
      id: 99281932,
      first_name: 'Andrew',
      last_name: 'Rogue',
      username: 'rogue',
      language_code: 'en',
      is_premium: true,
      allows_write_to_pm: true,
    })],
    ['hash', '8eee0a53e29089b33933aba6e4d09884'],
    ['auth_date', '1716922846'],
    ['start_param', 'debug'],
    ['chat', JSON.stringify({
      id: 123456789,
      type: 'sender',
      title: 'Debug Chat',
    })],
  ]).toString();

  mockTelegramEnv({
    themeParams: {
      accentTextColor: '#6ab2f2',
      bgColor: '#17212b',
      buttonColor: '#5288c1',
      buttonTextColor: '#ffffff',
      destructiveTextColor: '#ec3942',
      headerBgColor: '#17212b',
      hintColor: '#708499',
      linkColor: '#6ab3f3',
      secondaryBgColor: '#232e3c',
      sectionBgColor: '#17212b',
      sectionHeaderTextColor: '#6ab3f3',
      subtitleTextColor: '#708499',
      textColor: '#f5f5f5',
    },
    initData: parseInitData(initDataRaw)!,
    initDataRaw,
    version: '7.2',
    platform: 'tdesktop',
  });
}
```

Import this mock environment in your entry point (`src/main.tsx`):

```ts
// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import './mockEnv'; // Add this line
import App from './App';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
```

## Phase 4: Implementing Core Telegram Features

### Step 8: Access User Data

Create a component to display user information:

```tsx
// src/components/TelegramUserInfo.tsx
import React, { useEffect, useState } from 'react';
import { useInitData } from '@telegram-apps/sdk-react';

const TelegramUserInfo: React.FC = () => {
  const initData = useInitData();
  const [userInfo, setUserInfo] = useState<string | null>(null);

  useEffect(() => {
    if (initData?.user) {
      setUserInfo(`Hello, ${initData.user.firstName} ${initData.user.lastName || ''} (@${initData.user.username})`);
    }
  }, [initData]);

  if (!userInfo) return null;

  return (
    <div>
      <p>{userInfo}</p>
      {initData?.user?.isPremium && <p>👑 Premium User</p>}
    </div>
  );
};

export default TelegramUserInfo;
```

### Step 9: Implement Theme Support

Create a component that adapts to Telegram's theme:

```tsx
// src/components/ThemedComponent.tsx
import React from 'react';
import { useThemeParams } from '@telegram-apps/sdk-react';

const ThemedComponent: React.FC = () => {
  const themeParams = useThemeParams();

  return (
    <div style={{
      backgroundColor: themeParams.bgColor,
      color: themeParams.textColor,
      padding: '16px',
      borderRadius: '8px'
    }}>
      <h3>Themed Component</h3>
      <p>This component adapts to Telegram's theme</p>
    </div>
  );
};

export default ThemedComponent;
```

### Step 10: Add Main Button Functionality

Implement the main button at the bottom of the Mini App:

```tsx
// src/components/MainActionButton.tsx
import React, { useEffect } from 'react';
import { useMainButton } from '@telegram-apps/sdk-react';

const MainActionButton: React.FC = () => {
  const mainButton = useMainButton();

  useEffect(() => {
    if (mainButton) {
      mainButton
        .setBgColor('#238be6')
        .setTextColor('#ffffff')
        .setText('Click Me!')
        .show()
        .enable();

      const handleClick = () => {
        mainButton.showProgress();
        // Simulate some async operation
        setTimeout(() => {
          mainButton.hideProgress();
          alert('Action completed!');
        }, 1000);
      };

      mainButton.onClick(handleClick);

      // Cleanup
      return () => {
        mainButton.offClick(handleClick);
        mainButton.hide();
      };
    }
  }, [mainButton]);

  return null; // This component doesn't render anything visible
};

export default MainActionButton;
```

### Step 11: Implement Back Button Handling

Handle the back button navigation:

```tsx
// src/components/BackButtonHandler.tsx
import React, { useEffect } from 'react';
import { useBackButton, useUtils } from '@telegram-apps/sdk-react';
import { useNavigate } from 'react-router-dom'; // If using React Router

const BackButtonHandler: React.FC = () => {
  const backButton = useBackButton();
  const utils = useUtils();
  const navigate = useNavigate(); // If using React Router

  useEffect(() => {
    if (backButton && utils) {
      backButton.show();

      const handleBack = () => {
        // Custom back logic
        if (window.history.length > 1) {
          navigate(-1); // If using React Router
          // Or use window.history.back() for browser navigation
        } else {
          // If no history, close the Mini App
          utils.close();
        }
      };

      backButton.onClick(handleBack);

      return () => {
        backButton.offClick(handleBack);
        backButton.hide();
      };
    }
  }, [backButton, utils, navigate]);

  return null;
};

export default BackButtonHandler;
```

## Phase 5: Integrating with tuneTON_MVP Features

### Step 12: Connect with Music Player

Integrate Telegram haptic feedback with the music player:

```tsx
// src/components/TelegramMusicPlayer.tsx
import React, { useEffect } from 'react';
import { useHapticFeedback } from '@telegram-apps/sdk-react';

const TelegramMusicPlayer: React.FC = () => {
  const hapticFeedback = useHapticFeedback();

  const handlePlay = () => {
    // Play music logic
    if (hapticFeedback) {
      hapticFeedback.notificationOccurred('success');
    }
  };

  const handlePause = () => {
    // Pause music logic
    if (hapticFeedback) {
      hapticFeedback.notificationOccurred('warning');
    }
  };

  return (
    <div>
      <button onClick={handlePlay}>Play</button>
      <button onClick={handlePause}>Pause</button>
    </div>
  );
};

export default TelegramMusicPlayer;
```

### Step 13: Share Music NFTs

Implement sharing functionality for music NFTs:

```tsx
// src/components/NFTShareButton.tsx
import React from 'react';
import { useUtils } from '@telegram-apps/sdk-react';

interface NFTShareButtonProps {
  nftData: {
    name: string;
    artist: string;
    url: string;
  };
}

const NFTShareButton: React.FC<NFTShareButtonProps> = ({ nftData }) => {
  const utils = useUtils();

  const handleShare = () => {
    if (utils) {
      const shareText = `Check out this amazing NFT: ${nftData.name} by ${nftData.artist}`;
      utils.shareURL(nftData.url, shareText);
    }
  };

  return (
    <button onClick={handleShare}>
      Share NFT
    </button>
  );
};

export default NFTShareButton;
```

## Phase 6: Testing and Deployment

### Step 14: Test in Development

1. Run your development server:

   ```bash
   npm run dev
   ```

2. Open your browser at `http://localhost:5173` (or your configured port)
3. You should see the mock Telegram environment working

### Step 15: Configure for Production

Update your `vite.config.ts` with the base path for your deployment:

```ts
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/your-telegram-mini-app/', // Change this to your actual path
  plugins: [react()],
});
```

### Step 16: Deploy Your Mini App

1. Build your application:

   ```bash
   npm run build
   ```

2. Deploy the contents of the `dist` folder to your web server or CDN

### Step 17: Configure Mini App in BotFather

1. In the chat with @BotFather, use the `/mybots` command
2. Select your bot
3. Go to **Bot Settings** → **Menu Button** → **Configure menu button**
4. Choose **Configure Mini App**
5. Enter the URL where you deployed your application
6. Set the name for your Mini App

## Phase 7: Advanced Features Implementation

### Step 18: Implement Cloud Storage

Use Telegram's cloud storage for user preferences:

```tsx
// src/hooks/useTelegramCloudStorage.ts
import { useCallback } from 'react';
import { useCloudStorage } from '@telegram-apps/sdk-react';

export const useTelegramCloudStorage = () => {
  const cloudStorage = useCloudStorage();

  const saveUserData = useCallback(async (key: string, value: string) => {
    if (cloudStorage) {
      try {
        await cloudStorage.setItem(key, value);
        return true;
      } catch (error) {
        console.error('Failed to save to cloud storage:', error);
        return false;
      }
    }
    return false;
  }, [cloudStorage]);

  const loadUserData = useCallback(async (key: string) => {
    if (cloudStorage) {
      try {
        return await cloudStorage.getItem(key);
      } catch (error) {
        console.error('Failed to load from cloud storage:', error);
        return null;
      }
    }
    return null;
  }, [cloudStorage]);

  return { saveUserData, loadUserData };
};
```

### Step 19: Add Biometric Authentication

Implement biometric authentication for premium features:

```tsx
// src/components/BiometricAuth.tsx
import React, { useEffect, useState } from 'react';
import { useBiometryManager } from '@telegram-apps/sdk-react';

const BiometricAuth: React.FC = () => {
  const biometryManager = useBiometryManager();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    if (biometryManager) {
      // Check if biometry is available
      console.log('Biometry available:', biometryManager.isAvailable);
      console.log('Biometry type:', biometryManager.type);
    }
  }, [biometryManager]);

  const handleAuthenticate = async () => {
    if (biometryManager) {
      try {
        await biometryManager.authenticate('Authenticate to access premium features');
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Biometric authentication failed:', error);
      }
    }
  };

  if (!biometryManager?.isAvailable) {
    return <p>Biometric authentication not available</p>;
  }

  return (
    <div>
      {isAuthenticated ? (
        <p>Authenticated! Accessing premium features...</p>
      ) : (
        <button onClick={handleAuthenticate}>
          Authenticate with {biometryManager.type}
        </button>
      )}
    </div>
  );
};

export default BiometricAuth;
```

## Troubleshooting Common Issues

### Issue 1: "Telegram is not defined" Error

**Solution**: Ensure you're importing the mock environment in development or testing in an actual Telegram environment.

### Issue 2: Hooks returning undefined

**Solution**: Some hooks like `useViewport` initialize asynchronously. Check for undefined values before using:

```ts
const viewport = useViewport();
useEffect(() => {
  if (viewport) {
    // Use viewport here
    console.log('Viewport height:', viewport.height);
  }
}, [viewport]);
```

### Issue 3: Styling conflicts

**Solution**: Use the `acceptCustomStyles` prop in `SDKProvider` and ensure your CSS doesn't conflict with Telegram's styles.

## Next Steps

1. Implement deep linking for specific NFTs or music tracks
2. Add Telegram Stars payment integration for premium features
3. Implement inline bot functionality for sharing music
4. Add geolocation features for local music discovery
5. Implement full-screen mode for immersive music experiences

## Resources

- [Official Telegram Bot API Documentation](https://core.telegram.org/bots/api)
- [Telegram Mini Apps Documentation](https://core.telegram.org/bots/webapps)
- [@telegram-apps/sdk Documentation](https://docs.telegram-mini-apps.com/packages/telegram-apps-sdk/2-x)
- [@telegram-apps/sdk-react Documentation](https://docs.telegram-mini-apps.com/packages/telegram-apps-sdk-react/1-x)
- [Telegram UI Components](https://github.com/Telegram-Mini-Apps/TelegramUI)
