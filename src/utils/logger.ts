export class Logger {
  private static logs: LogEntry[] = [];

  static log(level: 'info' | 'warn' | 'error', message: string, data?: any) {
    const logEntry: LogEntry = {
      timestamp: new Date(),
      level,
      message,
      data: data ? JSON.stringify(data) : undefined
    };
    
    this.logs.push(logEntry);
    console.log(`[${level.toUpperCase()}] ${message}`, data || '');
  }

  static info(message: string, data?: any) {
    this.log('info', message, data);
  }

  static warn(message: string, data?: any) {
    this.log('warn', message, data);
  }

  static error(message: string, data?: any) {
    this.log('error', message, data);
  }

  static getLogs(): LogEntry[] {
    return [...this.logs];
  }
}

interface LogEntry {
  timestamp: Date;
  level: 'info' | 'warn' | 'error';
  message: string;
  data?: string;
}
