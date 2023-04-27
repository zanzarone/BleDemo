import EventEmitter from 'eventemitter3';
const eventEmitter = new EventEmitter();
const Emitter = {
  on: (event, fn) => eventEmitter.on(event, fn),
  once: (event, fn) => eventEmitter.once(event, fn),
  off: (event, fn) => eventEmitter.off(event, fn),
  detach: (event, fn) => eventEmitter.removeAllListeners(event, fn),
  emit: (event, payload) => eventEmitter.emit(event, payload),
};
Object.freeze(Emitter);
export default Emitter;
