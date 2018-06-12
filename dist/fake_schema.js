"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var graphql_1 = require("graphql");
var fake_1 = require("./fake");
var stdTypeNames = Object.keys(fake_1.typeFakers);
function astToJSON(ast) {
    switch (ast.kind) {
        case graphql_1.Kind.NULL:
            return null;
        case graphql_1.Kind.INT:
            return parseInt(ast.value, 10);
        case graphql_1.Kind.FLOAT:
            return parseFloat(ast.value);
        case graphql_1.Kind.STRING:
        case graphql_1.Kind.BOOLEAN:
            return ast.value;
        case graphql_1.Kind.LIST:
            return ast.values.map(astToJSON);
        case graphql_1.Kind.OBJECT:
            return ast.fields.reduce(function (object, _a) {
                var name = _a.name, value = _a.value;
                object[name.value] = astToJSON(value);
                return object;
            }, {});
    }
}
function fakeSchema(schema) {
    var mutationType = schema.getMutationType();
    var jsonType = schema.getTypeMap()['examples__JSON'];
    jsonType['parseLiteral'] = astToJSON;
    for (var _i = 0, _a = Object.values(schema.getTypeMap()); _i < _a.length; _i++) {
        var type = _a[_i];
        if (type instanceof graphql_1.GraphQLScalarType && !stdTypeNames.includes(type.name)) {
            type.serialize = (function (value) { return value; });
            type.parseLiteral = astToJSON;
            type.parseValue = (function (x) { return x; });
        }
        if (type instanceof graphql_1.GraphQLObjectType && !type.name.startsWith('__'))
            addFakeProperties(type);
        if (graphql_1.isAbstractType(type))
            type.resolveType = (function (obj) { return obj.__typename; });
    }
    ;
    function addFakeProperties(objectType) {
        var isMutation = (objectType === mutationType);
        for (var _i = 0, _a = Object.values(objectType.getFields()); _i < _a.length; _i++) {
            var field = _a[_i];
            if (isMutation && isRelayMutation(field))
                field.resolve = getRelayMutationResolver();
            else
                field.resolve = getFieldResolver(field, objectType);
        }
    }
    function isRelayMutation(field) {
        var args = field.args;
        if (args.length !== 1 || args[0].name !== 'input')
            return false;
        var inputType = args[0].type;
        // TODO: check presence of 'clientMutationId'
        return (inputType instanceof graphql_1.GraphQLNonNull &&
            inputType.ofType instanceof graphql_1.GraphQLInputObjectType &&
            field.type instanceof graphql_1.GraphQLObjectType);
    }
    function getFieldResolver(field, objectType) {
        var fakeResolver = getResolver(field.type, field);
        return function (source, _0, _1, info) {
            if (source && source.$example && source[field.name]) {
                return source[field.name];
            }
            var value = getCurrentSourceProperty(source, info.path);
            return (value !== undefined) ? value : fakeResolver(objectType);
        };
    }
    function getRelayMutationResolver() {
        return function (source, args, _1, info) {
            var value = getCurrentSourceProperty(source, info.path);
            if (value instanceof Error)
                return value;
            return __assign({}, args['input'], value);
        };
    }
    // get value or Error instance injected by the proxy
    function getCurrentSourceProperty(source, path) {
        return source && source[path.key];
    }
    function getResolver(type, field) {
        if (type instanceof graphql_1.GraphQLNonNull)
            return getResolver(type.ofType, field);
        if (type instanceof graphql_1.GraphQLList)
            return arrayResolver(getResolver(type.ofType, field));
        if (graphql_1.isAbstractType(type))
            return abstractTypeResolver(type);
        return fieldResolver(type, field);
    }
    function abstractTypeResolver(type) {
        var possibleTypes = schema.getPossibleTypes(type);
        return function () { return ({ __typename: fake_1.getRandomItem(possibleTypes) }); };
    }
}
exports.fakeSchema = fakeSchema;
function fieldResolver(type, field) {
    var directiveToArgs = __assign({}, getFakeDirectives(type), getFakeDirectives(field));
    var fake = directiveToArgs.fake, examples = directiveToArgs.examples;
    if (graphql_1.isLeafType(type)) {
        if (examples)
            return function () { return fake_1.getRandomItem(examples.values); };
        if (fake) {
            return function () { return fake_1.fakeValue(fake.type, fake.options, fake.locale); };
        }
        return getLeafResolver(type);
    }
    else {
        // TODO: error on fake directive
        if (examples) {
            return function () { return (__assign({}, fake_1.getRandomItem(examples.values), { $example: true })); };
        }
        return function () { return ({}); };
    }
}
function arrayResolver(itemResolver) {
    return function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var length = fake_1.getRandomInt(2, 4);
        var result = [];
        while (length-- !== 0)
            result.push(itemResolver.apply(void 0, args));
        return result;
    };
}
function getFakeDirectives(object) {
    var directives = object['appliedDirectives'];
    if (!directives)
        return {};
    var result = {};
    if (directives.isApplied('fake'))
        result.fake = directives.getDirectiveArgs('fake');
    if (directives.isApplied('examples'))
        result.examples = directives.getDirectiveArgs('examples');
    return result;
}
function getLeafResolver(type) {
    if (type instanceof graphql_1.GraphQLEnumType) {
        var values_1 = type.getValues().map(function (x) { return x.value; });
        return function () { return fake_1.getRandomItem(values_1); };
    }
    var typeFaker = fake_1.typeFakers[type.name];
    if (typeFaker)
        return typeFaker.generator(typeFaker.defaultOptions);
    else
        return function () { return "<" + type.name + ">"; };
}
//# sourceMappingURL=fake_schema.js.map