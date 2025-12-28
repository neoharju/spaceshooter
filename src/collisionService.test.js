// src/collisionService.test.js
import { describe, it, expect } from 'vitest';
import { checkCircleCollision } from './collisionService.js';

describe('Collision Detection', () => {
  it('detects collision when circles overlap', () => {
    expect(checkCircleCollision(0, 0, 10, 5, 5, 10)).toBe(true);
  });

  it('detects no collision when circles are apart', () => {
    expect(checkCircleCollision(0, 0, 10, 100, 100, 10)).toBe(false);
  });

  it('detects collision when circles touch', () => {
    expect(checkCircleCollision(0, 0, 10, 20, 0, 10)).toBe(false);
    expect(checkCircleCollision(0, 0, 10, 19, 0, 10)).toBe(true);
  });
});
