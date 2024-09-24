const addTime =  document.querySelector('.add-time');
const addButton = document.querySelector('#addButton');
const clearButton = document.querySelector('#clear-button');
const inputField = document.querySelector('#inputTime');

const minutes = JSON.parse(localStorage.getItem('minutes')) || [];


let taskCount = minutes.length;
console.log(taskCount);
addButton.addEventListener('click', addMinutes);
clearButton.addEventListener('click', clearLocalStorage);

window.onload = function() {
    updateTable();
  };


function addMinutes(e)
{
    e.preventDefault();

    const inputTime = document.querySelector('#inputTime').value;



    const constraints = {
        inputTime: {
            presence: true,
            numericality: {
                onlyInteger: false,
                greaterThanOrEqualTo: 0,
                lessThanOrEqualTo: 120
            }
            
        }
    };

    const options = {
        strict: true
    };

    const errors = validate({ inputTime }, constraints);

    if (errors) {
        alert("Please enter a valid number between 0 and 120.");
        return;
    }

    else{

        taskCount += 1;
    }


/*    if (!inputTime || inputTime < 0 || inputTime > 120) 
        {
        alert("Please enter a valid number between 0 and 120.");
        return;
      }

 */   



    const newEntry = {
        date: saveDate().toString(),
        minutes: inputTime,
        taskNumber: taskCount
    };
   
    minutes.push(newEntry);

    updateTable();
    localStorage.setItem('minutes', JSON.stringify(minutes));
}

function updateTable() 
{
    const userTable = document.querySelector('#user-table tbody');

    let previousDate = null;
    userTable.innerHTML = '';
    let total = 0;

    minutes.forEach(entry => {

        if (entry.date !== previousDate)
            {
                const dateRow = document.createElement('tr');
                const dateCell = document.createElement('td');
                dateRow.classList.add('date-row','table-secondary');
                
                dateCell.textContent = entry.date;
                dateRow.appendChild(dateCell);
                userTable.appendChild(dateRow);
                dateCell.setAttribute('colspan', 3);
                previousDate = entry.date;

            }

         total += Number(entry.minutes);
         console.log("total:" + total);

        const newRow = document.createElement('tr');   
        const taskNumberCell = document.createElement('td');
        const minutesCell = document.createElement('td');
        const totalCell = document.createElement('td');

        console.log(entry.taskNumber);
        
        taskNumberCell.textContent = entry.taskNumber;
        minutesCell.textContent = entry.minutes;
        totalCell.textContent = total;

        newRow.appendChild(taskNumberCell);
        newRow.appendChild(minutesCell);
        newRow.appendChild(totalCell);
        userTable.appendChild(newRow);
    });

}



function saveDate()
{
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const date = new Date();
    const formattedDate = `${days[date.getDay()]} | ${date.getMonth()}-${date.getDate()}-${date.getFullYear()}`
   
   return formattedDate;

}

function clearLocalStorage() {
    localStorage.clear();
    window.location.reload();
  }

