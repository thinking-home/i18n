import { compileTemplate } from '../src';

it('проверка шаблонизации', () => {
    const t = compileTemplate('У меня { appleCount } яблок и {pieCount} пирог');

    const str = t({ appleCount: 12, pieCount: 21 }).join('');

    expect(str).toEqual('У меня 12 яблок и 21 пирог')
});
