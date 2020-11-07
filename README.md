# When using scheduling.mjs

## Input

### Need two parameter

#### First : processType
|Data type|Can use|
|-|-|
|String|"FCFS", "SJF", "SRTF", "PS", "PPS", "RR"|

#### Second : programingData
|Data type|Unit|Example|
|-|-|-|
|String Array|"burst_time, arival_time, priority"|"6" , "6,3" , "6,,3" , "6,3,1"|
> burst_time is requirement.
> High priority use low number. When doesn't use priority, number is zero.

## Output

### An object have two attritubes

|Name|Array type|Unit|Description|
|-|-|-|-|
|completion_time|Number|Number|Every process completed time.|
|scheduling|Array|"id", run_time|Process run schedule.|

## Example

### Input
```
import process from './scheduling.mjs';
var result = process.schedule("FCFS", [
    "6,2",
    "2,5",
    "8,1",
    "3,0",
    "4,4"
]);
```

### Output
```
{
    completion_time: [ 17, 23, 11, 3, 21 ,
    scheduling: [
        [ '4', 3 ],
        [ '3', 8 ],
        [ '1', 6 ],
        [ '5', 4 ],
        [ '2', 2 ]
    ]
}
```