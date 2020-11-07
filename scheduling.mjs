/* processType
 * ["FCFS", "SJF", "SRTF", "PS", "PPS", "RR"]
*/

/* programingData
 * Data Type : String Array
 * Unit: "burst_time, arival_time, priority"
 *
 *  burst_time is requirement.
 *  High priority use low number. When doesn't use priority, number is zero.
 *
 *  EX: "6"  "6,3"  "6,,3"  "6,3,1"
*/

/*  Output Object
 *  {
 *     completion_time:[],
 *     scheduling:[]
 *  }
 *  completion_time: Number Array
 *  scheduling: Two Dimensional Array
 *
 * Unit of scheduling: [ "id", run_time ]
*/

const RR_time_length = 5;

const showResultData = (processNumber, result) => {
    var completionTime = [];
    var scheduling = [];
    for ( let i = 0 ;  i < processNumber  ; ++i ) {
        completionTime.push(0);
    }

    var totalTime = 0;
    var runProcess = 0;
    var runTime = 0;
    result.forEach(process => {
        if ( process  != runProcess )  {
            if ( runTime ) {
                scheduling.push([runProcess+'', runTime]);
                runTime = 0;
            }
            if ( runProcess ) {
                completionTime[runProcess-1] = totalTime;
            }
            runProcess = process;
        }
        ++runTime;
        ++totalTime;
    });
    return {
        'completion_time': completionTime,
        scheduling
    };
};

const PS_PPS = (type, data) => {
    var result = [];

    let checkPriority = (f,b) => {
        if ( !f || !b ) {
            return b - f;
        }
        return f - b;
    };

    // Set an arrive queue for check next prcess
    var queue = data.map((e,i) => [i,e[1],e[2]]).sort((f,b) => checkPriority(f[2], b[2])).sort((f,b) => f[1]-b[1]).map(e => e[0]);
    // console.log("Queue:", queue);
    var queueWall = -1;

     var nowProcess = -1;
    var nowTime = 0;

    var done = false;
    while ( !done ) {
        done = true;

        var runTime = 0;
        // Find next exercise process
        if ( nowProcess == -1 ) {
            var priority = 0;
            if ( queueWall < queue.length-1 ) {
                done = false;
                // PS
                queue.forEach((process_index, index) => {
                    if ( data[process_index][1] <= nowTime ) {
                        if ( index > queueWall ) {
                            queueWall = index;
                        }
                        if ( data[process_index][0] && (!runTime || checkPriority(priority, data[process_index][2]) > 0 ) ) {
                            priority = data[process_index][2];
                            nowProcess = process_index;
                            runTime = data[process_index][0];
                        }
                    }
                });
                // PPS
                if ( type && queueWall != queue.length-1 ) {
                    runTime = data[queue[queueWall+1]][1] - nowTime;
                }
            } else {
                data.forEach((process, index) => {
                    if ( process[0] ) {
                        done = false;
                        if ( !runTime || checkPriority(priority, process[2]) > 0 ) {
                            priority = process[2];
                            nowProcess = index;
                            runTime = process[0];
                        }
                    }
                });
            }
        }

        //  Exercise process
        if ( nowProcess == -1 ) {
            result.push( nowProcess+1 );
            ++nowTime;
        } else {
            for ( let i = 0 ; i < runTime ; ++i ) {
                result.push( nowProcess+1 );
                ++nowTime;
                if ( --data[nowProcess][0] == 0 ) {
                    break;
                }
            }
            nowProcess = -1;
        }
    }

    return result;
 };

const SJF_SRTF = (type, data) => {
     var result = [];

    // Set an arrive queue for check next prcess
    var queue = data.map((e,i) => [i,e[0],e[1]]).sort((f,b) => f[1]-b[1]).sort((f,b) => f[2]-b[2]).map(e => e[0]);
    // console.log("Queue:", queue);
    var queueWall = -1;

     var nowProcess = -1;
    var nowTime = 0;

    var done = false;
    while ( !done ) {
        done = true;

        var runTime = 0;
        // Find next exercise process
        if ( nowProcess == -1 ) {
            if ( queueWall < queue.length-1 ) {
                done = false;
                // SJF
                queue.forEach((process_index, index) => {
                    if ( data[process_index][1] <= nowTime ) {
                        if ( index > queueWall ) {
                            queueWall = index;
                        }
                        if ( data[process_index][0] && (!runTime || runTime > data[process_index][0]) ) {
                            nowProcess = process_index;
                            runTime = data[process_index][0];
                        }
                    }
                });
                // SRTF
                if ( type && queueWall != queue.length-1 ) {
                    runTime = data[queue[queueWall+1]][1] - nowTime;
                }
            } else {
                data.forEach((process, index) => {
                    if ( process[0] ) {
                        done = false;
                        if ( !runTime || runTime > process[0] || (runTime == process[0] && queue.indexOf(nowProcess) > queue.indexOf(index)) ) {
                            nowProcess = index;
                            runTime = process[0];
                        }
                    }
                });
            }
        }

        //  Exercise process
        if ( nowProcess == -1 ) {
            result.push( nowProcess+1 );
            ++nowTime;
        } else {
            for ( let i = 0 ; i < runTime ; ++i ) {
                result.push( nowProcess+1 );
                ++nowTime;
                if ( --data[nowProcess][0] == 0 ) {
                    break;
                }
            }
            nowProcess = -1;
        }
    }

    return result;
};

const FCFS_RR = (type, data) => {
    var result = [];

    // Set an arrive queue for check next prcess
    var queue = data.map((e,i) => [i,e[1]]).sort((f,b) => f[1]-b[1]).map(e => e[0]);
    // console.log("Queue:", queue);
    var queueWall = -1;

    var nowProcess = -1;
    var nowTime = 0;

    var done = false;
    while ( !done ) {
        done = true;

        // Find next exercise process
        if ( nowProcess == -1 ) {
            let next = queueWall + 1;
            if ( type ) {
                // RR
                while ( true ) {
                    next %= queue.length;
                    if ( data[queue[next]][0] >0 && data[queue[next]][1] <= nowTime ) {
                        done = false;
                        queueWall = next;
                        nowProcess = queue[next];
                        break;
                    }
                    if ( next == queueWall ) {
                        data.forEach(process => {
                            if ( process[0] ) {
                                done = false;
                            }
                        });
                        break;
                    }
                    ++next;
                }
            } else {
                // FCFS
                if ( next < queue.length ) {
                    done = false;
                    if ( data[queue[next]][1] <= nowTime ) {
                        queueWall = next;
                        nowProcess = queue[next];
                    }
                }
            }
        }

        //  Exercise process
        if ( nowProcess == -1 ) {
            result.push( nowProcess+1 );
            ++nowTime;
        } else {
            let runTime = (type ? RR_time_length : data[nowProcess][0]);
            for ( let i = 0 ; i < runTime ; ++i ) {
                result.push( nowProcess+1 );
                ++nowTime;
                if ( --data[nowProcess][0] == 0 ) {
                    break;
                }
            }
            nowProcess = -1;
        }
    }
    return result;
};

const scheduling = (processType, processData) => {
    switch (processType) {
        case "SJF":
            return SJF_SRTF(0,processData);
        case "SRTF":
            return SJF_SRTF(1,processData);
        case "PS":
            return PS_PPS(0,processData);
        case "PPS":
            return PS_PPS(1,processData);
        case "RR":
            return FCFS_RR(1,processData);

        default:
            return FCFS_RR(0,processData);
    }
};

const dataFormat = programingData => {
    var data = [];
    programingData.forEach(process => {
        var unitProcess = [];
        process.split(',').forEach(element => {
            if ( !element ) {
                unitProcess.push( 0 );
            } else {
                unitProcess.push( element*1 );
            }
        });
        if ( unitProcess.length == 1 ) {
            unitProcess.push( 0 );
        }
        if ( unitProcess.length == 2 ) {
            unitProcess.push( 0 );
        }
        data.push(unitProcess);
    });
    return data;
}

const schedule = (processType, programingData) => {
    var convertedData = dataFormat(programingData);
    console.log("Converted Data:", convertedData);
    var resultData = scheduling(processType, convertedData);
    // console.log("Result Data:", resultData);

    return showResultData(convertedData.length, resultData);
};

export default  {
    schedule
}