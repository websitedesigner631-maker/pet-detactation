import { EventEmitter } from 'events';

// This is a global event emitter for handling specific errors.
// It is used in development to surface rich error information
// for things like Firestore permission errors.
export const errorEmitter = new EventEmitter();
