module.exports = {
  pwa: {
    name: 'Trello Boildown',
    themeColor: '#4DBA87',
    msTileColor: '#000000',
    appleMobileWebAppCapable: 'yes',
    appleMobileWebAppStatusBarStyle: 'black',

    // configure the workbox plugin
    /* No idea how to configure. Choosing more simple method below
    workboxPluginMode: 'InjectManifest',
    workboxOptions: {
      // swSrc is required in InjectManifest mode.
      swSrc: 'dev/sw.js',
      // ...other Workbox options...
    }
    */
    workboxPluginMode: 'GenerateSW'
  }
}
