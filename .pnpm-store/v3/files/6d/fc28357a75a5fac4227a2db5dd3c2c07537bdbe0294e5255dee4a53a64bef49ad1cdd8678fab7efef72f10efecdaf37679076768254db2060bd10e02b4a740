import path from 'path';
import { createReadStream, createWriteStream, promises as fs } from 'fs';
import mkdirp from 'mkdirp';
export const reporterUtil = {
    copyFile(fromFilename, toFilename) {
        return new Promise((resolve, reject) => {
            const readStream = createReadStream(fromFilename);
            const writeStream = createWriteStream(toFilename);
            readStream.on('error', reject);
            writeStream.on('error', reject);
            readStream.pipe(writeStream);
            readStream.on('end', resolve);
        });
    },
    mkdir: mkdirp,
    async writeFile(fileName, content) {
        await mkdirp(path.dirname(fileName));
        await fs.writeFile(fileName, content, 'utf8');
    },
};
//# sourceMappingURL=reporter-util.js.map