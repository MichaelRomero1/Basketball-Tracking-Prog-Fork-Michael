// Empty
//begin electron code
// Modules to control application life and create native browser window

const { app, BrowserWindow } = require('electron')
const path = require('node:path')

function createWindow () {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  // and load the index.html of the app.
  mainWindow.loadFile('index.html')

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

//end electron code
// Select the button to add players
document.querySelector('.add_player_button').addEventListener('click', function() {
    addPlayer();
});

document.querySelector('.sort_player_number').addEventListener('click', function() {
    sortPlayerNumber();
});

document.querySelector('.sort_player_button').addEventListener('click', function() {
    sortPlayer();
});

document.addEventListener('DOMContentLoaded', function() {
    document.querySelector('.archivePanel').style.display = 'none';
    document.querySelector('.practicePanel').style.display = 'none';
})

var newRowLabels = document.createElement('tr');
    newRowLabels.className = 'player-row';

var newPracticeRowLabel = document.createElement('tr');
    newPracticeRowLabel.className = 'practice-player-row';

// Create table cells for labels
var nameLabelCell = document.createElement('td');
nameLabelCell.textContent = 'Name';

var yearLabelCell = document.createElement('td');
yearLabelCell.textContent = 'Year';

var numberLabelCell = document.createElement('td');
numberLabelCell.textContent = 'Number';

// Create table cells for labels in the practice page
var practiceNameLabelCell = document.createElement('td');
practiceNameLabelCell.textContent = 'Name';

var practiceFTACell = document.createElement('td');
practiceFTACell.textContent = 'FTA';

var practiceFTMCell = document.createElement('td');
practiceFTMCell.textContent = 'FTM';

// Append label cells to the row
newRowLabels.appendChild(nameLabelCell);
newRowLabels.appendChild(yearLabelCell);
newRowLabels.appendChild(numberLabelCell);

newPracticeRowLabel.appendChild(practiceNameLabelCell);
newPracticeRowLabel.appendChild(practiceFTACell);
newPracticeRowLabel.appendChild(practiceFTMCell);

// Append the label row to the player list
document.getElementById('player-list').appendChild(newRowLabels);
//Attempting to add row data to the practice page as well
document.getElementById('practice-list').appendChild(newPracticeRowLabel);


document.querySelector('.sort_player_number').addEventListener('click', function() {
    sortPlayerNumber();
});

function addPlayer() {
    // Get the values of the input fields
    var playerName = document.getElementById("PlayerName").value;
    var playerYear = document.getElementById("PlayerYear").value;
    var playerNumber = document.getElementById("PlayerNumber").value;

    // Check if any of the fields are empty
    if (playerName === "" || playerYear === "" || playerNumber === "") {
        alert("Please fill out all fields before adding player data!");
        return; // Exit the function if any field is empty
    }

    // Check if the player already exists
    var playerList = document.getElementById('player-list');
    var rows = playerList.getElementsByClassName('player-data-row');
    for (var i = 0; i < rows.length; i++) {
        var nameCell = rows[i].getElementsByTagName('td')[0];
        var yearCell = rows[i].getElementsByTagName('td')[1];
        var numberCell = rows[i].getElementsByTagName('td')[2];
        if (nameCell.textContent === playerName && yearCell.textContent === playerYear && numberCell.textContent === playerNumber) {
            alert("Player already exists!");
            return; // Exit the function if player already exists
        }
    }

    // Create JSON object
    var playerData = {
        name: playerName,
        year: playerYear,
        number: playerNumber
    };

    // Send data to server using fetch API (assuming server at http://localhost:7000)
    fetch('http://localhost:7000/addPlayer', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(playerData)
    })
    .then(response => {
        if (response.ok) {
            console.log("Player added successfully!");
        } else {
            console.log("Error adding player!");
        }
    });



    // Create a new row for the player data
    var newRowData = document.createElement('tr');
    newRowData.className = 'player-row player-data-row';

    // Create a new row for the player data in the practice page
    var practiceNewRowData = document.createElement('tr');
    practiceNewRowData.className = 'practice-player-row practice-player-data-row';

    // Create table cells for player data
    var playerNameCell = document.createElement('td');
    playerNameCell.textContent = playerName;

    var playerYearCell = document.createElement('td');
    playerYearCell.textContent = playerYear;

    var playerNumberCell = document.createElement('td');
    playerNumberCell.textContent = playerNumber;

    // Create table cells for player data in the practice page
    var practicePlayerNameCell = document.createElement('td');
    practicePlayerNameCell.textContent = playerName;

    // Input fields for Free throws and Free throws made
    var practicePlayerFTACell = document.createElement('input');
    practicePlayerFTACell.placeholder = 'Free Throws Attempted'
    practicePlayerFTACell.type = 'text';

    var practicePlayerFTMCell = document.createElement('input');
    practicePlayerFTMCell.placeholder = 'Free Throws Made'
    practicePlayerFTMCell.type = 'text';

    // Create options button for archiving and deleting
    var optionsCell = document.createElement('td');
    var optionsButton = document.createElement('button');
    optionsButton.textContent = 'Options';
    optionsButton.className = 'options-button';

    var optionsDropdown = document.createElement('div');
    optionsDropdown.className = 'dropdown-content';

    var archivePlayerButton = document.createElement('button');
    archivePlayerButton.textContent = 'Archive Player Info';
    archivePlayerButton.addEventListener('click', function() {
        archivePlayer(playerName, playerYear, playerNumber);
        newRowData.remove(); // Remove the row when delete button is clicked
        newRowLabels.remove(); // Also remove the label row
        practiceNewRowData.remove(); // Remove the row from practice when delete button is clicked
    });

    var deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete Player Info';
    deleteButton.addEventListener('click', function() {
        newRowData.remove(); // Remove the row when delete button is clicked
        newRowLabels.remove(); // Also remove the label row
        practiceNewRowData.remove(); // Remove the row from practice when delete button is clicked
    });

    optionsDropdown.appendChild(archivePlayerButton);
    optionsDropdown.appendChild(deleteButton);

    optionsButton.appendChild(optionsDropdown);
    optionsCell.appendChild(optionsButton);

    // Append player data cells to the row
    newRowData.appendChild(playerNameCell);
    
    newRowData.appendChild(playerYearCell);
    newRowData.appendChild(playerNumberCell);
    newRowData.appendChild(optionsCell);
    
    // Append the player name data to the practice list row
    practiceNewRowData.appendChild(practicePlayerNameCell);
    practiceNewRowData.appendChild(practicePlayerFTACell);
    practiceNewRowData.appendChild(practicePlayerFTMCell);

    // Append the data row to the player list
    document.getElementById('player-list').appendChild(newRowData);

    // Attempt to add the data row to the practice list
    document.getElementById('practice-list').appendChild(practiceNewRowData);

    // Clear input fields after adding player
    document.getElementById("PlayerName").value = "";
    document.getElementById("PlayerYear").value = "";
    document.getElementById("PlayerNumber").value = "";
}

function sortPlayer() {
    var playerList = document.getElementById('player-list');
    var rows = playerList.getElementsByClassName('player-data-row');

    var sortedRows = Array.from(rows).sort((a, b) => { 
        var aName = a.getElementsByTagName('td')[0].textContent; 
        var bName = b.getElementsByTagName('td')[0].textContent;
        return aName.localeCompare(bName);
    });

    for (var i = 0; i < sortedRows.length; i++) {
        playerList.appendChild(sortedRows[i]);
    }
}

function archivePlayer(playerName, playerYear, playerNumber) {

// Create a new row for the player
var newRowLabels = document.createElement('tr');
newRowLabels.className = 'player-row';

// Create table cells for labels
var nameLabelCell = document.createElement('td');
nameLabelCell.textContent = 'Name';

var yearLabelCell = document.createElement('td');
yearLabelCell.textContent = 'Year';

var numberLabelCell = document.createElement('td');
numberLabelCell.textContent = 'Number';

// Append label cells to the row
newRowLabels.appendChild(nameLabelCell);
newRowLabels.appendChild(yearLabelCell);
newRowLabels.appendChild(numberLabelCell);

// Append the label row to the player list
document.getElementById('archived_player-list').appendChild(newRowLabels);

// Create a new row for the player data
var newRowData = document.createElement('tr');
newRowData.className = 'player-row';

// Create table cells for player data
var playerNameCell = document.createElement('td');
playerNameCell.textContent = playerName;

var playerYearCell = document.createElement('td');
playerYearCell.textContent = playerYear;

var playerNumberCell = document.createElement('td');
playerNumberCell.textContent = playerNumber;

var optionsCell = document.createElement('td');
var optionsButton = document.createElement('button');
optionsButton.textContent = 'Options';
optionsButton.className = 'options-button';

var optionsDropdown = document.createElement('div');
optionsDropdown.className = 'dropdown-content';


var unarchiveButton = document.createElement('button');
unarchiveButton.textContent = 'Unarchive Player';
unarchiveButton.addEventListener('click', function() {
    newRowData.remove(); // Remove the row when delete button is clicked
    newRowLabels.remove(); // Also remove the label row
    unarchivePlayer(playerName, playerYear, playerNumber);
});

optionsDropdown.appendChild(unarchiveButton);

optionsButton.appendChild(optionsDropdown);
optionsCell.appendChild(optionsButton);

// Append player data cells to the row
newRowData.appendChild(playerNameCell);
newRowData.appendChild(playerYearCell);
newRowData.appendChild(playerNumberCell);
newRowData.appendChild(optionsCell);

// Append the data row to the player list
document.getElementById('archived_player-list').appendChild(newRowData);

}

function unarchivePlayer(playerName, playerYear, playerNumber) {

    // Create a new row for the player
    var newRowLabels = document.createElement('tr');
    newRowLabels.className = 'player-row';

    // Create table cells for labels
    var nameLabelCell = document.createElement('td');
    nameLabelCell.textContent = 'Name';

    var yearLabelCell = document.createElement('td');
    yearLabelCell.textContent = 'Year';

    var numberLabelCell = document.createElement('td');
    numberLabelCell.textContent = 'Number';

    // Append label cells to the row
    newRowLabels.appendChild(nameLabelCell);
    newRowLabels.appendChild(yearLabelCell);
    newRowLabels.appendChild(numberLabelCell);

    // Append the label row to the player list
    document.getElementById('player-list').appendChild(newRowLabels);

    // Create a new row for the player data
    var newRowData = document.createElement('tr');
    newRowData.className = 'player-row';

    // Create table cells for player data
    var playerNameCell = document.createElement('td');
    playerNameCell.textContent = playerName;

    var playerYearCell = document.createElement('td');
    playerYearCell.textContent = playerYear;

    var playerNumberCell = document.createElement('td');
    playerNumberCell.textContent = playerNumber;

    var optionsCell = document.createElement('td');
    var optionsButton = document.createElement('button');
    optionsButton.textContent = 'Options';
    optionsButton.className = 'options-button';

    var optionsDropdown = document.createElement('div');
    optionsDropdown.className = 'dropdown-content';

    var archivePlayerButton = document.createElement('button');
    archivePlayerButton.textContent = 'Archive Player Info';
    archivePlayerButton.addEventListener('click', function() {
        archivePlayer(playerName, playerYear, playerNumber);
        newRowData.remove(); // Remove the row when delete button is clicked
        newRowLabels.remove(); // Also remove the label row
    });

    var deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete Player Info';
    deleteButton.addEventListener('click', function() {
        newRowData.remove(); // Remove the row when delete button is clicked
        newRowLabels.remove(); // Also remove the label row
    });

    optionsDropdown.appendChild(archivePlayerButton);
    optionsDropdown.appendChild(deleteButton);

    optionsButton.appendChild(optionsDropdown);
    optionsCell.appendChild(optionsButton);

    // Append player data cells to the row
    newRowData.appendChild(playerNameCell);
    newRowData.appendChild(playerYearCell);
    newRowData.appendChild(playerNumberCell);
    newRowData.appendChild(optionsCell);

    // Append the data row to the player list
    document.getElementById('player-list').appendChild(newRowData);

    // Clear input fields after adding player
    document.getElementById("PlayerName").value = "";
    document.getElementById("PlayerYear").value = "";
    document.getElementById("PlayerNumber").value = "";
}

function sortPlayerNumber() {
    var playerList = document.getElementById('player-list');
    var rows = playerList.getElementsByClassName('player-row');

    var sortedRows = Array.from(rows).sort((a, b) => { 
        var aNumber = parseInt(a.getElementsByTagName('td')[2].textContent); 
        var bNumber = parseInt(b.getElementsByTagName('td')[2].textContent);
        return aNumber - bNumber;
    });

    // Clear the player list before appending sorted rows
    while (playerList.firstChild) {
        playerList.removeChild(playerList.firstChild);
    }

    // Append sorted rows back to the player list
    for (var i = 0; i < sortedRows.length; i++) {
        playerList.appendChild(sortedRows[i]);
    }

}