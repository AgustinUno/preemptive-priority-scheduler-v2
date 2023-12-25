class Queue {
  constructor() {
    this.items = [];
  }

  addQ(item) {
    return this.items.push(item);
  }

  removeQ() {
    return this.items.shift();
  }

  frontQ() {
    return this.items[0];
  } 

  findProcess(item) {
    let key = 0
    while (this.items[key] != null) {
      if (this.items[key].name === item)
        return false
      key++;
    }

    return true
  }

  prioSort() {
    this.items.sort((a, b) => a.arT - b.arT)
    this.items.sort((a, b) => a.prio - b.prio)
  }
}

const waiting = new Queue();

//decralations for the mostly used outside of functions
//global declarations
var nOfprcs = 4
let process = []
let gantt = []
let endmsTime = 0;
let showIt = 0

//declarations for the clearing of the elements
var prcsHold = document.getElementById('prcsInput').value
const chart = document.querySelector('#chart-section')
const gtitle = document.querySelector('#gantTitle')
const gbd = document.querySelector('#prcs-content')
var showOutput = document.getElementById("output-container");
const comgbd = document.querySelector('#compressed')
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
  gantt = []
  showIt = 0
  let comleg = document.querySelector('#com-legend')
  comleg.innerHTML = ''
  for (let i = 0; i < nOfprcs; i++) {
    let comlegend = document.createElement('div')
    comlegend.id = 'bd-prcs' + (i + 1)
    comlegend.textContent = "P" + (i + 1)
    document.getElementById('com-legend').appendChild(comlegend)
  }
  var showLegend = document.getElementById("com-legend");
  showLegend.style.display = 'flex'
  // Clear previous table content  
  comgbd.innerHTML = ''
  //clears previous table content
  chart.innerHTML = ''
  gtitle.innerHTML = ''
  //increment for confirmation of proper values
  var hideBreakdown = document.getElementById("compressed");
  hideBreakdown.style.display = 'flex'
  let incProcess = 0
  //receives the given
  process = [] //resets array every compute
  document.getElementById('gant-mode').textContent = 'expand'
  //checks if the inputs have the proper values
  for (let x = 0; x < nOfprcs; x++) {
    let arrivalTime = document.getElementById('arTime' + (x + 1)).value
    let burstTime = document.getElementById('brsTime' + (x + 1)).value
    let priority = document.getElementById('prio' + (x + 1)).value

    if (arrivalTime != '' && burstTime != '' && burstTime != 0 && priority != '') {
      incProcess++
    }
  }
  document.getElementById("output-container").style.display = 'none';
  //condition if all the inputs are valid, and also sets the future values
  if (incProcess == nOfprcs) {
    for (let x = 0; x < nOfprcs; x++) {
      let arrivalTime = document.getElementById('arTime' + (x + 1)).value
      let burstTime = document.getElementById('brsTime' + (x + 1)).value
      let priority = document.getElementById('prio' + (x + 1)).value
      process.push({
        name: x + 1,
        arT: +arrivalTime,
        burstTime: +burstTime,
        prio: +priority,
        startTime: 0,
        endTime: 0,
        remainingBT: +burstTime,
        round: 0,
        stopTime: [0],
        nxtStart: [0],
        ganttRound: 0,
        BDRound: 0,
        startRound: 0,
        stopRound: 0,
        comRound: 0
      })
    }
    //function call to compute
    scheduling()
  }
}

const scheduling = () => {
  let complete = 0
  let currentMs = 0
  let prioIndex = 0
  let prevIndex = 0

  while (complete < nOfprcs) {
    for (var key in process) {
      if (process[key].arT <= currentMs && waiting.findProcess(process[key].name) && process[key].remainingBT > 0) {
        waiting.addQ(process[key])
      }
    }

    waiting.prioSort()
    prioIndex = waiting.frontQ()

    if (prioIndex != prevIndex && currentMs != 0 && prioIndex != null && prevIndex != null) {
      if (prevIndex.remainingBurstTime != 0) {
        prevIndex.stopTime[prevIndex.stopRound] = currentMs
        //increments the index of stop time
        prevIndex.stopRound++
      }
      //condition for the next start time if the current process had previously arrived      

      if (prioIndex.round != 0) {
        //fetches the the next starting time of the current process
        prioIndex.nxtStart[prioIndex.startRound] = currentMs
        //increments the index of stop time
        prioIndex.startRound++
      }

    }

    prevIndex = prioIndex

    let highestPrio = waiting.removeQ()

    if (highestPrio != null) {
      if (highestPrio.round == 0) {
        highestPrio.startTime = currentMs
      }

      highestPrio.remainingBT--
      highestPrio.round++
      currentMs++
      if (highestPrio.remainingBT == 0) {
        complete++
        highestPrio.endTime = currentMs
        endmsTime = currentMs
      }
      gantt.push(highestPrio)
    }
    else {
      gantt.push({ name: 0, endTime: currentMs + 1, startTime: currentMs, ganttRound: 0, comRound: 0, nxtStart: [0] })
      currentMs++;
    }
  }
  showDisplay()
}

//function to show the output display
function showDisplay() {
  //holds the display
  var displayValue = "flex";
  //modifies the display from none into flex
  showOutput.style.display = displayValue;

  //function call to print into console the computations for debugging
  ganttChart()
}

//function to create gantt chart
function ganttChart() {
  let prevGantt = 0

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
  for (var xq in gantt) {
    let y = 0;
    // Create cells for Gantt chart
    let ganttCell = document.createElement('div')
    let ganttMsCell = document.createElement('div')

    //condition if the current process is not the previous
    if (gantt[xq].name != prevGantt) {
      //condition if it is the process first round
      if (gantt[xq].ganttRound == 0) {
        //prints the starting millisecond of the process
        ganttMsCell.textContent = gantt[xq].startTime
        //prints the cell into html
        ganttMs.appendChild(ganttMsCell)
        gantt[xq].ganttRound++
      }
      //condition if the process is still the same
      else {
        //prints the value of the next time of the process
        ganttMsCell.textContent = gantt[xq].nxtStart[gantt[xq].ganttRound - 1]
        //creates the cell into html
        ganttMs.appendChild(ganttMsCell)
        gantt[xq].ganttRound++
      }

      //prints the name of the process into the gantt chart
      if (gantt[xq].name == 0)
        ganttCell.textContent = '-'
      else
        ganttCell.textContent = 'P' + gantt[xq].name

      //creates the cell into html
      ganttRow.appendChild(ganttCell)
      //holds the current process for comparing
      prevGantt = gantt[xq].name
    }
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

  //TURN AROUND TIME
  let totalturnAroundTime = 0;

  //loop for computing the turn around time of all the process
  for (let x in process) {
    //formula for turn around time
    let turnAroundTime = process[x].endTime - process[x].arT
    //prints the computations into html
    outputHtml += `<p> P${process[x].name} &nbsp;&nbsp;${process[x].endTime} - ${process[x].arT} = ${turnAroundTime}</p>`
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
  for (let x in process) {
    let y = 0
    //formula for waiting time
    let waitingTime = process[x].startTime - process[x].arT

    //condition if the next start have value
    if (process[x].nxtStart[0] != 0) {
      //prints the computations into html
      outputHtml += `<p> P${process[x].name} &nbsp;&nbsp;(${process[x].startTime} - ${process[x].arT}) + `;

      //loop for computing the extra start times and stop times
      while (process[x].nxtStart[y] != null) {
        //formula for waiting time but with extra times
        let nxtWaitingtime = process[x].nxtStart[y] - process[x].stopTime[y];
        //increments the values of the wt to create total
        waitingTime += nxtWaitingtime;
        //condition if the value still has further extra times
        if (process[x].nxtStart[y + 1] != null) {
          //prints the computation but with a plus sign to compensate for the further extra time
          outputHtml += `(${process[x].nxtStart[y]} - ${process[x].stopTime[y]}) + `
        }
        else {
          //prints the computation but without plus sign
          outputHtml += ` (${process[x].nxtStart[y]} - ${process[x].stopTime[y]}) = ${waitingTime}</p>`
        }
        y++;
      }
    }
    else {
      //prints the computations into html
      outputHtml += `<p> P${process[x].name} &nbsp;&nbsp;${process[x].startTime} - ${process[x].arT} = ${waitingTime}</p>`
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

  //increments all the burst times
  let AllBurstTimes = 0
  for (let x = 0; x < nOfprcs; x++) {
    AllBurstTimes += process[x].burstTime
  }
  if (AllBurstTimes < 101) {
    bdmsContainer.style.display = "flex"
    compressedGantt()
  } else {
    bdmsContainer.style.display = "none"
  }
}

//function for gantt chart breakdown
function compressedGantt() {
  var showBreakdown = document.getElementById("breakdown-section");
  showBreakdown.style.display = 'none'

  document.getElementById("bdms").style.marginLeft = "55px"

  //loop to show all the process in gantt chart
  for (let xq in gantt) {
    let y = 0
    // Create cells for Gantt chart
    let ganttBDRow = document.createElement('div')


    let width = 0

    //sets the process id
    ganttBDRow.id = 'bd-prcs' + gantt[xq].name
    console.log("current p" + gantt[xq].name)
    //set the width equal to turn around time
    if (gantt[xq].nxtStart[0] != 0) {
      if (gantt[xq].comRound == 0) {
        width = gantt[xq].stopTime[0] - gantt[xq].startTime
        console.log("comround==0 width = " + width)
        //set the margin equal to arrival time
        ganttBDRow.style.marginLeft = gantt[xq].startTime + "em"
        ganttBDRow.style.width = width + "em"
        document.getElementById('compressed').appendChild(ganttBDRow);

        gantt[xq].comRound++;

      }
      else {
        if (gantt[xq].stopTime[gantt[xq].comRound] != null) {
          width = gantt[xq].stopTime[gantt[xq].comRound] - gantt[xq].nxtStart[gantt[xq].comRound - 1]
          console.log("comround!=0 width and still has next index= " + width)
          prevComround = gantt[xq].comRound
          ganttBDRow.style.marginLeft = gantt[xq].nxtStart[gantt[xq].comRound - 1] + "em"
          ganttBDRow.style.width = width + "em"
          document.getElementById('compressed').appendChild(ganttBDRow);



          gantt[xq].comRound++;

        }
        else {


          console.log("comround!=0  and no next index width= " + width)

          width = (gantt[xq].endTime - gantt[xq].nxtStart[gantt[xq].comRound - 1])
          ganttBDRow.style.marginLeft = gantt[xq].nxtStart[gantt[xq].comRound - 1] + "em"



          ganttBDRow.style.width = width + "em"
          document.getElementById('compressed').appendChild(ganttBDRow);
          gantt[xq].comRound++;
        }
      }
    } else {
      let width = gantt[xq].endTime - gantt[xq].startTime
      console.log("no stoptime and no next index width= " + width)
      //set the margin equal to arrival time
      ganttBDRow.style.marginLeft = gantt[xq].startTime + "em"
      ganttBDRow.style.width = width + "em"
      document.getElementById('compressed').appendChild(ganttBDRow);
    }


    //sets z-index
    ganttBDRow.style.zIndex = xq

    //holds the name of the process for comparing
    prevGantt = gantt[xq].Prcsname
  }
  document.getElementById('compressed').style.width = endmsTime + 'em'

  ganttBreakdown()
}

//function for gantt chart breakdown
function ganttBreakdown() {
  let prevGantt = 0

  // Clear previous table content  
  const prcsID = document.querySelector('#prcs-id')
  prcsID.innerHTML = ''
  gbd.innerHTML = ''

  //loop to show all the process in gantt chart
  for (let xq in gantt) {
    let y = 0
    // Create cells for Gantt chart
    let ganttBDRow = document.createElement('div')
    let ganttBDName = document.createElement('div')
    //condition if the process is not the same as previous process and the process' first round in the loop
    if (gantt[xq].name != prevGantt && gantt[xq].BDRound == 0) {
      //prints the process name
      ganttBDName.textContent = "P" + gantt[xq].name

      //sets the process id
      ganttBDRow.id = 'bd-prcs' + gantt[xq].name

      //set the margin equal to arrival time
      ganttBDRow.style.marginLeft = gantt[xq].arT + "em"
      //set the width equal to turn around time
      ganttBDRow.style.width = (gantt[xq].endTime - gantt[xq].arT) + "em"
      //creates the cells into html
      document.getElementById('prcs-content').appendChild(ganttBDRow);
      document.getElementById('prcs-id').appendChild(ganttBDName)

      gantt[xq].BDRound++

      //holds the name of the process for comparing
      prevGantt = gantt[xq].name
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
  //setting the starting time of the breakdown
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

function showGanttBD() {
  var showBreakdown = document.getElementById("breakdown-section");
  var hideBreakdown = document.getElementById("compressed");
  var showLegend = document.getElementById("com-legend");
  if (showIt == 0) {
    document.getElementById("bdms").style.marginLeft = "90px"
    showBreakdown.style.display = 'flex'
    hideBreakdown.style.display = 'none'
    showLegend.style.display = 'none'
    document.getElementById('gant-mode').textContent = 'shrink'
    showIt = 1
  }
  else {
    document.getElementById("bdms").style.marginLeft = "55px"
    showBreakdown.style.display = 'none'
    hideBreakdown.style.display = 'flex'
    showLegend.style.display = 'flex'
    showIt = 0
    document.getElementById('gant-mode').textContent = 'expand'
  }

}
