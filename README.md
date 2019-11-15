# Session Socket Server

A simple Node JS based socket server useful for session based persistence and data transfer.

# Server
## Startup

1. There is a folder called `node-server` that contains all the server code.
2. This requires that the PC that is going to run the server software to have Node JS installed. You can find Node JS here: https://nodejs.org/en/
3. There are two executable scripts in the `node-server` folder to easily start an instance of the server.  
    - `ServerStart_Mac.command` can be used on Macs.
    - `StartServer_Win.bat` can be used on Windows.
    - You can also start the server by using the command `node main.js` while in the `node-server` folder in your operating system's repsective command line.
4. If the server started correctly you should see something like this in your operating system's command-line: 
    ```
    > ryancook@ryan-macbook:~/Git/MoreOrLessFashion/node-server$ node main.js
    > new session beginning...
    > Server is listening on 192.168.0.66:5556
    ```

## Messaging

Messages to and from the server should include a 4 letter message type indicator.
The following are the currently supported message types:

| 4-Letter Type | Description |
| --- | --- |
| `JOIN` | Client requesting to join the session. |
| `JRES` | Server response confirming join acceptance. |
| `RDAT` | Client requesting current session data. |
| `GDAT` | Server response with current session data. |
| `UDAT` | Update to a specified piece of session data. Client can send to server and server broadcasts to other clients. |
| `KEEP` | Client telling Server that it is still connected. |
| `QUIT` | Client telling Server that it has disconnected. |
| `EVNT` | Generic event that is sent to all connected clients. Up to implementor to decide how to use. |

## Session Data

The server stores session data in a simple Javascript object. Session data is indexed by a string identifier and the value is JSON. 

For instance if you wanted to store the state of a toggle button, it could look like this:

**id:** toggle_button_a  
**value:**  
```json
{
    "isOn": true
}  
```

Or maybe you want to store a more complex blob like a transformation

**id:** object_001_transform  
**value:**  
```json
{
    "position": {
        "x" : 10,
        "y" : 2,
        "z" : 5
    },
    "rotation": { 
        "x" : 0,
        "y" : 0,
        "z" : 0
    },
    "scale": { 
        "x" : 1,
        "y" : 1,
        "z" : 1
    }
}  
```

What you store and how you store it is really up to you.

> **NOTE: Keep in mind that this server updates and emits session data in full.** 
> 
> So in the case of the transform data example above, even if we just wanted to change the x postion to 11, the full session data blob needs to be updated and will be sent in full to all connected clients.



# Clients

## Joining the Session

1. Create a socket that listens to the server ip and port as the end point.
2. Send the message `JOIN` to the server.
3. Wait for the response `JRES` from the server to confirm that the connection has been accepted.

## Get Current Session Data

1. Send `RDAT` message to the server.
2. Wait for `GDAT` response from server.
3. Strip `GDAT` from received response and you are left with the raw JSON string of all the current session data.

# Contribute
If you wish to contribute to this project feel free to open up a pull request and I will review it for inclusion.

Same goes for bug fixes, if you find any, feel free to open up an Issue here on the GitHub repo or fix it yourself and create a pull request so we may all benefit.
