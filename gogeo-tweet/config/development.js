/**
 * Created by danfma on 17/03/15.
 */
var gogeo;
(function (gogeo) {
    //
    // Configurações para DESENVOLVIMENTO LOCAL
    //
    gogeo.settings = {
        // "api.url": "cluster.local.io:9090/",
        // "tile.url": "{s}.cluster.local.io:9090/",
        "api.url": "maps.demos.gogeo.io/1.0/",
        "tile.url": "{s}.demos.gogeo.io/1.0/",
        // "subdomains": [ "m01", "m02", "m03", "m04" ],
        "subdomains": [ "m01", "m02", "m03", "m04" ],
        // "collection": "transactions_2"
        "collection": "financial"
    };
})(gogeo || (gogeo = {}));
//# sourceMappingURL=development.js.map