// Monitor authentication flow script
// This script monitors the authentication flow for debugging purposes

// Configuration
const MONITOR_CONFIG = {
  INTERVAL: 5000, // 5 seconds
  MAX_LOGS: 100,
  ENABLE_FILE_LOGGING: false,
  SHOW_DETAILED_STATS: true
};

// Monitor state
const monitorState = {
  logs: [],
  stats: {
    totalAuthAttempts: 0,
    successfulAuths: 0,
    failedAuths: 0,
    avgResponseTime: 0
  },
  startTime: Date.now()
};

// Monitor logger
class MonitorLogger {
  constructor(state, config) {
    this.state = state;
    this.config = config;
  }
  
  log(event, data) {
    const logEntry = {
      timestamp: Date.now(),
      event: event,
      data: data
    };
    
    // Add to logs
    this.state.logs.push(logEntry);
    
    // Limit log size
    if (this.state.logs.length > this.config.MAX_LOGS) {
      this.state.logs.shift();
    }
    
    // Log to console
    console.log(`[${new Date(logEntry.timestamp).toISOString()}] ${event}`, data);
  }
  
  updateStats(statsUpdate) {
    Object.assign(this.state.stats, statsUpdate);
    
    if (this.config.SHOW_DETAILED_STATS) {
      console.log('Updated stats:', this.state.stats);
    }
  }
}

// Initialize logger
const monitorLogger = new MonitorLogger(monitorState, MONITOR_CONFIG);

// Mock authentication service
class MockAuthService {
  async authenticate(userData) {
    monitorLogger.log('AUTH_ATTEMPT', { userId: userData.id });
    monitorState.stats.totalAuthAttempts++;
    
    const startTime = Date.now();
    
    try {
      // Simulate authentication process
      const result = await this.simulateAuthProcess(userData);
      const responseTime = Date.now() - startTime;
      
      if (result.success) {
        monitorState.stats.successfulAuths++;
        monitorLogger.log('AUTH_SUCCESS', { 
          userId: userData.id, 
          responseTime: responseTime 
        });
      } else {
        monitorState.stats.failedAuths++;
        monitorLogger.log('AUTH_FAILURE', { 
          userId: userData.id, 
          error: result.error,
          responseTime: responseTime
        });
      }
      
      // Update average response time
      this.updateAvgResponseTime(responseTime);
      
      return result;
    } catch (error) {
      monitorState.stats.failedAuths++;
      const responseTime = Date.now() - startTime;
      
      monitorLogger.log('AUTH_ERROR', { 
        userId: userData.id, 
        error: error.message,
        responseTime: responseTime
      });
      
      this.updateAvgResponseTime(responseTime);
      
      throw error;
    }
  }
  
  async simulateAuthProcess(userData) {
    // Simulate network delay
    const delay = Math.random() * 1000 + 200; // 200-1200ms
    
    return new Promise(resolve => {
      setTimeout(() => {
        // Simulate success/failure
        const isSuccess = Math.random() > 0.2; // 80% success rate
        
        if (isSuccess) {
          resolve({
            success: true,
            user: {
              id: userData.id,
              name: `${userData.firstName} ${userData.lastName}`,
              username: userData.username
            },
            token: `mock_token_${userData.id}_${Date.now()}`
          });
        } else {
          resolve({
            success: false,
            error: 'Authentication failed'
          });
        }
      }, delay);
    });
  }
  
  updateAvgResponseTime(newTime) {
    const currentAvg = monitorState.stats.avgResponseTime;
    const total = monitorState.stats.totalAuthAttempts;
    
    monitorState.stats.avgResponseTime = 
      ((currentAvg * (total - 1)) + newTime) / total;
  }
}

// Monitor function
async function monitorAuthFlow() {
  const authService = new MockAuthService();
  
  // Mock user data
  const mockUsers = [
    { id: '1', firstName: 'John', lastName: 'Doe', username: 'johndoe' },
    { id: '2', firstName: 'Jane', lastName: 'Smith', username: 'janesmith' },
    { id: '3', firstName: 'Bob', lastName: 'Johnson', username: 'bobjohnson' }
  ];
  
  console.log('Starting authentication flow monitoring...');
  
  // Run monitoring loop
  setInterval(async () => {
    // Select random user
    const randomUser = mockUsers[Math.floor(Math.random() * mockUsers.length)];
    
    try {
      await authService.authenticate(randomUser);
    } catch (error) {
      monitorLogger.log('MONITOR_ERROR', { error: error.message });
    }
    
    // Show summary every 10 iterations
    if (monitorState.stats.totalAuthAttempts % 10 === 0) {
      showSummary();
    }
  }, MONITOR_CONFIG.INTERVAL);
}

function showSummary() {
  const uptime = Date.now() - monitorState.startTime;
  const uptimeMinutes = Math.floor(uptime / 60000);
  
  console.log('\n=== AUTHENTICATION MONITOR SUMMARY ===');
  console.log(`Uptime: ${uptimeMinutes} minutes`);
  console.log(`Total attempts: ${monitorState.stats.totalAuthAttempts}`);
  console.log(`Successful: ${monitorState.stats.successfulAuths}`);
  console.log(`Failed: ${monitorState.stats.failedAuths}`);
  console.log(`Success rate: ${((monitorState.stats.successfulAuths / monitorState.stats.totalAuthAttempts) * 100).toFixed(2)}%`);
  console.log(`Average response time: ${monitorState.stats.avgResponseTime.toFixed(2)}ms`);
  console.log('=====================================\n');
}

// Start monitoring
monitorAuthFlow();