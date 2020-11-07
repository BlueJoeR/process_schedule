/* processType
 * ["FCFS", "SJF", "SRTF", "PS", "PPS", "RR"]
*/

//  SJF: https://www.guru99.com/shortest-job-first-sjf-scheduling.html

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
    return [];
 };

const SJF_SRTF = (type, data) => {
    return [];
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
    console.log("Result Data:", resultData);

    return showResultData(convertedData.length, resultData);
};

export default  {
    schedule
}