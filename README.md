# local-audio-context
[![Build Status](http://img.shields.io/travis/mohayonao/local-audio-context.svg?style=flat-square)](https://travis-ci.org/mohayonao/local-audio-context)
[![NPM Version](http://img.shields.io/npm/v/local-audio-context.svg?style=flat-square)](https://www.npmjs.org/package/local-audio-context)
[![Bower](http://img.shields.io/bower/v/local-audio-context.svg?style=flat-square)](http://bower.io/search/?q=local-audio-context)
[![License](http://img.shields.io/badge/license-MIT-brightgreen.svg?style=flat-square)](http://mohayonao.mit-license.org/)

> LocalAudioContext is able to dispose collectively of audio nodes.

## Installation

bower:
```
bower install local-audio-context
```

npm:
```
npm install local-audio-context
```

downloads:

- [local-audio-context.js](https://raw.githubusercontent.com/mohayonao/local-audio-context/master/build/local-audio-context.js)

## API

### LocalAudioContext
- `constructor(audioContext: AudioContext)`

### Instance Attributes
_Inherits properties from its parent, AudioContext._

### Instance Methods
_Inherits methods from its parent, AudioContext._

- `dispose(): void`
  - call `disconnect` and `stop` method of each audio nodes.

## Usage

```javascript
var audioContext = new AudioContext();
var localContext = new LocalAudioContext(audioContext);

var osc = localContext.createOscillator();
var amp = localContext.createGain();

osc.start(audioContext.currentTime);
osc.connect(amp);
amp.connect(audioContext.destination);

// AudioNodes are connected to the destination.
// osc(PLAYING) -> amp -> destination

localContext.dispose();

// AudioNodes are disconnected, and stop osc.
// osc(FINISHED) -//-> amp -//-> destination
```

## License
MIT
