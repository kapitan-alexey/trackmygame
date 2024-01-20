const minus = document.getElementById('hidden').innerHTML


function addNewPlayer() {
  
    // Find the row to copy
    const playerRows = document.querySelectorAll('.player-row');
    const originalRow = playerRows[playerRows.length - 1];
  
    // Clone the row
    const clonedRow = originalRow.cloneNode(true);
    clonedRow.querySelector('input').value = '';
    clonedRow.querySelector('.minus-player').innerHTML = minus
    
    // Insert the cloned row after the original row
    originalRow.parentNode.insertBefore(clonedRow, originalRow.nextSibling);
    clonedRow.querySelector('input').focus();
  
  };
  
  
  function removeParentRow(element) {
    const parentRow = element.closest('tr');
    
    // Check if it's the last row
    const isLastRow = parentRow.parentNode.rows.length === 1;
  
    // Remove the row only if it's not the last one
    if (parentRow && !isLastRow) {
      parentRow.remove();
    }
  }
