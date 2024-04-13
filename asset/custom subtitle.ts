function pad(num:number){
    return num.toString().padStart(2,'0')
}

function parseTime(timeInSec:number){
    const hoursAndMinutes=Math.floor(timeInSec/60);
    const hours=Math.floor(hoursAndMinutes/60);
    const minutes=hoursAndMinutes%60;
    const seconds=timeInSec%60;
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)},000`
}

function line(timeInSec:number){
    return `${timeInSec+1}
${parseTime(timeInSec)} --> ${parseTime(timeInSec+1)}
Custom captions on ${parseTime(timeInSec)}

`
}

for(let i=0;i<10000;i++)console.log(line(i))