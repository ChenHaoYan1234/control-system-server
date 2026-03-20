import type { ConfigType } from "./type.d.ts"
import * as fs from "fs"

let config: ConfigType | null = null;

async function load_file(path: fs.PathLike) {
    if (!fs.existsSync(path)) {
        console.error(`Config file not found: ${path}`);
        process.exit(1);
    }

    fs.readFile(path, "utf8", (err, data) => {
        if (err) {
            console.error(`Failed to read config file: ${path}: ${err}`);
            process.exit(1);
        }

        try {
            config = JSON.parse(data);
        } catch (err) {
            console.error(`Failed to parse config file: ${path}: ${err}`);
            process.exit(1);
        }
    });
}

export {
    load_file,
    config
}
