//decralations for the mostly used outside of functions
//global declarations
var nOfprcs = 4
let process = [
  (Prcsname = 0),
  (arrivalTime = 0),
  (burstTime = 0),
  (priority = 0)
]
let gantt = []
let endmsTime = 0;
let AllBurstTimes = 0

//declarations for the clearing of the elements
var prcsHold = document.getElementById('prcsInput').value
const chart = document.querySelector('#chart-section')
const gtitle = document.querySelector('#gantTitle')
const gbd = document.querySelector('#prcs-content')
var showOutput = document.getElementById("output-container");

//function call to create the table of inputs
createTable()

//checks if the input is in range of 4 - 8
//decrements the input of n value
function decrement() {
  if (prcsHold > 4) {
    prcsHold--
  }
  //sets and prints the value of n
  document.getElementById('prcsInput').value = prcsHold
}
//inrements the input of n value
function increment() {
  if (prcsHold < 8) {
    prcsHold++
  }
  //sets and prints the value of n
  document.getElementById('prcsInput').value = prcsHold
}

//selects the input as number of process
function confirm() {
  nOfprcs = prcsHold
  //hides output container
  showOutput.style.display = 'none'
  //function call to create the table of inputs
  createTable()
}

//function to create the table of inputs
function createTable() {
  const table = document.querySelector('#prcsTbl')
  // Clear previous table content
  table.innerHTML = ''
  chart.innerHTML = ''

  // Create the header row
  let headerRow = document.createElement('tr')
  headerRow.innerHTML =
    "<th id='prh'>Process</th><th id='ah'>Arrival Time</th><th id='bth'>Burst Time</th><th id='ph'>Priority</th>"

  // Append the header row to the table
  document.getElementById('prcsTbl').appendChild(headerRow)

  // Assuming nOfprcs is the number of processes
  for (let x = 0; x < nOfprcs; x++) {
    //creates a new table row
    let newRow = document.createElement('tr')
    //declares the element's id
    newRow.id = 'pr' + (x + 1)

    //declares the element's class
    newRow.classList.add('morphing-row')

    //creates cells for the row
    let cell1 = document.createElement('td')
    let cell2 = document.createElement('td')
    let cell3 = document.createElement('td')
    let cell4 = document.createElement('td')

    //prints the name of the process in the table
    cell1.textContent = 'P' + (x + 1)

    //creates input fields for each cell
    let input2 = document.createElement('input')
    let input3 = document.createElement('input')
    let input4 = document.createElement('input')

    //set input attributes (id and initial value)
    input2.type = 'number'
    input2.id = 'arTime' + (x + 1)
    input2.value = ''
    input3.type = 'number'
    input3.id = 'brsTime' + (x + 1)
    input3.value = ''
    input4.type = 'number'
    input4.id = 'prio' + (x + 1)
    input4.value = ''

    //set input placeholders
    input2.placeholder = '0'
    input3.placeholder = '0'
    input4.placeholder = '0'

    //appending cells to the row
    newRow.appendChild(cell1)
    newRow.appendChild(cell2)
    newRow.appendChild(cell3)
    newRow.appendChild(cell4)

    //append input fields to the cells
    cell2.appendChild(input2)
    cell3.appendChild(input3)
    cell4.appendChild(input4)

    //appending the new row to the table
    document.getElementById('prcsTbl').appendChild(newRow)
  }

  //displays solve button
  document.getElementById('submit').innerHTML =
    "<button id='cmpte' onClick=fetch()>Solve</button>"
}

function fetch() {
  //increment for confirmation of proper values
  let incProcess = 0
  //receives the given
  process = [] //resets array every compute

  //checks if the inputs have the proper values
  for (let x = 0; x < nOfprcs; x++) {
    let arrivalTime = document.getElementById('arTime' + (x + 1)).value
    let burstTime = document.getElementById('brsTime' + (x + 1)).value
    let priority = document.getElementById('prio' + (x + 1)).value

    if (arrivalTime != '' && burstTime != '' && burstTime != 0 && priority != '') {
      incProcess++
    }
  }

  //condition if all the inputs are valid, and also sets the future values
  if (incProcess == nOfprcs) {
    for (let x = 0; x < nOfprcs; x++) {
      let arrivalTime = document.getElementById('arTime' + (x + 1)).value
      let burstTime = document.getElementById('brsTime' + (x + 1)).value
      let priority = document.getElementById('prio' + (x + 1)).value
      process.push({
        Prcsname: x + 1,
        arrivalTime: +arrivalTime,
        burstTime: +burstTime,
        priority: +priority,
        startTime: 0,
        endTime: 0,
        remainingBurstTime: +burstTime,
        round: 0,
        stopTime: [0],
        nxtStartTime: [0],
        ganttRound: 0,
        BDRound: 0
      })
    }
    //function call to compute
    compute()
  }
}

//function to compute the process inputs
function compute() {
  let num = 0
  let completed = 0
  let currentTime = 0
  let prevIndex = 0
  let stopInc = 0
  let stopRound = 0
  let startInc = 0
  let startRound = 0

  //loop until all the process is finished
  while (completed < nOfprcs) {
    let highestPrioIndex = 0
    let holdPriority = 99999
    let holdArrival = 0

    //condition for starting time
    if (currentTime == 0) {
      //sorting the process into order of their arrival time
      for (let x = nOfprcs - 1; x >= 0; x--) {
        for (let y = nOfprcs - 1; y >= 0; y--) {
          if (process[x].arrivalTime > process[y].arrivalTime) {
            let hold = process[y]
            process[y] = process[x]
            process[x] = hold
          }
          else if ((process[x].arrivalTime == process[y].arrivalTime)) {
            //swapping if the process has an equal arrival time
            if (process[x].priority > process[y].priority) {
              let hold = process[y]
              process[y] = process[x]
              process[x] = hold
            }
          }
        }
      }
    }

    //loop for finding the index of the highest priority
    for (let x = 0; x < nOfprcs; x++) {
      if (
        process[x].arrivalTime <= (currentTime) &&
        process[x].remainingBurstTime > 0 &&
        process[x].priority < holdPriority
      ) {
        //to hold the current priority
        holdPriority = process[x].priority
        holdArrival = process[x].arrivalTime
        //to hold the index of the highest priority
        highestPrioIndex = x
      } else if (
        process[x].arrivalTime <= (currentTime) &&
        process[x].remainingBurstTime > 0 &&
        process[x].priority == holdPriority
      ) {
        if (process[x].arrivalTime < holdArrival) {
          highestPrioIndex = x
        }
      }
    }

    //condition to set the starting time
    if (currentTime == 0) {
      currentTime += process[highestPrioIndex].arrivalTime
    }

    //condition to collect the data of stop time and start of the previous process
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

      //loop for fetching the stop time of the previous process
      while (process[prevIndex].stopTime[stopRound] == 0) {
        process[prevIndex].stopTime[stopRound] = currentTime
        //declares next index  of stop time as zero for while loops
        process[prevIndex].stopTime[stopRound + 1] = 0
        console.log('bt =' + process[prevIndex].remainingBurstTime)
        console.log('stop time =' + process[prevIndex].stopTime[stopRound])
        //incrementation for the round of all the process
        stopInc++
      }

      //condition for the next start time if the current process had previously arrived
      if (process[highestPrioIndex].round != 0) {
        //fetches the the next starting time of the current process
        process[highestPrioIndex].nxtStartTime[startRound] = currentTime
        //declares next index of start time as zero for while loops
        process[highestPrioIndex].nxtStartTime[startRound + 1] = 0
        //incrementation for the round of all the process
        startInc++
      }
    }

    //condition if the process is found
    //negative value because an index can be zero
    if (highestPrioIndex != -1) {
      //holds the highest priority
      let currentProcess = process[highestPrioIndex]

      //condition for the process' first arrival
      if (currentProcess.round == 0) {
        //holds the first start time
        currentProcess.startTime = currentTime
      }

      //increments the time (equivalent to milisecond)
      currentTime++

      ////decrements the burst time of the current process
      currentProcess.remainingBurstTime--

      //increments round of the current process
      currentProcess.round++

      //condition if the current process has no remaining burst time
      if (currentProcess.remainingBurstTime == 0) {
        currentProcess.endTime = currentTime
        completed++
      }

      //updates the data of the highest priority process
      process[highestPrioIndex] = currentProcess

      //fetches the value for gantt chart
      gantt[num] = currentProcess
      ////declares next index of the gantt chart as zero for while loops
      gantt[num + 1] = 0
      //incrementation for gantt chart variable
      num++
    }
    else {
      //increments the time only
      currentTime++
    }
    //variable to hold the end time of the cycle
    endmsTime = currentTime;
    //holds the previous highest priority index
    prevIndex = highestPrioIndex
  }

  //section that checks if the arrival times fits for the total of burst times
  let incArrive = 0
  //
  for (let x = 0; x < nOfprcs; x++) {
    AllBurstTimes += process[x].burstTime
  }

  //loop for checking if all arrival times are under the total of burst times
  for (let x = 0; x < nOfprcs; x++) {
    if (process[x].arrivalTime < AllBurstTimes) {
      incArrive++;
    }
  }

  //condition to call next function if the arrival times are fit
  if (incArrive == nOfprcs) {
    //function call for output container
    showDisplay()
  }
}

//function to show the output display
function showDisplay() {
  //holds the display
  var displayValue = "flex";
  //modifies the display from none into flex
  showOutput.style.display = displayValue;

  //function call to print into console the computations for debugging
  printPrcssTimes()
}

//function to print the times of all the processes
function printPrcssTimes() {
  //prints header into console
  console.log('Process\tStart TIme\tEnd Time\n')
  //loop for printing all the times
  for (let x = 0; x < nOfprcs; x++) {
    let y = 0
    //prints the process name and its start time
    console.log('P' + process[x].Prcsname + '\t' + process[x].startTime)
    //loop that prints all next start times of the process
    while (process[x].nxtStartTime[y] != 0) {
      console.log('  ' + process[x].nxtStartTime[y])
      y++
    }
    //prints the end time of the process
    console.log('\t\t' + process[x].endTime)
  }
  //function call to print gantt chart
  ganttChart()
}

//function to create gantt chart
function ganttChart() {
  let prevGantt = 0
  let prevGround = 0
  let xq = 0

  //clears previous table content
  chart.innerHTML = ''
  gtitle.innerHTML = ''

  // Creates rows for Gantt chart
  let ganttRow = document.createElement('div')
  let ganttMs = document.createElement('div')
  let ganttendMsCell = document.createElement('div')

  //prints the title of the section
  let ganttTitle = document.createElement('div')
  ganttTitle.textContent = 'Gantt Chart'
  document.getElementById('gantTitle').appendChild(ganttTitle)
  ganttTitle.classList.add('content')

  //loop to show all the process in gantt chart
  while (gantt[xq].Prcsname != null) {
    let y = 0;
    // Create cells for Gantt chart
    let ganttCell = document.createElement('div')
    let ganttMsCell = document.createElement('div')

    //condition if the current process is not the previous
    if (gantt[xq].Prcsname != prevGantt) {
      //condition if it is the process first round
      if (gantt[xq].ganttRound == 0) {
        //prints the starting millisecond of the process
        ganttMsCell.textContent = gantt[xq].startTime
        //prints the cell into html
        ganttMs.appendChild(ganttMsCell)
        //loop to show all the process in gantt chart
        while (gantt[y].Prcsname != null) {
          //condition to increment the rounds of current process in the gantt variable 
          if (gantt[y].Prcsname == gantt[xq].Prcsname && gantt[y].ganttRound == 0) {
            //increments gantt round
            gantt[y].ganttRound++
          }
          //increment for the loop
          y++;
        }
      }
      //condition if the process is still the same
      else {
        //holds the value of the round of current process
        prevGround = gantt[y].ganttRound
        //prints the value of the next time of the process
        ganttMsCell.textContent = gantt[xq].nxtStartTime[gantt[xq].ganttRound - 1]
        //creates the cell into html
        ganttMs.appendChild(ganttMsCell)
        //loop to show all the process in gantt chart
        while (gantt[y].Prcsname != null) {
          //condition to increment the rounds of current process in the gantt variable 
          if (gantt[y].Prcsname == gantt[xq].Prcsname && gantt[y].ganttRound == prevGround) {
            //increments gantt round
            gantt[y].ganttRound++
          }
          //increment for the loop
          y++;
        }
      }
      //prints the name of the process into the gantt chart
      ganttCell.textContent = 'P' + gantt[xq].Prcsname
      //creates the cell into html
      ganttRow.appendChild(ganttCell)
      //holds the current process for comparing
      prevGantt = gantt[xq].Prcsname
    }
    //incrementation for the loop
    xq++
  }
  //prints the millisecond into the gantt chart
  ganttendMsCell.textContent = endmsTime
  //creates the cell into html
  ganttMs.appendChild(ganttendMsCell)
  //sets the class of the element of the gantt chart
  ganttRow.classList.add('ch')
  //creates the row of elements into html
  document.getElementById('chart-section').appendChild(ganttRow)
  document.getElementById('chart-section').appendChild(ganttMs)
  //sets the class of the element of the millisecond of gantt chart
  ganttMs.classList.add('ms-gantt')

  //function call for output of computations
  output()
}

function output() {
  let outputHtml = '' 

  //sorting the process by name
  for (let x = 0; x < nOfprcs; x++) {
    for (let y = 0; y < nOfprcs; y++) {
      if (process[x].Prcsname < process[y].Prcsname) {
        let hold = process[y]
        process[y] = process[x]
        process[x] = hold
      }
    }
  }

  //TURN AROUND TIME
  let totalturnAroundTime = 0;

  //loop for computing the turn around time of all the process
  for (let x = 0; x < nOfprcs; x++) {
    //formula for turn around time
    let turnAroundTime = process[x].endTime - process[x].arrivalTime
    //prints the computations into html
    outputHtml += `<p> P${process[x].Prcsname} &nbsp;&nbsp;${process[x].endTime} - ${process[x].arrivalTime} = ${turnAroundTime}</p>`
    //increments the values of the tat to create total
    totalturnAroundTime += turnAroundTime
  }

  //formula for the average of turn around time
  let averageturnAroundTime = totalturnAroundTime / nOfprcs
  //sets the decimal points into 1
  let formattedAverageturnAroundTime = averageturnAroundTime.toFixed(1)

  //prints the computation into html
  outputHtml += `<p id="totaltat"> TTAT = ${totalturnAroundTime} / ${nOfprcs}</p>`
  outputHtml += `<p id="atat" >ATAT = ${formattedAverageturnAroundTime}ms</p>`

  //outputs the section into html
  document.getElementById('TATout').innerHTML = outputHtml;

  //sets the value of the variable html back to null
  outputHtml = ''

  //WAITING TIME
  let totalWaitingTime = 0

  //loop for computing the waiting time of all the process
  for (let x = 0; x < nOfprcs; x++) {
    let y = 0
    //formula for waiting time
    let waitingTime = process[x].startTime - process[x].arrivalTime

    //condition if the next start have value
    if (process[x].nxtStartTime[0] != 0) {
       //prints the computations into html
      outputHtml += `<p> P${process[x].Prcsname} &nbsp;&nbsp;(${process[x].startTime} - ${process[x].arrivalTime}) + `;

      //loop for computing the extra start times and stop times
      while (process[x].nxtStartTime[y] != 0) {
        //formula for waiting time but with extra times
        let nxtWaitingtime = process[x].nxtStartTime[y] - process[x].stopTime[y];
        //increments the values of the wt to create total
        waitingTime += nxtWaitingtime;
        //condition if the value still has further extra times
        if (process[x].nxtStartTime[y + 1] != 0) {
          //prints the computation but with a plus sign to compensate for the further extra time
          outputHtml += `(${process[x].nxtStartTime[y]} - ${process[x].stopTime[y]}) + `
        }
        else {
          //prints the computation but without plus sign
          outputHtml += ` (${process[x].nxtStartTime[y]} - ${process[x].stopTime[y]}) = ${waitingTime}</p>`
        }
        //incrementation for the loop
        y++
      }
    }
    else {
      //prints the computations into html
      outputHtml += `<p> P${process[x].Prcsname} &nbsp;&nbsp;${process[x].startTime} - ${process[x].arrivalTime} = ${waitingTime}</p>`
    }

    //increments the values of the wt to create total
    totalWaitingTime += waitingTime
  }
  
  //formula for the average of waiting time
  let averageWaitingTime = totalWaitingTime / nOfprcs
  //sets the decimal points into 1
  let formattedAverageWaitingTime = averageWaitingTime.toFixed(1);

//prints the computation into html
  outputHtml += `<p id="totalwt">TWT = ${totalWaitingTime} / ${nOfprcs}</p>`
  outputHtml += `<p id="awt"> AWT = ${formattedAverageWaitingTime}ms</p>`

   //outputs the section into html
  document.getElementById('TWTout').innerHTML = outputHtml;

  //checks if the burst times fits for gantt look

  const bdmsContainer = document.querySelector('#gantt-breakdown')
  if (AllBurstTimes < 101) {
    bdmsContainer.style.display = "flex"
    ganttBreakdown()
  } else {
    bdmsContainer.style.display = "none"
  }
}

//function for gantt chart breakdown
function ganttBreakdown() {
  let prevGantt = 0
  let xq = 0
  // Clear previous table content  
  gbd.innerHTML = ''

  //loop to show all the process in gantt chart
  while (gantt[xq].Prcsname != null) {
    let y = 0
    // Create cells for Gantt chart
    let ganttBDRow = document.createElement('div')
    let ganttBDName = document.createElement('div')
    //condition if the process is not the same as previous process and the process' first round in the loop
    if (gantt[xq].Prcsname != prevGantt && gantt[xq].BDRound == 0) {
      //prints the process name
      ganttBDName.textContent = "P" + gantt[xq].Prcsname
      //sets the process id
      ganttBDRow.id = 'bd-prcs' + gantt[xq].Prcsname
      //set the margin equal to arrival time
      ganttBDRow.style.marginLeft = gantt[xq].arrivalTime + "em"
      //set the width equal to turn around time
      ganttBDRow.style.width = (gantt[xq].endTime - gantt[xq].arrivalTime) + "em"
      //creates the cells into html
      document.getElementById('prcs-content').appendChild(ganttBDRow);
      document.getElementById('prcs-id').appendChild(ganttBDName)
      //loop to show all the process in gantt chart
      while (gantt[y].Prcsname != null) {
        //condition to increment the round of current process
        if (gantt[y].Prcsname === gantt[xq].Prcsname) {
          //increment round
          gantt[y].BDRound++;
        }
        //incrementtation for the loop
        y++;
      }
      //holds the name of the process for comparing
      prevGantt = gantt[xq].Prcsname
    }
    //incrementtation for the loop
    xq++
  }
  breakdownMS();
}




function breakdownMS() {
  let ms = 1
  let msPrint = 0
  const divofms = document.querySelector('#bdms')
  //clears previous milliseconds
  divofms.innerHTML = ''
  //setting the starting time the breakdown
  //declare cell for html
  let msStartHead = document.createElement('div')
  //prints the millisecond zero
  msStartHead.textContent = 0
  //sets the id of the cell
  msStartHead.id = 'aBdms' + 0
  //creates the cell into the html
  document.getElementById('bdms').appendChild(msStartHead)
  //loop to print the ms that increments into partition
  while (ms != endmsTime - 1) {
    //declare cell for html
    let msHead = document.createElement('div')
    //condition if the millisecond is divisible by 5
    if ((ms % 5) == 0) {
      //holds the value of the ms
      msPrint = ms
      //prints the current ms
      msHead.textContent = ms
      //sets the id of the cell
      msHead.id = 'aBdms' + ms
       //creates the cell into the html
      document.getElementById('bdms').appendChild(msHead)
    }
    //incrementation of the loop
    ms++
  }
  //declare the end time cell
  let msEndHead = document.createElement('div')
  //condition if the end and the holding ms is more than 4
  if ((endmsTime - msPrint) > 4) {
    //sets the width of the end time
    msEndHead.style.marginLeft = -56 + (12 * (endmsTime - msPrint)) + "px"
  }
  else {
    //sets the width of the end time
    msEndHead.style.marginLeft = -66 + (12 * (endmsTime - msPrint)) + "px"
  }

  //prints the end time
  msEndHead.textContent = endmsTime
  //sets the id of the end time
  msEndHead.id = 'aBdms' + ms
  //creates the cell into html
  document.getElementById('bdms').appendChild(msEndHead)

}

//function for night mode
function toggleDarkMode() {
  //toggles the class dark mode
  document.body.classList.toggle('dark-mode')
}
