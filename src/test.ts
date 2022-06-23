import { logger, logCall, logObject } from './index';
import test from 'ava';

test('log array function', (t) => {
  const m = logCall(
    (a: number, b: any) => {
      return a + b.a;
    },
    { name: 'totot', profiling: true, extra: { module: 'test' }, uuid: true }
  );
  function n(bla: string, a: number) {
    return bla + a;
  }

  t.is(m(1, { a: 2, b: { a: 4 } }), 3);
  t.is(
    m(1, (a: number) => a * 2),
    NaN
  );
  t.is(m(1, n), NaN);
});

test('log function', (t) => {
  function n(bla: string, a: number) {
    return bla + a;
  }
  const nn = logCall(n);

  t.is(n('eee', 7), 'eee7');
  t.is(nn('eee', 7), 'eee7');
});

test('log object', (t) => {
  const obj = {
    a: 4,
    b: (a: number) => a,
    c: 6,
    d: {
      a: (a: number) => a,
    },
  };

  const objl = logObject(obj, { name: 'obj' });
  t.is(objl.b(5), 5);
  t.is(objl.d.a(5), 5);

  const objll = logObject(obj, { name: 'obj2', depth: 2 });
  t.is(objll.b(5), 5);
  t.is(objll.d.a(5), 5);
});

test('log promise', async (t) => {
  const p = logCall(
    async (a: number, b: any) => {
      return a + b;
    },
    { name: 'totot', profiling: true, extra: { module: 'promise' }, uuid: true }
  );

  return p(5, 6).then((v: number) => {
    t.is(v, 11);
  });
});

test('log exception', (t) => {
  const e = logCall(
    (a: any) => {
      throw new Error('a');
    },
    { name: 'exception', profiling: true, extra: { module: 'exception test' } }
  );
  t.throws(() => e(5));
});
