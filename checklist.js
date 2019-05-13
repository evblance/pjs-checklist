const checklist = document.getElementById('checklist');
const items = checklist.querySelectorAll('.checklist__item');

// Classname representing the styling applied on checking an item in the list as complete
const CHECKED_CLASSNAME = 'completed';

// Enumerator for different user selection types
const SELECT_TYPE = Object.freeze({
  SINGLE: 'SINGLE',
  MULTIPLE: 'MULTIPLE'
});

// We track the user's selection type
let selectType = SELECT_TYPE.SINGLE;

/**
 * Completes checklist items to a target index based on which items are completed between our target
 * action and the list state.
 * @param {number} targetIndex The checklist item child node index to complete items to.
 */
function completeMultiple(targetIndex) {
  const numItems = items.length;
  const completedIndices = [];
  for (let i = 0; i < numItems; i++) {
    if (items[i].classList.contains(CHECKED_CLASSNAME)) {
      completedIndices.push(i);
    }
  }

  if (completedIndices.length) {
    completedIndices.sort((prev, next) => {
      return prev > next ? -1 : 1;
    });
    const min = completedIndices[0];
    const max = completedIndices[completedIndices.length - 1];

    // We want all items in between our shift clicks to be toggled as completed and inputs checked
    if (targetIndex < min) {
      for (let i = targetIndex; i < min; i++) {
        items[i].classList.add(CHECKED_CLASSNAME);
        items[i].children[0].checked = true;
      }
    } else if (targetIndex > max) {
      for (let i = max; i <= targetIndex; i++) {
        items[i].classList.add(CHECKED_CLASSNAME);
        items[i].children[0].checked = true;
      }
    }
  }
}

/**
 * Completes checklist items to a target index based on which items are uncompleted between our target
 * action and the list state.
 * @param {number} targetIndex The checklist item child node index to uncomplete items to.
 */
function uncompleteMultiple(targetIndex) {
  const numItems = items.length;
  const uncompletedIndices = [];
  for (let i = 0; i < numItems; i++) {
    if (!items[i].classList.contains(CHECKED_CLASSNAME)) {
      uncompletedIndices.push(i);
    }
  }

  if (uncompletedIndices.length) {
    uncompletedIndices.sort((prev, next) => {
      return prev > next ? -1 : 1;
    });
    const min = uncompletedIndices[0];
    const max = uncompletedIndices[uncompletedIndices.length - 1];

    // We want all items in between our shift clicks to be toggled as incompleted and inputs unchecked
    if (targetIndex < min) {
      for (let i = targetIndex; i < min; i++) {
        items[i].classList.remove(CHECKED_CLASSNAME);
        items[i].children[0].checked = false;
      }
    } else if (targetIndex > max) {
      for (let i = max; i <= targetIndex; i++) {
        items[i].classList.remove(CHECKED_CLASSNAME);
        items[i].children[0].checked = false;
      }
    }
  }
}

/**
 * Sets the correct selection status on a shift-key press.
 * @param {any} event The keyboard input event.
 */
function handleKeyDown(event) {
  if (event.keyCode === 16 && selectType !== SELECT_TYPE.MULTIPLE) {
    selectType = SELECT_TYPE.MULTIPLE;
  }
}

/**
 * Sets the correct selection status on a shift-key release.
 * @param {any} event The keyboard isnput event.
 */
function handleKeyUp(event) {
  if (event.keyCode === 16) {
    selectType = SELECT_TYPE.SINGLE;
  }
}

/**
 * Strikes through completed items or resets them based on the user's interaction
 * with the checklist.
 * @param {any} event The checklist change event.
 */
function handleChecklistChange(event) {
  this.classList.toggle(CHECKED_CLASSNAME);
  if (selectType === SELECT_TYPE.MULTIPLE) {
    const targetIndex = Array.prototype.indexOf.call(this.parentNode.children, this);
    // We complete or uncomplete multiple items based on the current action on the target item
    items[targetIndex].classList.contains(CHECKED_CLASSNAME) ? completeMultiple(targetIndex) : uncompleteMultiple(targetIndex);
  }
}

// Listen for checkbox change events on our checklist items so we can visually complete or uncomplete items
items.forEach(item => item.addEventListener('change', handleChecklistChange));

// Listen for keypresses so we can handle multiple selections
document.addEventListener('keydown', handleKeyDown);
document.addEventListener('keyup', handleKeyUp);
