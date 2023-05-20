"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DbAwareColumn = exports.resolveDbGenerationStrategy = exports.resolveDbType = void 0;
var path_1 = __importDefault(require("path"));
var typeorm_1 = require("typeorm");
var get_config_file_1 = __importDefault(require("./get-config-file"));
var pgSqliteTypeMapping = {
    increment: "rowid",
    timestamptz: "datetime",
    jsonb: "simple-json",
    enum: "text",
};
var pgSqliteGenerationMapping = {
    increment: "rowid",
};
var dbType;
function resolveDbType(pgSqlType) {
    var _a;
    if (!dbType) {
        var configModule = (0, get_config_file_1.default)(path_1.default.resolve("."), "medusa-config").configModule;
        dbType = ((_a = configModule === null || configModule === void 0 ? void 0 : configModule.projectConfig) === null || _a === void 0 ? void 0 : _a.database_type) || "postgres";
    }
    if (dbType === "sqlite" && pgSqlType in pgSqliteTypeMapping) {
        return pgSqliteTypeMapping[pgSqlType.toString()];
    }
    return pgSqlType;
}
exports.resolveDbType = resolveDbType;
function resolveDbGenerationStrategy(pgSqlType) {
    var _a;
    if (!dbType) {
        var configModule = (0, get_config_file_1.default)(path_1.default.resolve("."), "medusa-config").configModule;
        dbType = ((_a = configModule === null || configModule === void 0 ? void 0 : configModule.projectConfig) === null || _a === void 0 ? void 0 : _a.database_type) || "postgres";
    }
    if (dbType === "sqlite" && pgSqlType in pgSqliteTypeMapping) {
        return pgSqliteGenerationMapping[pgSqlType];
    }
    return pgSqlType;
}
exports.resolveDbGenerationStrategy = resolveDbGenerationStrategy;
function DbAwareColumn(columnOptions) {
    var pre = columnOptions.type;
    if (columnOptions.type) {
        columnOptions.type = resolveDbType(columnOptions.type);
    }
    if (pre === "jsonb" && pre !== columnOptions.type) {
        if ("default" in columnOptions) {
            columnOptions.default = JSON.stringify(columnOptions.default);
        }
    }
    return (0, typeorm_1.Column)(columnOptions);
}
exports.DbAwareColumn = DbAwareColumn;
//# sourceMappingURL=db-aware-column.js.map