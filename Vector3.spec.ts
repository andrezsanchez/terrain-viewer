import { AsyncTest, Expect, Test, TestCase, TestFixture } from "alsatian";
import { Vector3 } from './Vector3';

@TestFixture('Vector3')
export class TestVector3 {
  @Test('set')
  public set() {
    const p = new Vector3().set(1, 2, 3);

    Expect(p.x).toBe(1);
    Expect(p.y).toBe(2);
    Expect(p.z).toBe(3);
  }

  @Test('assignment')
  public assignment() {
    const p = new Vector3();

    p.x = 1;
    p.y = 2;
    p.z = 3;

    Expect(p.x).toBe(1);
    Expect(p.y).toBe(2);
    Expect(p.z).toBe(3);
  }

  @Test('copy')
  public copy() {
    const p = new Vector3().set(1, 2, 3)
    const q = new Vector3().copy(p);

    p.set(4, 5, 6)

    Expect(q.x).toBe(1);
    Expect(q.y).toBe(2);
    Expect(q.z).toBe(3);
  }

  @Test('dot')
  public dot() {
    const p = new Vector3().set(1, 2, 3);
    const q = new Vector3().set(4, 5, 6);

    Expect(Vector3.dot(p, q)).toBe(32);
  }

  @Test('cross')
  public cross() {
    const p = new Vector3().set(1, 2, 3);
    const q = new Vector3().set(4, 5, 6);
    const dest = new Vector3();

    Expect(Vector3.cross(dest, p, q)).toEqual(new Vector3().set(-3, 6, -3));
  }

  @Test('multiplyScalar')
  public multiplyScalar() {
    const p = new Vector3().set(1, 2, 3);
    const dest = new Vector3();
    Vector3.multiplyScalar(dest, p, 2)

    Expect(dest).toEqual(new Vector3().set(2, 4, 6));
  }

  @Test('divideScalar')
  public divideScalar() {
    const p = new Vector3().set(1, 2, 3);
    const dest = new Vector3();
    Vector3.divideScalar(dest, p, 2)

    Expect(dest).toEqual(new Vector3().set(0.5, 1, 1.5));
  }

  @Test('add')
  public add() {
    const p = new Vector3().set(1, 2, 3);
    const q = new Vector3().set(4, 5, 6);
    const dest = new Vector3();
    Vector3.add(dest, p, q);

    Expect(dest).toEqual(new Vector3().set(5, 7, 9));
  }

  @Test('subtract')
  public subtract() {
    const p = new Vector3().set(1, 2, 3);
    const q = new Vector3().set(4, 5, 6);
    const dest = new Vector3();
    Vector3.subtract(dest, p, q);

    Expect(dest).toEqual(new Vector3().set(-3, -3, -3));
  }

  @Test('magnitude2')
  public magnitude2() {
    const p = new Vector3().set(1, 2, 3);
    
    Expect(p.magnitude2()).toEqual(14);
  }

  @Test('magnitude')
  public magnitude() {
    const p = new Vector3().set(2, 2, 0);
    
    Expect(p.magnitude()).toEqual(2 * Math.sqrt(2));
  }

  @Test('normalize')
  public normalize() {
    const p = new Vector3().set(-5, 0, 0);
    const dest = new Vector3();
    Vector3.normalize(dest, p);
    
    Expect(dest).toEqual(new Vector3().set(-1, 0, 0));
  }
}
