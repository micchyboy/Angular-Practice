/*for (var i=0, len=arr.length; i<len; i++) {
 var str = arr[i];
 for (var j=1; j<3; j++)
 str += ","+arr[(i+j)%len]; // you could push to an array as well
 alert(str);
 }*/
var arr = ["A", "B", "C", "D", "E"];
/*for(var i = 0; i < arr.length; i++){
 arr = right(arr);
 }*/

/*for (var i = 0; i < arr.length; i++) {
    right(arr);
    alert(arr);
}

function right(arr) {
    var item = arr.shift();
    arr[arr.length] = item;
    return arr;
}


function left(arr) {
    var item = arr.pop();
    arr.unshift(item)
    return arr;
}*/

/*
alert(undefined > 1);

var newFilename = "filename";

function renameDuplicate(filename) {
    if (arr5.indexOf(filename) > -1) {
        console.log('File exists');
        newFilename = "Copy - " + filename;

        renameDuplicate(newFilename);

    } else {
        console.log(filename);
    }
}


var arr5 = ["filename", "Copy - filename"];
renameDuplicate(newFilename);*/

//ng-repeat lite replication
var item1 = { name: "Jet"};
var arr1 = [];
var arr2 = [];

arr1.push(item1);
arr2.push(item1);

alert(arr1[0]);
alert(arr2[0]);
arr2.splice(0);
alert(arr1[0]);
alert(arr2[0]);
