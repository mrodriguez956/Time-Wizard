const addTime =  document.querySelector('.time-form'); 
const addButton = document.querySelector('.add-button');
const deleteButton = document.querySelector('#clear-button');
const editButton = document.querySelector('#edit-button');
const inputField = document.querySelector('.input-field');
const minutes = JSON.parse(localStorage.getItem('minutes')) || []; //grab object array from localStorage OR create an empty array


//let taskCount = minutes.length; //calculate task count by length of minutes array
let dateCount = 0;

addButton.addEventListener('click', addMinutes); //run function addMinutes on button click
deleteButton.addEventListener('click', deleteSelected); //clear localStorage when button is pressed
editButton.addEventListener('click', toggleEditMode);

document.querySelector('#user-table').addEventListener('click', rowCheckbox);


window.onload = function() {
    updateTable(); //ensure latest items are pulled from localStorage and displayed on load
    dateToggle();
  };

function validateTime(inputTime)
{
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

    return validate({ inputTime }, constraints);

}
function addMinutes(e)
{
    e.preventDefault(); //prevent default button behavior

    const inputTime = document.querySelector('input.input-field').value; //get minutes value from the input field
    const errors = validateTime(inputTime);

    if (errors) {
        alert("Please enter a valid number between 0 and 120.");
        return;
    }


      //  taskCount += 1; //if validation passes increase taskCount


    const newEntry = { //save data into new object
        date: saveDate().toString(),
        minutes: inputTime,
       // taskNumber: taskCount 
    };

    
   
    minutes.push(newEntry); //push new object into array
    document.querySelector('.input-field').value = "" //reset input field

    
    updateTable(); //run updateTable function to display updated table
    dateToggle();
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
    dateCount = 0;
    let taskCount = 0;
    
    

    minutes.forEach(entry => { //loop through minutes array using each object as an entry

        
        if (entry.date !== previousDate) //if the date for an entry is not equal to the previousDate, create a date row
            {
                dateCount += 1;
                const dateRow = document.createElement('tr');
                
                dateRow.classList.add('date-row','table-secondary'); //add classes to the dateRow table row element
                

                const dateCell = document.createElement('td');
                dateCell.innerHTML = `<button class='btn toggle-list-${dateCount}' type='button'> ${entry.date} </button>`; //create clickable table cell that contains date of entries
                //dateCell.textContent = entry.date;
                dateRow.appendChild(dateCell); // add date cell to the dateRow
                userTable.appendChild(dateRow); //add date Row to table 
                dateCell.setAttribute('colspan', 3); //make the date cell span across the width of the table
    
                previousDate = entry.date; //store date of current entry for future comparison

            }

         total += Number(entry.minutes);
         console.log("total:" + total);


        taskCount += 1;
        entry.taskNumber = taskCount;

    
        const newRow = document.createElement('tr');
        newRow.classList.add(`table-data-${dateCount}`, `row-select`);
        newRow.setAttribute('data-id', taskCount);
       
        
        newRow.innerHTML = `
        <td class='w-50'>
        <input type='checkbox' class='d-none'> ${entry.taskNumber}</td>
        <td class=''> ${entry.minutes} </td>`; 

        userTable.appendChild(newRow);
        
    });
    

    const totalRow = document.createElement('tr');
    const totalCell = document.createElement('td');

    totalCell.textContent = `Total: ${total}`;

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


function dateToggle() {

    console.log("dateCount: " + dateCount);
      for (let i = 0; i <= dateCount; i++) {

        const toggleList = document.querySelector(`.toggle-list-${i}`);
        if(toggleList)
            {
            toggleList.addEventListener('click', function() {
                const tableData = document.querySelectorAll(`.table-data-${i}`);
                tableData.forEach(element => {
                  element.classList.toggle('d-none');
                });
              });
        }

    }
}

function rowCheckbox(e) {
    const row = e.target.closest('.row-select');
    if (row) {
        const checkbox = row.querySelector('input[type="checkbox"]');
        
        // If the click is directly on the checkbox, let the default behavior happen
       
        
        if (!checkbox.classList.contains('d-none')) { 
        if (e.target === checkbox) {
            console.log("target: " + e.target);
            row.classList.toggle('selected', checkbox.checked);
            return;
        }
        
        // For clicks on other parts of the row, prevent default and toggle manually
        e.preventDefault();
        checkbox.checked = !checkbox.checked;
        
        // Toggle a class on the row to show it's selected
        row.classList.toggle('selected', checkbox.checked);
        
        console.log("target: " + e.target);
        }
    }
}

function deleteSelected()
{
    const selectedRows = document.querySelectorAll('.selected');
    selectedRows.forEach(row => {
        const id = parseInt(row.dataset.id);
        console.log("id: " + id);

        const matchingIndex = minutes.findIndex(entry => entry.taskNumber == id);
        console.log("matchingIndex: " + matchingIndex);

        
        
        
            if (matchingIndex !== -1)
                {
                    minutes.splice(matchingIndex, 1);
                        
                }
        

    });

    
    localStorage.setItem('minutes', JSON.stringify(minutes));
    deleteButton.classList.toggle('d-none');
    updateTable();
    dateToggle();
}


function toggleEditMode() {
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    const checkboxesEditMode = !deleteButton.classList.contains('d-none');
    const deleteButtonEditMode = !deleteButton.classList.contains('d-none');
    
    deleteButton.classList.toggle('d-none', deleteButtonEditMode);
    checkboxes.forEach(checkbox => {
        checkbox.classList.toggle('d-none', checkboxesEditMode);
    });
}