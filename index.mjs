import process from './scheduling.mjs';
var result;

result = process.schedule("FCFS", [
    "6,2",
    "2,5",
    "8,1",
    "3,0",
    "4,4"
]);
console.log( "FCFS:", result );

result = process.schedule("RR", [
    "6,2",
    "2,5",
    "8,1",
    "3,0",
    "4,4"
]);
console.log( "RR:", result );