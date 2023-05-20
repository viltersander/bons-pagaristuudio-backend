"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MedusaModule = void 0;
const types_1 = require("@medusajs/types");
const utils_1 = require("@medusajs/utils");
const awilix_1 = require("awilix");
const loaders_1 = require("./loaders");
const utils_2 = require("./loaders/utils");
const logger = {
    log: (a) => console.log(a),
    info: (a) => console.log(a),
    warn: (a) => console.warn(a),
    error: (a) => console.error(a),
};
class MedusaModule {
    static async bootstrap(moduleKey, defaultPath, declaration, injectedDependencies) {
        let modDeclaration = declaration;
        if (declaration?.scope !== types_1.MODULE_SCOPE.EXTERNAL) {
            modDeclaration = {
                scope: types_1.MODULE_SCOPE.INTERNAL,
                resources: types_1.MODULE_RESOURCE_TYPE.ISOLATED,
                resolve: defaultPath,
                options: declaration,
            };
        }
        const container = (0, utils_1.createMedusaContainer)();
        if (injectedDependencies) {
            for (const service in injectedDependencies) {
                container.register(service, (0, awilix_1.asValue)(injectedDependencies[service]));
            }
        }
        const moduleResolutions = (0, loaders_1.registerMedusaModule)(moduleKey, modDeclaration);
        await (0, loaders_1.moduleLoader)({ container, moduleResolutions, logger });
        const services = {};
        for (const resolution of Object.values(moduleResolutions)) {
            const keyName = resolution.definition.key;
            const registrationName = resolution.definition.registrationName;
            services[keyName] = container.resolve(registrationName);
        }
        return services;
    }
    static async migrateUp(moduleKey, modulePath, options) {
        const moduleResolutions = (0, loaders_1.registerMedusaModule)(moduleKey, {
            scope: types_1.MODULE_SCOPE.INTERNAL,
            resources: types_1.MODULE_RESOURCE_TYPE.ISOLATED,
            resolve: modulePath,
            options,
        });
        for (const mod in moduleResolutions) {
            const [migrateUp] = await (0, utils_2.loadModuleMigrations)(moduleResolutions[mod]);
            if (typeof migrateUp === "function") {
                await migrateUp({
                    options,
                    logger,
                });
            }
        }
    }
    static async migrateDown(moduleKey, modulePath, options) {
        const moduleResolutions = (0, loaders_1.registerMedusaModule)(moduleKey, {
            scope: types_1.MODULE_SCOPE.INTERNAL,
            resources: types_1.MODULE_RESOURCE_TYPE.ISOLATED,
            resolve: modulePath,
            options,
        });
        for (const mod in moduleResolutions) {
            const [, migrateDown] = await (0, utils_2.loadModuleMigrations)(moduleResolutions[mod]);
            if (typeof migrateDown === "function") {
                await migrateDown({
                    options,
                    logger,
                });
            }
        }
    }
}
exports.MedusaModule = MedusaModule;
//# sourceMappingURL=medusa-module.js.map