"use strict";

var AudioContext = global.AudioContext || global.webkitAudioContext || {};
var descriptors = {};

function LocalAudioContext(audioContext) {
  Object.defineProperties(this, descriptors);
  this.context = audioContext;
  this._nodes = [];
}
LocalAudioContext.prototype = Object.create(AudioContext.prototype, {
  constructor: { value: LocalAudioContext, enumerable: false, writable: true, configurable: true }
});

[
  // AudioContext
  "destination",
  "sampleRate",
  "currentTime",
  "listener",
  "state",
  "onstatechange",
  // OfflineAudioContext
  "oncomplete",
].forEach(function(propertyName) {
  descriptors[propertyName] = {
    get: function() {
      return this.context[propertyName];
    },
    set: function(value) {
      this.context[propertyName] = value;
    },
    enumerable: true
  };
});

[
  // AudioContext
  "suspend",
  "resume",
  "close",
  "createBuffer",
  "decodeAudioData",
  "createBufferSource",
  "createMediaElementSource",
  "createMediaStreamSource",
  "createMediaStreamDestination",
  "createAudioWorker",
  "createScriptProcessor",
  "createAnalyser",
  "createGain",
  "createDelay",
  "createBiquadFilter",
  "createWaveShaper",
  "createPanner",
  "createStereoPanner",
  "createConvolver",
  "createChannelSplitter",
  "createChannelMerger",
  "createDynamicsCompressor",
  "createOscillator",
  "createPeriodicWave",
  // OfflineAudioContext
  "startRendering",
  // EventTarget
  "addEventListener",
  "removeEventListener",
  "dispatchEvent",
  // Object
  "hasOwnProperty",
  "isPrototypeOf",
  "toString",
  "valueOf"
].forEach(function(methodName) {
  LocalAudioContext.prototype[methodName] = function() {
    var result = this.context[methodName].apply(this.context, arguments);

    if (result instanceof global.AudioNode) {
      this._nodes.push(result);
    }

    return result;
  };
});

LocalAudioContext.prototype.dispose = function() {
  this._nodes.splice(0).forEach(function(node) {
    node.disconnect();
    if (typeof node.stop === "function") {
      try {
        node.stop(this.context.currentTime);
      } catch (e) {}
    }
  }, this);
};

module.exports = LocalAudioContext;
