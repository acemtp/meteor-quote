// This section sets up some basic app metadata,
// the entire section is optional.
App.info({
  id: 'com.efounders.quote',
  name: 'Quote',
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
  'iphone': 'resources/iOS\\Resources\\splash\\Default.png',
  'iphone_2x': 'resources/iOS\\Resources\\splash\\Default@2x~iphone_640x960.png',
  'iphone5': 'resources/iOS\\Resources\\splash\\Default-568h@2x~iphone_640x1136.png',
  'iphone6': 'resources/iOS\\Resources\\splash\\Default-750@2x~iphone6-portrait_750x1334.png',
  'iphone6p_portrait': 'resources/iOS\\Resources\\splash\\Default-1242@3x~iphone6s-portrait_1242x2208.png',
  'iphone6p_landscape': 'resources/iOS\\Resources\\splash\\Default-1242@3x~iphone6s-landscape_2208x1242.png',

  'ipad_portrait': 'resources/iOS\\Resources\\splash\\Default-Portrait~ipad_768x1024.png',
  'ipad_portrait_2x': 'resources/iOS\\Resources\\splash\\Default-Portrait@2x~ipad_1536x2008.png',
  'ipad_landscape': 'resources/iOS\\Resources\\splash\\Default-Landscape~ipad_1024x748.png',
  'ipad_landscape_2x': 'resources/iOS\\Resources\\splash\\Default-Landscape@2x~ipad_2048x1496.png',
});

// Set PhoneGap/Cordova preferences
//App.setPreference('BackgroundColor', '0xff0000ff');
//App.setPreference('HideKeyboardFormAccessoryBar', true);
App.setPreference('KeyboardDisplayRequiresUserAction', false);

// Pass preferences for a particular PhoneGap/Cordova plugin

App.configurePlugin('com.phonegap.plugins.facebookconnect', {
  APP_ID: '991794777511408',
  APP_NAME: 'Quote',
  API_KEY: 'c728a293995106259129694dd1bcab32'
});

App.accessRule('*');
