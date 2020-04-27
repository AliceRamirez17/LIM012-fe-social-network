import {
  signIn,
  signUp,
  signOut,
} from '../src/firebase-controller.js';

// configurando firebase mock
const firebasemock = require('firebase-mock');

const mockauth = new firebasemock.MockAuthentication();
mockauth.autoFlush();

global.firebase = firebasemock.MockFirebaseSdk(
  // use null if your code does not use RTDB
  () => null,
  () => mockauth,
);

//
describe('signIn', () => {
  it('Debería poder iniciar sesión', () => {
    signIn('hola@gmail.com', '123456').then((user) => {
      expect(user.email).toBe('hola@gmail.com');
      expect(user.isAnonymous).toBe(false);
    });
  });
});

describe('signUp', () => {
  it('Debería poder crear un nuevo usuario', () => {
    signUp('hola@laboratoria.com', '123456').then((user) => {
      expect(user.email).toBe('hola@laboratoria.com');
      expect(user.isAnonymous).toBe(false);
    });
  });
});

describe('signOut', () => {
  it('Debería poder cerrar sesión', () => signOut()
    .then((user) => {
      expect(user).toBe(undefined);
    }));
});