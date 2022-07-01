

const axios = require("axios")
const fs = require("fs")

/*

THIS PROGRAM IS MAINLY A PROOF OF CONCEPT.
IF ITS NOT WORKING, I DONT CARE, JUST MAKE PULL REQUEST OR FIX IT YOUR WAY.
THIS PROGRAM IS UNDER WTFPL LICENCE.

        DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE   http://www.wtfpl.net/
                    Version 2, December 2004 

 Copyright (C) 2004 Sam Hocevar <sam@hocevar.net> 

 Everyone is permitted to copy and distribute verbatim or modified 
 copies of this license document, and changing it is allowed as long 
 as the name is changed. 

            DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE 
   TERMS AND CONDITIONS FOR COPYING, DISTRIBUTION AND MODIFICATION 

  0. You just DO WHAT THE FUCK YOU WANT TO.

*/

let configuration = require("./config")


function sleep(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
}


let all_search = []

async function main() {
    let allDmsChannels = (await axios.get("https://discordapp.com/api/users/@me/channels", {
        headers: {
            Authorization: configuration.DiscordToken
        }
    })).data.map(x => {return x.id})

    let _time_calculated = ((allDmsChannels.length*configuration.sleepBetween/1000) + Math.floor(allDmsChannels.length/configuration.wait_X_every_Y.Y)*configuration.wait_X_every_Y.X/1000 ).toFixed(2)
    console.log(`Total time calculated: ${allDmsChannels.length}*${configuration.sleepBetween/1000}s + ${Math.floor(allDmsChannels.length/configuration.wait_X_every_Y.Y)*configuration.wait_X_every_Y.X} = ${_time_calculated}s | ${(_time_calculated/60).toFixed(2)}min | ${(_time_calculated/3600).toFixed(2)}h`)


    for(let i in allDmsChannels) {

        if(parseInt(i) != 0 && parseInt(i)%configuration.wait_X_every_Y.Y == 0) {
            console.log(`Config > wait_X_every_Y > Reached ${configuration.wait_X_every_Y.Y}, waiting ${configuration.wait_X_every_Y.X}ms`)
            await sleep(configuration.wait_X_every_Y.X)
        }


        let chanID = allDmsChannels[i]
        console.log(`[${parseInt(i)+1}/${allDmsChannels.length}] Getting channel ${chanID}`)
        console.log(`Waiting ${(configuration.sleepBetween/1000).toFixed(1)}s ...`)
        await sleep(configuration.sleepBetween)
        let response = (await axios.get(`${configuration.discordURI}/api/v9/channels/966379788866572378/messages/search?content=${configuration.searchParams.content}`, {
            headers: {
                Authorization: configuration.DiscordToken
            }
        }))
        console.log(response)

        if(response.retry_after > 0) {
            console.log(`Rate limited for ${response.retry_after}. Waiting ${response.retry_after*1000}ms`)
            await sleep(response.retry_after*1000)
        }

        console.log(`[${parseInt(i)+1}/${allDmsChannels.length}]   Pushing ${response.data.messages.length} messages.`)
        maxTheoricallyHitten += response.data
        all_search.push(...response.data.messages)

    }

    fs.writeFileSync("./Result.txt", JSON.stringify(all_search, null, 2))
    
    all_search = JSON.parse(fs.readFileSync("./Result.txt","utf-8"))

    let the_json = ""
    let _temp1 = all_search.filter(x => {return (x[0].author.id == "770334301609787392")})
    console.log(_temp1)
    the_json = _temp1.map(x => {
        return `{ username: ${x[0].author.username}, content: ${x[0].content}, link: "${configuration.discordURI}/channels/@me/${x[0].channel_id}/${x[0].id}" } `
    })

    fs.writeFileSync("./AllLinks.txt", JSON.stringify(the_json,null,2))

}
main()
