# COGS <-> Buzzshot

THIS IS AN EARLY VERSION, LET US KNOW IF YOU WANT IT TO DO MORE!

This plugin allows you to automatically transfer data between [Buzzshot](https://buzzshot.com) and [COGS](https://cogs.show/).
It will give you a window when you start your COGS show in which you can select
a Buzzshot game. If you would prefer to automatically choose the game based on
the current time then see the "Auto Choose Game" action below.

Until a game is selected the plugin will not be able to sync data. We recommend
adding a checklist item to your COGS pre-show with a condition that "Game
Selected" is ON.


# Installing the plugin

1. Download the latest version of the plugin by from [the Releases
page](https://github.com/clockwork-dog/cogs-plugin-buzzshot/releases/), you want
the file named `com.buzzshot.cogs.zip`. 
2. Unzip the file into the `plugins` folder
in your COGS project, you should now have a `com.buzzshot.cogs` folder in your
`plugins` folder in your project.
3. Open the project in COGS and enable the Buzzshot plugin under Setup -> Settings.
4. You should now see the Buzzshot logo in the list of icons to on the left. Click the Buzzshot Logo.
5. Enter your Buzzshot API Key in the "API Key" field (get in touch with support@buzzshot.com if you need an API Key)
6. Enter the name of the room that corresponds to this room (EXACTLY as it appears in Buzzshot) in the Room Name field

You are now ready to start integrating Buzzshot into your COGS show!


# Pulling in data to COGS

This plugin will currently make the following data available to your COGS show:

- Team Name
- Game Selected (true or false, this is the only data available if you haven't yet selected a game)
- Player Count
- Player 1 Name
- Player 2 Name
- Player 3 Name
- Player 4 Name
- Player 5 Name
- Player 6 Name
- Player 7 Name
- Player 8 Name
- Player 9 Name
- Game Master Name
    
Want more information from Buzzshot to use in COGS? Let us know!


# Sending data to Buzzshot

You can use the following actions within COGS to send data back to Buzzshot:

- Set Team Name: Pass a string to set the team name
- Set Did Win: Pass true or false to set the win state in Buzzshot
- Set Completion Time (milliseconds): Pass a number of miliseconds to set the completion time
- Set Hints: Pass a number to set the number of hints
- Set Game Master Name: Pass the name of the game master you wish to assign (will be created if they don't exist)
- Complete Game: Use this action to complete the game in Buzzshot (you usually only want to do this after the photos have been added)
 
Again, if you want something that isn't here then please let us know!
 
 
# Automatically selecting game

The default way the plugin works is that before each game the operator must
select the Buzzshot game from a list. This gives lots of flexibility and is
probably the right way to get started. However at some point you may want to
automate this!

To automatically choose a game trigger the "Auto Choose Game" action in COGS
(you probably want to trigger this when the show starts) passing in the name of
the Buzzshot Room (or if you already specified that in the settings you can
leave it blank!). This will choose a Buzzshot game that is set to start closest
to the current time for that room.
