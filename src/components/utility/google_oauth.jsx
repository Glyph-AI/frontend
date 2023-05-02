const env = process.env.NEXT_PUBLIC_ENVIRONMENT
let redirect_uri = "http://localhost:3000/auth/google"
if (env == 'development') {
    redirect_uri = "https://dev.glyphassistant.com/auth/google"
}

let CLIENT_ID = '520170255321-uve0rbqvotf5v8163d8b5k8b3bfegk88.apps.googleusercontent.com'

export const googleOauth = (botId, toolId) => {
    var endpoint = "https://accounts.google.com/o/oauth2/v2/auth"
    var form = document.createElement('form')
    form.setAttribute('method', 'GET')
    form.setAttribute('action', endpoint)

    var params = {
        'client_id': CLIENT_ID,
        'redirect_uri': redirect_uri,
        'response_type': 'code',
        'scope': 'https://www.googleapis.com/auth/calendar.events',
        'include_granted_scopes': 'true',
        'state': JSON.stringify({ bot_id: botId, tool_id: toolId }),
        'access_type': "offline"
    }

    for (var p in params) {
        var input = document.createElement('input');
        input.setAttribute("type", 'hidden')
        input.setAttribute('name', p)
        input.setAttribute('value', params[p])
        form.appendChild(input)
    }

    document.body.appendChild(form)
    form.submit()
}