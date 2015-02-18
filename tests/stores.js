var JsonStore = require("../lib/store/JsonStore");



exports.testJsonStore = function(test) {
	var store = new JsonStore("../tmp/tests.json");
	store.save("toto", "titi");
	store.save("tutu", "tata");
	test.ok(store.get("toto")=="titi");
	test.ok(store.get("tutu")=="tata");
	store.remove("toto");
	test.ok(!store.get("toto"));
	test.done();
}
