export const PACKAGE_VERSION: string = __PACKAGE_VERSION__;

const [major, minor] = PACKAGE_VERSION.split(".");
export const DB_VERSION = `${major}.${minor}`;
