let Config = {
  androidClientId: process.env.GOOGLE_ANDROID_CLIENT_ID,
  iosClientId: process.env.GOOGLE_IOS_CLIENT_ID,
  expoClientId: process.env.GOOGLE_EXPO_CLIENT_ID,
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
};

// Change this to different environment variables for different environments.
if (process.env.APP_ENV === "production") {
  Config.androidClientId = process.env.GOOGLE_ANDROID_CLIENT_ID;
  Config.iosClientId = process.env.GOOGLE_IOS_CLIENT_ID;
  Config.expoClientId = process.env.GOOGLE_EXPO_CLIENT_ID;
  Config.apiKey = process.env.FIREBASE_API_KEY;
  Config.authDomain = process.env.FIREBASE_AUTH_DOMAIN;
  Config.projectId = process.env.FIREBASE_PROJECT_ID;
  Config.storageBucket = process.env.FIREBASE_STORAGE_BUCKET;
  Config.messagingSenderId = process.env.FIREBASE_SENDER_ID;
  Config.appId = process.env.FIREBASE_APP_ID;
} else if (process.env.APP_ENV === "staging") {
  Config.androidClientId = process.env.GOOGLE_ANDROID_CLIENT_ID;
  Config.iosClientId = process.env.GOOGLE_IOS_CLIENT_ID;
  Config.expoClientId = process.env.GOOGLE_EXPO_CLIENT_ID;
  Config.apiKey = process.env.FIREBASE_API_KEY;
  Config.authDomain = process.env.FIREBASE_AUTH_DOMAIN;
  Config.projectId = process.env.FIREBASE_PROJECT_ID;
  Config.storageBucket = process.env.FIREBASE_STORAGE_BUCKET;
  Config.messagingSenderId = process.env.FIREBASE_SENDER_ID;
  Config.appId = process.env.FIREBASE_APP_ID;
}

export default ({ config }) => {
  return {
    ...config,
    extra: {
      ...Config,
    },
  };
};
