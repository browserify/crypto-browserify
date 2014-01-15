var EventEmitter = require('events').EventEmitter;

function bind(func, context) {
  var slice = Array.prototype.slice;
  if(Function.prototype.bind &&
     func.bind == Function.prototype.bind)
    return Function.prototype.bind.apply(func, slice.call(arguments, 1));

  var args = slice.call(arguments, 2);
  return function() {
    return func.apply(context, args.concat(slice.call(arguments)));
  }
}

function DocumentEvents() {
  if(typeof document === 'undefined') 
    throw 'DocumentEvents is designed to be used in a browser';

  this.emitter = new EventEmitter();
  this.onEvent = bind(this.onEvent, this);
}

DocumentEvents.prototype.on =
DocumentEvents.prototype.addListener = function(type, listener) {
  if(this.emitter.listeners(type).length == 0)
    addEvent(document, type, this.onEvent);
  this.emitter.on(type, listener);
  return this;
}

DocumentEvents.prototype.once = function(type, listener) {
  if(this.emitter.listeners(type).length == 0)
    addEvent(document, type, this.onEvent);
  this.emitter.once(type, listener);
  return this;
}

DocumentEvents.prototype.removeListener = function(type, listener) {
  this.emitter.removeListener(type, listener);
  if(this.emitter.listeners(type).length == 0)
    removeEvent(document, type, this.onEvent);
  return this;
}

DocumentEvents.prototype.removeAllListeners = function(type) {
  this.emitter.removeAllListeners(type);
  removeEvent(document, type, this.onEvent);
  return this;
}

DocumentEvents.prototype.onEvent = function(event) {
  // fix IE events
  event = event || window.event;

  // fix target property, if necessary
  if (!event.target) {
    // Fix where srcElement might not be defined either
    event.target = event.srcElement || document;
  }

  this.emitter.emit(event.type, event);
}

exports = module.exports = DocumentEvents;

// cross browser add event method
function addEvent(object, type, callback) {
  if (object.addEventListener) {
    object.addEventListener(type, callback, false);
  } else if (object.attachEvent) {
    object.attachEvent('on' + type, callback);
  } else {
    object['on' + type] = callback;
  }
}

// cross browser remove event method
function removeEvent(object, type, callback) {
  if (object.removeEventListener) {
    object.removeEventListener(type, callback, false);
  } else if (object.detachEvent) {
    object.detachEvent('on' + type, callback);
  } else {
    object['on' + type] = null;
  }
}