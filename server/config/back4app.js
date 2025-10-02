import Parse from 'parse/node.js';

const initializeParse = () => {
  try {
    if (!process.env.BACK4APP_APPLICATION_ID || !process.env.BACK4APP_JAVASCRIPT_KEY || !process.env.BACK4APP_SERVER_URL) {
      console.warn('Back4App environment variables not found');
      return false;
    }

    Parse.initialize(
      process.env.BACK4APP_APPLICATION_ID,
      process.env.BACK4APP_JAVASCRIPT_KEY
    );
    
    Parse.serverURL = process.env.BACK4APP_SERVER_URL;
    
    console.log('Back4App initialized successfully');
    return true;
  } catch (error) {
    console.error('Error initializing Back4App:', error.message);
    return false;
  }
};

export default initializeParse;
export { Parse };