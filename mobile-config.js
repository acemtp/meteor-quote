// This section sets up some basic app metadata,
// the entire section is optional.
App.info({
  id: 'com.efounders.quote',
  name: 'quote',
  description: 'Quote let you share your favorites memes you have with your friends. That simple.',
  author: 'eFounders',
  email: 'vianney@e-founders.com',
  website: 'http://efounders.co'
});

// Set up resources such as icons and launch screens.
App.icons({
  'iphone': 'resources/iOS\\Resources\\icons\\Icon-60.png',
  'iphone_2x': 'resources/iOS\\Resources\\icons\\Icon-120.png',
  'iphone_3x': 'resources/iOS\\Resources\\icons\\Icon-180@3x.png',
  'ipad': 'resources/iOS\\Resources\\icons\\Icon-76.png',
  'ipad_2x': 'resources/iOS\\Resources\\icons\\Icon-152.png',
});

App.launchScreens({
/*  'iphone': 'resources/iOS\\Resources\\splash\\Default.png',
  'iphone_2x': 'resources/iOS\\Resources\\splash\\Default@2x~iphone_640x960.png',
  'iphone5': 'resources/iOS\\Resources\\splash\\Default@2x~iphone_640x960.png',
  'iphone6': 'resources/iOS\\Resources\\splash\\Default@2x~iphone_640x960.png',
  'iphone6p_portrait': 'resources/iOS\\Resources\\splash\\Default@2x~iphone_640x960.png',
  'iphone6p_landscape': 'resources/iOS\\Resources\\splash\\Default@2x~iphone_640x960.png',
*/});

// Set PhoneGap/Cordova preferences
//App.setPreference('BackgroundColor', '0xff0000ff');
//App.setPreference('HideKeyboardFormAccessoryBar', true);

// Pass preferences for a particular PhoneGap/Cordova plugin
/*
App.configurePlugin('com.phonegap.plugins.facebookconnect', {
  APP_ID: '1234567890',
  API_KEY: 'supersecretapikey'
});
*/

App.accessRule('*');
