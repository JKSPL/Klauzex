$(document).ready(function()
{
	var placeholder = "Wpisz tekst aby zobaczyć jego reprezentację po unifikacji...";
    $('#process').click(function ()
    {
    	var inputText = $('#input_string').val();
    	var newText = inputText != '' ? sanitizeSingle(inputText) : placeholder;
        $('#output').text(newText);
    });
});