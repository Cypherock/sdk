import generator from '@babel/generator';
// @ts-expect-error CJS typings not in line with synthetic esm
const generate = generator.default;
export const print = (file) => {
    return generate(file.root, {
        decoratorsBeforeExport: true,
        sourceMaps: false,
    }).code;
};
//# sourceMappingURL=ts-printer.js.map