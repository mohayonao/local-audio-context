(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
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

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}]},{},[1]);
