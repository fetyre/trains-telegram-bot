"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
function config() {
    return {
        port: parseInt(process.env.PORT, 10),
        tgKey: process.env.TG_KEY,
        databaseUrl: process.env.DATABASE_URL
    };
}
exports.config = config;
//# sourceMappingURL=index.js.map