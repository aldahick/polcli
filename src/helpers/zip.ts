import * as yauzl from "yauzl";

export function readFile(buffer: Buffer, filename: string): Promise<string> {
    return new Promise((resolve, reject) => {
        // tslint:disable no-shadowed-variable
        yauzl.fromBuffer(buffer, (err, zip) => {
            if (err) { return reject(err); }
            zip!.on("entry", (entry: yauzl.Entry) => {
                if (entry.fileName !== filename) { return; }
                zip!.openReadStream(entry, (err, stream) => {
                    if (err) { return reject(err); }
                    stream!.setEncoding("utf-8");
                    let data = "";
                    stream!.on("data", chunk => {
                        data += (chunk as string);
                    });
                    stream!.on("end", () => {
                        resolve(data);
                    });
                });
            });
        });
    });
}
