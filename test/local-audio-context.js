"use strict";

var assert = require("power-assert");
var sinon = require("sinon");
var LocalAudioContext = require("../");

describe("LocalAudioContext", function() {
  var audioContext;
  beforeEach(function() {
    audioContext = new global.AudioContext();
  });
  describe("constructor", function() {
    describe("(audioContext: AudioContext)", function() {
      it("should be inherited from AudioContext", function() {
        var localContext = new LocalAudioContext(audioContext);

        assert(localContext instanceof LocalAudioContext);
        assert(localContext instanceof global.AudioContext);
      });
    });
  });
  describe("properties", function() {
    it("should return an audioContext's property", function() {
      var localContext = new LocalAudioContext(audioContext);
      var func = function() {};

      assert(localContext.destination === audioContext.destination);
      assert(localContext.sampleRate === audioContext.sampleRate);
      assert(localContext.currentTime === audioContext.currentTime);
      assert(localContext.listener === audioContext.listener);

      localContext.onstatechange = null;
      assert(localContext.onstatechange === audioContext.onstatechange);
      assert(audioContext.onstatechange === null);

      localContext.onstatechange = func;
      assert(localContext.onstatechange === audioContext.onstatechange);
      assert(audioContext.onstatechange === func);
    });
  });
  describe("methods", function() {
    it("should call an audioContext's method", function() {
      var localContext = new LocalAudioContext(audioContext);
      var result;

      sinon.spy(audioContext, "createBuffer");
      sinon.spy(audioContext, "createBufferSource");

      result = localContext.createBufferSource();

      assert(audioContext.createBufferSource.calledWith());
      assert(result instanceof global.AudioBufferSourceNode);

      result = localContext.createBuffer(2, 1000, 44100);

      assert(audioContext.createBuffer.calledWith(2, 1000, 44100));
      assert(result instanceof global.AudioBuffer);
    });
  });
  describe("#dispose", function() {
    describe("(): void", function() {
      it("should disconnect all nodes", function() {
        var localContext = new LocalAudioContext(audioContext);
        var osc = localContext.createOscillator();
        var amp = localContext.createGain();

        osc.start(0);
        osc.connect(amp);
        amp.connect(localContext.destination);

        assert(osc.$state === "PLAYING");
        assert(audioContext.toJSON(), {
          name: "AudioDestinationNode",
          inputs: [
            {
              name: "GainNode",
              gain: {
                value: 1,
                inputs: []
              },
              inputs: [
                {
                  name: "OscillatorNode",
                  type: "sine",
                  frequency: {
                    value: 440,
                    inputs: []
                  },
                  detune: {
                    value: 0,
                    inputs: []
                  },
                  inputs: []
                }
              ]
            }
          ]
        });

        localContext.dispose();

        assert(osc.$state === "FINISHED");
        assert(audioContext.toJSON(), {
          name: "AudioDestinationNode",
          inputs: []
        });
        assert(amp.toJSON(), {
          name: "GainNode",
          gain: {
            value: 1,
            inputs: []
          },
          inputs: []
        });
      });
    });
  });
});
