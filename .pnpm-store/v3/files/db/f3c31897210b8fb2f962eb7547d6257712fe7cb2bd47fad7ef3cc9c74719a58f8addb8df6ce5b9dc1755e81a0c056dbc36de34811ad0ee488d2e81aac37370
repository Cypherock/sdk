import generator from '@babel/generator';
// @ts-expect-error CJS typings not in line with synthetic esm
const generate = generator.default;
export const print = (file) => {
    return generate(file.root, { sourceMaps: false }).code;
};
//# sourceMappingURL=js-printer.js.map