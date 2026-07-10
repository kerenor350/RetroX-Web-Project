const fs = require("fs");
const path = require("path");

const LOG_DIR = path.join(__dirname, "..", "logs");
const LOG_FILE = path.join(LOG_DIR, "app.log");

if (!fs.existsSync(LOG_DIR)) {
    fs.mkdirSync(LOG_DIR, { recursive: true });
}

function formatMeta(meta) {

    if (!meta) {
        return "";
    }

    if (meta instanceof Error) {
        return meta.stack || meta.message;
    }

    return typeof meta === "string" ? meta : JSON.stringify(meta);

}

function writeLog(level, message, meta) {

    const timestamp = new Date().toISOString();
    const detail = formatMeta(meta);
    const line = detail
        ? `[${timestamp}] [${level.toUpperCase()}] ${message} | ${detail}`
        : `[${timestamp}] [${level.toUpperCase()}] ${message}`;

    if (level === "error") {
        console.error(line);
    } else if (level === "warn") {
        console.warn(line);
    } else {
        console.log(line);
    }

    fs.appendFileSync(LOG_FILE, `${line}\n`, "utf8");

}

module.exports = {

    info(message, meta) {
        writeLog("info", message, meta);
    },

    warn(message, meta) {
        writeLog("warn", message, meta);
    },

    error(message, meta) {
        writeLog("error", message, meta);
    }

};
