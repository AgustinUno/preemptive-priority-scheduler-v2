var nOfprcs = 4
let prevNOfprcs = 0
let round = 0
let endmsTime = 0;
var prcsHold = document.getElementById('prcsInput').value
//decrements the input value
const chart = document.querySelector('#chart-section')
const gtitle = document.querySelector('#gantTitle')
var showGantt = document.getElementById("gantt-chart");
var showSolutions = document.getElementById("solutions");


//global declarations
let input2 = 0
let input3 = 0
let input4 = 0
let process = [
  (Prcsname = 0),
  (arrivalTime = -1),
  (burstTime = -1),
  (priority = -1)
]
let gantt = []

createTable()

//checks if the input is in range of 4 - 8
function decrement() {
  if (prcsHold > 4) {
    prcsHold--
  }

  document.getElementById('prcsInput').value = prcsHold
}
//inrements the input value
function increment() {
  if (prcsHold < 8) {
    prcsHold++
  }

  document.getElementById('prcsInput').value = prcsHold
}
//selects the input as number of process
function confirm() {
  nOfprcs = prcsHold
  showGantt.style.display = 'none'
  showSolutions.style.display = 'none'
  createTable()
}

function createTable() {
  const table = document.querySelector('#prcsTbl')

  // Clear previous table content
  table.innerHTML = ''
  chart.innerHTML = ''
  gtitle.innerHTML = ''

  // Create the header row
  let headerRow = document.createElement('tr')
  headerRow.innerHTML =
    "<th id='prh'>Process</th><th id='ah'>Arrival Time</th><th id='bth'>Burst Time</th><th id='ph'>Priority</th>"

  // Append the header row to the table
  document.getElementById('prcsTbl').appendChild(headerRow)

  // Assuming nOfprcs is the number of processes
  for (let x = 0; x < nOfprcs; x++) {
    // Creating a new table row
    let newRow = document.createElement('tr')
    newRow.id = 'pr' + (x + 1)
    newRow.classList.add('morphing-row')
    // newRow.classList.add("fadeIn");

    // Creating cells for the row
    let cell1 = document.createElement('td')
    let cell2 = document.createElement('td')
    let cell3 = document.createElement('td')
    let cell4 = document.createElement('td')

    cell1.textContent = 'P' + (x + 1)

    // Creating input fields for each cell
    input2 = document.createElement('input')
    input3 = document.createElement('input')
    input4 = document.createElement('input')

    // Set input attributes
    input2.type = 'number'
    input2.id = 'arTime' + (x + 1)
    input2.value = ''
    input3.type = 'number'
    input3.id = 'brsTime' + (x + 1)
    input3.value = ''
    input4.type = 'number'
    input4.id = 'prio' + (x + 1)
    input4.value = ''

    // Set input placeholders

    input2.placeholder = '0'
    input3.placeholder = '0'
    input4.placeholder = '0'

    // Appending cells to the row
    newRow.appendChild(cell1)
    newRow.appendChild(cell2)
    newRow.appendChild(cell3)
    newRow.appendChild(cell4)

    // Append input fields to the cells
    cell2.appendChild(input2)
    cell3.appendChild(input3)
    cell4.appendChild(input4)

    // Appending the new row to the table
    document.getElementById('prcsTbl').appendChild(newRow)
    prevNOfprcs = nOfprcs
  }

  document.getElementById('submit').innerHTML =
    "<button id='cmpte' onClick=fetch()>Solve</button>"
}

function fetch() {
  showGantt.style.display = 'none'
  showSolutions.style.display = 'none'


  let incProcess = 0
  //receives the given
  process = [] //resets array every compute
  CheckProcess = [] //resets array every

  for (let x = 0; x < nOfprcs; x++) {
    let arrivalTime = document.getElementById('arTime' + (x + 1)).value
    let burstTime = document.getElementById('brsTime' + (x + 1)).value
    let priority = document.getElementById('prio' + (x + 1)).value

    if (arrivalTime != '' && burstTime != '' && priority != '') {
      incProcess++
    }
  }

  if (incProcess == nOfprcs) {
    for (let x = 0; x < nOfprcs; x++) {
      process.push({
        Prcsname: x + 1,
        arrivalTime: +document.getElementById('arTime' + (x + 1)).value,
        burstTime: +document.getElementById('brsTime' + (x + 1)).value,
        priority: +document.getElementById('prio' + (x + 1)).value,
        startTime: 0,
        endTime: 0,
        remainingBurstTime: document.getElementById('brsTime' + (x + 1)).value,
        round: 0,
        stopTime: [0],
        nxtStartTime: [0],
        ganttRound: 0
      })
    }

    console.log('compute')
    compute()
  }
}

function compute() {
  let num = 0
  let completed = 0
  let currentTime = 0
  let prevIndex = 0
  let stopInc = 0
  let stopRound = 0
  let startInc = 0
  let startRound = 0

  while (completed < nOfprcs) {
    let highestPrioIndex = 0
    let holdPriority = 99999
    let holdArrival = 0

    for (let x = 0; x < nOfprcs; x++) {
      if (
        process[x].arrivalTime <= currentTime &&
        process[x].remainingBurstTime > 0 &&
        process[x].priority < holdPriority
      ) {
        //to hold the current priority
        holdPriority = process[x].priority
        holdArrival = process[x].arrivalTime
        //to hold the index of the highest priority
        highestPrioIndex = x
      } else if (
        process[x].arrivalTime <= currentTime &&
        process[x].remainingBurstTime > 0 &&
        process[x].priority == holdPriority
      ) {
        if (process[x].arrivalTime < holdArrival) {
          highestPrioIndex = x
        }
      }
      console.log('x=' + x)
    }

    //checking if process arrived in time, finding the highest priority
    for (let i = 0; i < nOfprcs; i++) {
      if (
        process[i].arrivalTime <= currentTime &&
        process[i].remainingBurstTime > 0 &&
        process[i].priority < holdPriority
      ) {
        //to hold the current priority
        holdPriority = process[i].priority
        holdArrival = process[i].arrivalTime
        //to hold the index of the highest priority
        highestPrioIndex = i
      } else if (
        process[i].arrivalTime <= currentTime &&
        process[i].remainingBurstTime > 0 &&
        process[i].priority == holdPriority
      ) {
        if (process[i].arrivalTime < holdArrival) {
          highestPrioIndex = i
        }
      }
    }

    //condition to collect the the data of stop time and start of the previous process
    if (highestPrioIndex != prevIndex && currentTime != 0) {
      let x = 0
      //to increment the index of stop time for each process
      if (stopInc == nOfprcs - 1) {
        stopRound++
      }
      //to increment the index of start time for each process
      if (startInc == nOfprcs - 1) {
        startRound++
      }

      while (process[prevIndex].stopTime[stopRound] == 0) {
        process[prevIndex].stopTime[stopRound] = currentTime
        //declares next index as zero
        process[prevIndex].stopTime[stopRound + 1] = 0
      }

      if (process[prevIndex].remainingBurstTime != 0) {
        console.log('bt =' + process[prevIndex].remainingBurstTime)
        console.log('stop time =' + process[prevIndex].stopTime[stopRound])
        stopInc++
      }

      if (process[highestPrioIndex].round != 0) {
        process[highestPrioIndex].nxtStartTime[startRound] = currentTime
        //declares next index as zero
        process[highestPrioIndex].nxtStartTime[startRound + 1] = 0
        console.log(
          'P' + process[highestPrioIndex].Prcsname + 'round: ' + startRound
        )
        console.log(
          'start time=' + process[highestPrioIndex].nxtStartTime[startRound]
        )
        startInc++
      }
    }

    //negative value because an index can be zero
    if (highestPrioIndex != -1) {
      let currentProcess = process[highestPrioIndex]
      console.log(
        'P' + process[highestPrioIndex].Prcsname + ' ms=' + currentTime
      )

      //for the process' first arrival
      if (currentProcess.round == 0) {
        currentProcess.startTime = currentTime
      }

      //increments the time (equivalent to milisecond)
      currentTime++
      
      ////decrements the burst time of the current process
      currentProcess.remainingBurstTime--
      //increments round of the current process
      currentProcess.round++
      if (currentProcess.remainingBurstTime == 0) {
        currentProcess.endTime = currentTime
        completed++
      }
      process[highestPrioIndex] = currentProcess
      gantt[num] = currentProcess
      gantt[num + 1] = 0
      num++
    } else {
      currentTime++
    }
    //end time hold
    endmsTime = currentTime;
    //holds the previous index
    prevIndex = highestPrioIndex
  }
  showDisplay()

}

function ganttChart() {


  let prevGantt = 0
  // Clear previous table content
  chart.innerHTML = ''
  gtitle.innerHTML = ''

  // Create row for Gantt chart
  let ganttRow = document.createElement('div')
  let ganttMs = document.createElement('div')
  let xq = 0

  let ganttTitle = document.createElement('div')
  ganttTitle.textContent = 'Gantt Chart'
  document.getElementById('gantTitle').appendChild(ganttTitle)
  ganttTitle.classList.add('content')

  let ganttendMsCell = document.createElement('div')
  let prevGround=0
  while (gantt[xq].Prcsname != null) {
    let y=0;
    console.log('ganttturn '+'ms '+ xq+ ' P' + gantt[xq].Prcsname + 'round ' + gantt[xq].ganttRound)
    // Create cell for Gantt chart
    let ganttCell = document.createElement('div')
    let ganttMsCell = document.createElement('div')   
    if (gantt[xq].Prcsname != prevGantt) {
      if (gantt[xq].ganttRound == 0){
        ganttMsCell.textContent = gantt[xq].startTime
        ganttMs.appendChild(ganttMsCell)
        while (gantt[y].Prcsname != null){
          if (gantt[y].Prcsname == gantt[xq].Prcsname && gantt[y].ganttRound == 0){
            gantt[y].ganttRound ++
            
          }
          console.log('mainstart '+'ms '+ xq+ ' P' + gantt[xq].Prcsname + 'round ' + gantt[xq].ganttRound)            
          y++;
        }
      
      }
      else{
        prevGround = gantt[y].ganttRound
        ganttMsCell.textContent = gantt[xq].nxtStartTime[gantt[xq].ganttRound-1]
        ganttMs.appendChild(ganttMsCell)
        while (gantt[y].Prcsname != null){
          if (gantt[y].Prcsname == gantt[xq].Prcsname && gantt[y].ganttRound == prevGround){
            
            gantt[y].ganttRound ++
          }
          console.log('nextstart '+'ms '+ xq+ ' P' + gantt[xq].Prcsname + 'round ' + gantt[xq].ganttRound)
          y++;
        }
        console.log( 'P'+ gantt[xq].Prcsname+ ' next start time' + gantt[xq].nxtStartTime[0] + 'round ' + gantt[xq].ganttRound + ' ')
      }
      ganttCell.textContent = 'P' + gantt[xq].Prcsname
      
      ganttRow.appendChild(ganttCell)
      console.log('P' + gantt[xq].Prcsname)
      prevGantt = gantt[xq].Prcsname
    }
    
    xq++
  }
  ganttendMsCell.textContent = endmsTime
        ganttMs.appendChild(ganttendMsCell)
  ganttRow.classList.add('ch')

  document.getElementById('chart-section').appendChild(ganttRow)
  document.getElementById('chart-section').appendChild(ganttMs)
  ganttMs.classList.add('ms-gantt')
  output()
}

function printPrcssTimes() {
  console.log('Process\tStart TIme\tEnd Time\n')
  for (let x = 0; x < nOfprcs; x++) {
    let y = 0
    console.log('P' + process[x].Prcsname + '\t' + process[x].startTime)
    while (process[x].nxtStartTime[y] != 0) {
      console.log('  ' + process[x].nxtStartTime[y])
      y++
    }
    console.log('\t\t' + process[x].endTime)
  }


  ganttChart()

}

function toggleDarkMode() {
  document.body.classList.toggle('dark-mode')
}

function output() {

  

let outputHtml = ''
let totalturnAroundTime = 0;

for (let x = 0; x < nOfprcs; x++) {
  let y = 0
  let turnAroundTime = process[x].endTime - process[x].arrivalTime

  outputHtml += `<p> P${process[x].Prcsname} &nbsp;&nbsp;${process[x].endTime} - ${process[x].arrivalTime} = ${turnAroundTime}</p>`

  totalturnAroundTime += turnAroundTime
}

let averageturnAroundTime = totalturnAroundTime / nOfprcs
let formattedAverageturnAroundTime = averageturnAroundTime.toFixed(1)

outputHtml += `<p id="totaltat"> TTAT = ${totalturnAroundTime} / ${nOfprcs}</p>`
outputHtml += `<p id="atat" >ATAT = ${formattedAverageturnAroundTime}ms</p>`

document.getElementById('TATout').innerHTML = outputHtml;


outputHtml = ''
  //WT---------------------------------------------------------------------
  let totalWaitingTime = 0

  for (let x = 0; x < nOfprcs; x++) {
    let y = 0
    let waitingTime = process[x].startTime - process[x].arrivalTime

    
    
if  (process[x].nxtStartTime[0] != 0) {

  outputHtml += `<p> P${process[x].Prcsname} &nbsp;&nbsp;(${process[x].startTime} - ${process[x].arrivalTime}) + `;
  
  while (process[x].nxtStartTime[y] != 0) {
    let nxtWaitingtime = process[x].nxtStartTime[y] - process[x].stopTime[y];
    waitingTime += nxtWaitingtime;
    if (process[x].nxtStartTime[y+1] != 0) {

      outputHtml += `(${process[x].nxtStartTime[y]} - ${process[x].stopTime[y]}) + `

    }
    else{
      outputHtml += ` (${process[x].nxtStartTime[y]} - ${process[x].stopTime[y]}) = ${waitingTime}</p>`
    } 
    y++
  }
}
else{
  outputHtml += `<p> P${process[x].Prcsname} &nbsp;&nbsp;${process[x].startTime} - ${process[x].arrivalTime} = ${waitingTime}</p>`
}
    

    totalWaitingTime += waitingTime
  }

  let averageWaitingTime = totalWaitingTime / nOfprcs

  let formattedAverageWaitingTime = averageWaitingTime.toFixed(1);

  outputHtml += `<p id="totalwt">TWT = ${totalWaitingTime} / ${nOfprcs}</p>`
  outputHtml += `<p id="awt"> AWT = ${formattedAverageWaitingTime}ms</p>`

  document.getElementById('TWTout').innerHTML = outputHtml;

}

function showDisplay() {
  var displayValue = "flex";

  showGantt.style.display = displayValue;
  showSolutions.style.display = displayValue;
  printPrcssTimes()
}

