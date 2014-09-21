angular.module("exampleApp.Services2", [])
.config(function() {
console.log("Woo services2!");
})
.run(function (woo) {
woo.shout();
});