var today = new Date();
// Using I18N toLocaleString
// console.log(today.toLocaleString('en-US'));
// console.log(today.toLocaleString('en'));
// console.log(today.toLocaleString('ja-JP'));
// console.log(today.toLocaleString('ar-SA'));
// console.log(today.toLocaleString('hi-IN'));

var result = new Intl.DateTimeFormat('en-US').format(today);
console.log(result);
