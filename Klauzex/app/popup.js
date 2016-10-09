document.addEventListener('DOMContentLoaded', function () {
    chrome.runtime.sendMessage({ request: 'getGlobalState' }, function (enabled) {
        if(enabled)
        {
            enable();
        }
        else
        {
            disable();
        }

        getDomain(function(domain) {
            isWhitelisted(domain, function (isWhitelisted) {
                if (isWhitelisted) {
                    disableDomain();
                }
                else {
                    enableDomain();
                }
            });
        })
    });

    $('#toggle').click(toggleGlobal);
    $('#toggledomain').click(toggleDomain);
});

function toggleGlobal()
{
    chrome.runtime.sendMessage({ request: 'toggleGlobalState' }, function (enabled) {
        if(enabled)
        {
            enable();
        }
        else
        {
            disable();
        }
    })
}

function toggleDomain()
{
    getDomain(function(domain) {
        isWhitelisted(domain, function (isWhitelisted) {
            if(isWhitelisted)
            {
                removeWhitelistedDomain(domain);
                enableDomain();
            }
            else
            {
                addWhitelistedDomain(domain);
                disableDomain();
            }
        });
    });
}

function enable()
{
    console.log('enable');
    $('#toggle').html($('#stopValue').html());
    $('#toggledomain_container').show();
}

function disable()
{
    console.log('disable');
    $('#toggle').html($('#startValue').html());
    $('#toggledomain_container').hide();
}

function enableDomain()
{
    $('#toggledomain').html($('#stopDomainValue').html());
}

function disableDomain()
{
    $('#toggledomain').html($('#startDomainValue').html());
}

function getDomain(callback)
{
    chrome.tabs.getSelected(null, function (tab) {
        var url = new URL(tab.url)
        var domain = url.hostname

        console.log(domain);
        callback(domain);
    });
}
