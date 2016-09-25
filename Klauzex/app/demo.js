$(document).ready(function()
{
    $('#process').click(function ()
    {
        $('#output').text(sanitizeSingle($('#input_string').val()));
    });
})