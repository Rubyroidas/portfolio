const {version: appVersion} = require('../package.json');

module.exports = development => ({
    __DEV__: String(development),
    __VER__: JSON.stringify(appVersion),
});
