

export let ConversionController = {
	update: function* () {
		this.body = "update";
	},

	create: function* () {
		this.body = "create";
	},

	remove: function* () {
		this.body = "remove";
	},

	retrieve: function* () {
		this.body = "retrieve";
	}
}