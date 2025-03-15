// import {
//   TextEncoder as NodeTextEncoder,
//   TextDecoder as NodeTextDecoder,
// } from 'util';

// global.TextEncoder = NodeTextEncoder as typeof TextEncoder;
// global.TextDecoder = NodeTextDecoder as typeof TextDecoder;

import {
  TextEncoder as NodeTextEncoder,
  TextDecoder as NodeTextDecoder,
} from 'util';

// Перевизначення глобальних змінних TextEncoder і TextDecoder для тестів
global.TextEncoder = NodeTextEncoder as typeof TextEncoder;
global.TextDecoder = NodeTextDecoder as typeof TextDecoder;

import fetchMock from 'jest-fetch-mock';
fetchMock.enableMocks();
