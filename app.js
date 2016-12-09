var VALID_INPUTS = [8,13,32, 16, 61, 173, // backspace, enter, space
                37,38,39,40, // Arrow keys
                46, // delete
                48,49,50,51,52,53,54,55,56,57, // 0-9 number row
                96,97,98,99,100,101,102,103,104,105, // 0-9 numpad
                106,107,109,110,111,187,189,191, // Operands
                190,219,221]; // Period, open/close brackets

var $sum = $('.sum');
var $expression = $('.expression');
var $expressionContainer = $('.expression-container');


// Model
var appState = [];


// Init
$(document).ready(function() {
  $expression.focus();
});

// Register handlers
$expression.keydown(keydownHandler);
$expression.keyup(keyupHandler);

function keydownHandler(event) {
  console.log(event.which);
  // Check if keyboard input is valid
  // such as a number or mathematical symbol
  if(VALID_INPUTS.indexOf(event.which) === -1) {
    // If found invalid prevent event action.
    event.preventDefault();
  }

  // If enter key is pressed...
  if(event.which === 13) {
    // Avoid skipping to next statement when value is empty.
    if($expression.val() === "") {
      event.preventDefault;
      return;
    }
    createNewStatement($(this).parent());
  }
}

function createNewStatement(oldStatment) {
  appState.push({
    expressionWrapper: oldStatment,
    expression: oldStatment.children('.expression').val(),
    sum: oldStatment.children('.sum').text()
  });

  $expressionContainer.append("<div class='expression-wrapper'><span class='icon-close clear'></span><input type='text' class='expression'><div class='sum'></div></div>");

  $expression.parent().addClass('complete');
  $expression.siblings('.icon-close').addClass('delete').removeClass('clear');
  $expression.prop('disabled', true);
  $expression.unbind('keydown').unbind('keyup');
  $expression.siblings('.delete').bind('click', deleteHandler);
  $expression.parent().bind("mouseenter mouseleave", hoverHandler);
  $expression = $('.expression-wrapper').last().children('.expression');
  $expression.siblings('.clear').on('click', clearHandler);
  $expression.bind('keydown', keydownHandler).bind('keyup', keyupHandler);
  $sum = $('.expression-wrapper').last().children('.sum');
  $expression.focus();
}

function clearHandler() {
  $(this).siblings('.expression').val("").focus();
  $(this).siblings('.sum').html("");
}

function deleteHandler() {
  var index = $(this).parent().index();
  appState[index].expressionWrapper.remove();
  appState.splice(index, 1);
}


function hoverHandler(event) {
  var mouseEnter = event.type === 'mouseenter';
  if (mouseEnter) {
    $(this).children('.delete').addClass('show');
  } else {
    $(this).children('.delete').removeClass('show');
  }

}

function keyupHandler(event) {
  // Fixes issue with value remaining last number if when it should be empty.
  if ($expression.val() === "") {
    $sum.html("");
  }

  try {
    $sum.html(numberWithCommas(evaluateStatement()));
  } catch (e) {
    // Do nothing!
  }
}

function evaluateStatement() {
  return eval($expression.val());
}

// Number formatting from StackOverflow answer http://stackoverflow.com/a/2901298
function numberWithCommas(x) {
    var parts = x.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
}
