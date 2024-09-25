const addTime =  document.querySelector('.time-form'); 
const addButton = document.querySelector('.add-button');
const clearButton = document.querySelector('#clear-button');
const inputField = document.querySelector('.input-field');

const minutes = JSON.parse(localStorage.getItem('minutes')) || []; //grab object array from localStorage OR create an empty array


let taskCount = minutes.length; //calculate task count by length of minutes array
//console.log(taskCount);
addButton.addEventListener('click', addMinutes); //run function addMinutes on button click
clearButton.addEventListener('click', clearLocalStorage); //clear localStorage when button is pressed

window.onload = function() {
    updateTable(); //ensure latest items are pulled from localStorage and displayed on load
  };


function addMinutes(e)
{
    e.preventDefault(); //prevent default button behavior

    const inputTime = document.querySelector('input.input-field').value; //get minutes value from the input field



    const constraints = { //validation for minutes entry using validate.js
        inputTime: {
            presence: true,
            numericality: {
                onlyInteger: false,
                greaterThanOrEqualTo: 0,
                lessThanOrEqualTo: 120
            }
            
        }
    };

    const errors = validate({ inputTime }, constraints);

    if (errors) {
        alert("Please enter a valid number between 0 and 120.");
        return;
    }

    else{

        taskCount += 1; //if validation passes increase taskCount
    }


    const newEntry = { //save data into new object
        date: saveDate().toString(),
        minutes: inputTime,
        taskNumber: taskCount 
    };

    
   
    minutes.push(newEntry); //push new object into array

    

    document.querySelector('.input-field').value = "" //reset input field

    
    updateTable(); //run updateTable function to display updated table
    localStorage.setItem('minutes', JSON.stringify(minutes)); //stringify minutes array and set as item 'minutes' in localStorage


}

function updateTable() 
{
    const userTable = document.querySelector('#user-table tbody'); //grab table body where user data will be displayed
    const tableFoot = document.querySelector('#user-table tfoot'); //grab table foot where total minutes will be displayed
    



    let previousDate = null; //re-initialize variable previousDate when updateTable() is ran
    userTable.innerHTML = ''; //clear the table body
    tableFoot.innerHTML = ''; //clear table footer
    let total = 0; //reset total

    minutes.forEach(entry => { //loop through minutes array using each object as an entry

        if (entry.date !== previousDate) //if the date for an entry is not equal to the previousDate, create a date row
            {
                const dateRow = document.createElement('tr');
                
                dateRow.classList.add('date-row','table-secondary'); //add classes to the dateRow table row element
                

                const dateCell = document.createElement('td');
                dateCell.innerHTML = "<button class='btn toggle-list' type='button'>" + entry.date + "</button>" //create clickable table cell that contains date of entries
                //dateCell.textContent = entry.date;
                dateRow.appendChild(dateCell); // add date cell to the dateRow
                userTable.appendChild(dateRow); //add date Row to table 
                dateCell.setAttribute('colspan', 3); //make the date cell span across the width of the table
    
                previousDate = entry.date; //store date of current entry for future comparison

            }

         total += Number(entry.minutes);
         console.log("total:" + total);

    
        const newRow = document.createElement('tr');
        newRow.classList.add("table-data");
        
       
        
        newRow.innerHTML = "<td class='w-50'>" + entry.taskNumber + "</td><td class=''>" + 
        entry.minutes + "</td>"; 

        userTable.appendChild(newRow);
        
    });
    
    const tableData = document.querySelectorAll('.table-data');
    const toggleList = document.querySelector('.toggle-list');


    toggleList.addEventListener('click', function() {
        tableData.forEach(element => {
          element.classList.toggle('d-none');
        });
      });


    const totalRow = document.createElement('tr');
    const totalCell = document.createElement('td');

    totalCell.textContent = "Total: " + total;

    totalCell.setAttribute('colspan', 3);



    totalRow.appendChild(totalCell);
    tableFoot.appendChild(totalRow);

    tableFoot.classList.add("total-row");



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
