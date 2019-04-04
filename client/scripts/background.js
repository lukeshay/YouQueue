var currentPlayer = document.createElement('video');
currentPlayer.id = "currentPlayer";

var queuedPlayer = document.createElement('video');
queuedPlayer.id = "queuedPlayer";

document.body.appendChild(currentPlayer);
document.body.appendChild(queuedPlayer);

chrome.runtime.onMessage.addListener((message, sender, sendRepsonse) =>
{
    if (!message.func === null)
    {
        message.func(message);
    }
    else{
        switch(message.req)
        {
            case "test":
                console.log(`Background script recieved message of type (test).`);
                sendRepsonse("Test message recieved. This is the response.");
                break;
            case "fetchAudio":
                queueAudio(message.data, "current");
                break;
            default:
                console.log(`Background script recieved message of type (${message.requestType}),`+
                            `which is not a recognized request.`);
                break;

        }
    }
    
});

var queueAudio = (videoID, option) =>
{
    const vidReq = new XMLHttpRequest();
    vidReq.open("POST", `http://localhost:3000/`);
    vidReq.setRequestHeader('Content-Type', 'application/json');
    vidReq.send(JSON.stringify({
      ID: videoID
    }));


    
    vidReq.onload = e =>
    {
        setTimeout(() => {
            if (option === "current")
            {
                currentPlayer.src = `http://localhost:3000/${videoID}.mp4`;
            }
            if (option === "queued")
            {
                queuedPlayer.src = `http://localhost:3000/${videoID}.mp4`;
            }
            
        }, 2000);
    }

    currentPlayer.play();

}
