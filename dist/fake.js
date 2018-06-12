"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//import * as faker from 'faker';
var faker = require('faker');
var moment = require("moment");
function getRandomInt(min, max) {
    return faker.random.number({ min: min, max: max });
}
exports.getRandomInt = getRandomInt;
function getRandomItem(array) {
    return array[getRandomInt(0, array.length - 1)];
}
exports.getRandomItem = getRandomItem;
exports.typeFakers = {
    'Int': {
        defaultOptions: { min: 0, max: 99999 },
        generator: function (options) {
            options.precision = 1;
            return function () { return faker.random.number(options); };
        }
    },
    'Float': {
        defaultOptions: { min: 0, max: 99999, precision: 0.01 },
        generator: function (options) {
            return function () { return faker.random.number(options); };
        }
    },
    'String': {
        defaultOptions: {},
        generator: function () {
            return function () { return 'string'; };
        }
    },
    'Boolean': {
        defaultOptions: {},
        generator: function () {
            return function () { return faker.random.boolean(); };
        }
    },
    'ID': {
        defaultOptions: {},
        generator: function () {
            return function (parentType) {
                return new Buffer(parentType.name + ':' + faker.random.number({ max: 9999999999 }).toString()).toString('base64');
            };
        }
    },
};
var fakeFunctions = {
    // Address section
    zipCode: function () { return faker.address.zipCode(); },
    city: function () { return faker.address.city(); },
    // Skipped: faker.address.cityPrefix
    // Skipped: faker.address.citySuffix
    streetName: function () { return faker.address.streetName(); },
    streetAddress: {
        args: ['useFullAddress'],
        func: function (useFullAddress) { return faker.address.streetAddress(useFullAddress); },
    },
    // Skipped: faker.address.streetSuffix
    // Skipped: faker.address.streetPrefix
    secondaryAddress: function () { return faker.address.secondaryAddress(); },
    county: function () { return faker.address.county(); },
    country: function () { return faker.address.country(); },
    countryCode: function () { return faker.address.countryCode(); },
    state: function () { return faker.address.state(); },
    stateAbbr: function () { return faker.address.stateAbbr(); },
    latitude: function () { return faker.address.latitude(); },
    longitude: function () { return faker.address.longitude(); },
    // Commerce section
    colorName: function () { return faker.commerce.color(); },
    productCategory: function () { return faker.commerce.department(); },
    productName: function () { return faker.commerce.productName(); },
    money: {
        args: ['minMoney', 'maxMoney', 'decimalPlaces'],
        func: function (min, max, dec) { return faker.commerce.price(min, max, dec); },
    },
    // Skipped: faker.commerce.productAdjective
    productMaterial: function () { return faker.commerce.productMaterial(); },
    product: function () { return faker.commerce.product(); },
    // Company section
    // Skipped: faker.company.companySuffixes
    companyName: function () { return faker.company.companyName(); },
    // Skipped: faker.company.companySuffix
    companyCatchPhrase: function () { return faker.company.catchPhrase(); },
    companyBs: function () { return faker.company.bs(); },
    // Skipped: faker.company.catchPhraseAdjective
    // Skipped: faker.company.catchPhraseDescriptor
    // Skipped: faker.company.catchPhraseNoun
    // Skipped: faker.company.companyBsAdjective
    // Skipped: faker.company.companyBsBuzz
    // Skipped: faker.company.companyBsNoun
    // Database section
    dbColumn: function () { return faker.database.column(); },
    dbType: function () { return faker.database.type(); },
    dbCollation: function () { return faker.database.collation(); },
    dbEngine: function () { return faker.database.engine(); },
    // Date section
    pastDate: {
        args: ['dateFormat'],
        func: function (dateFormat) {
            var date = faker.date.past();
            return (dateFormat !== undefined ? moment(date).format(dateFormat) : date);
        }
    },
    futureDate: {
        args: ['dateFormat'],
        func: function (dateFormat) {
            var date = faker.date.future();
            return (dateFormat !== undefined ? moment(date).format(dateFormat) : date);
        }
    },
    recentDate: {
        args: ['dateFormat'],
        func: function (dateFormat) {
            var date = faker.date.recent();
            return (dateFormat !== undefined ? moment(date).format(dateFormat) : date);
        }
    },
    // Finance section
    financeAccountName: function () { return faker.finance.accountName(); },
    //TODO: investigate finance.mask
    financeTransactionType: function () { return faker.finance.transactionType(); },
    currencyCode: function () { return faker.finance.currencyCode(); },
    currencyName: function () { return faker.finance.currencyName(); },
    currencySymbol: function () { return faker.finance.currencySymbol(); },
    bitcoinAddress: function () { return faker.finance.bitcoinAddress(); },
    internationalBankAccountNumber: function () { return faker.finance.iban(); },
    bankIdentifierCode: function () { return faker.finance.bic(); },
    // Hacker section
    hackerAbbr: function () { return faker.hacker.itAbbr(); },
    hackerPhrase: function () { return faker.hacker.phrase(); },
    // Image section
    imageUrl: {
        args: ['imageHeight', 'imageWidth', 'imageCategory', 'randomizeImageUrl'],
        func: function (height, width, category, randomize) {
            return faker.image.imageUrl(height, width, category, randomize, false);
        },
    },
    // Internet section
    avatarUrl: function () { return faker.internet.avatar(); },
    email: {
        args: ['emailProvider'],
        func: function (provider) { return faker.internet.email(undefined, undefined, provider); },
    },
    url: function () { return faker.internet.url(); },
    domainName: function () { return faker.internet.domainName(); },
    ipv4Address: function () { return faker.internet.ip(); },
    ipv6Address: function () { return faker.internet.ipv6(); },
    userAgent: function () { return faker.internet.userAgent(); },
    colorHex: {
        args: ['baseColor'],
        func: function (_a) {
            var red255 = _a.red255, green255 = _a.green255, blue255 = _a.blue255;
            return faker.internet.color(red255, green255, blue255);
        },
    },
    macAddress: function () { return faker.internet.mac(); },
    password: {
        args: ['passwordLenth'],
        func: function (len) { return faker.internet.password(len); },
    },
    // Lorem section
    lorem: {
        args: ['loremSize'],
        func: function (size) { return faker.lorem[size || 'paragraphs'](); },
    },
    // Name section
    firstName: function () { return faker.name.firstName(); },
    lastName: function () { return faker.name.lastName(); },
    fullName: function () { return faker.name.findName(); },
    jobTitle: function () { return faker.name.jobTitle(); },
    // Phone section
    phoneNumber: function () { return faker.phone.phoneNumber(); },
    // Skipped: faker.phone.phoneNumberFormat
    // Skipped: faker.phone.phoneFormats
    // Random section
    uuid: function () { return faker.random.uuid(); },
    word: function () { return faker.random.word(); },
    words: function () { return faker.random.words(); },
    locale: function () { return faker.random.locale(); },
    number: function () { return faker.random.number(); },
    // System section
    // Skipped: faker.system.fileName
    // TODO: Add ext and type
    filename: function () { return faker.system.commonFileName(); },
    mimeType: function () { return faker.system.mimeType(); },
    // Skipped: faker.system.fileType
    // Skipped: faker.system.commonFileType
    // Skipped: faker.system.commonFileExt
    fileExtension: function () { return faker.system.fileExt(); },
    semver: function () { return faker.system.semver(); },
};
Object.keys(fakeFunctions).forEach(function (key) {
    var value = fakeFunctions[key];
    if (typeof fakeFunctions[key] === 'function')
        fakeFunctions[key] = { args: [], func: value };
});
function fakeValue(type, options, locale) {
    var fakeGenerator = fakeFunctions[type];
    var argNames = fakeGenerator.args;
    //TODO: add check
    var callArgs = argNames.map(function (name) { return options[name]; });
    var localeBackup = faker.locale;
    //faker.setLocale(locale || localeBackup);
    faker.locale = locale || localeBackup;
    var result = fakeGenerator.func.apply(fakeGenerator, callArgs);
    //faker.setLocale(localeBackup);
    faker.locale = localeBackup;
    return result;
}
exports.fakeValue = fakeValue;
//# sourceMappingURL=fake.js.map