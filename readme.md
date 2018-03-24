
## Text editor + reader + messenger for children with cerebral palsy
[https://hedgehogappp.com](https://hedgehogappp.com)

It's a web application for children with cerebral palsy and other vision and motor skills problems.
All buttons are large here, all text is playable and easy scalable. 

Components 
- text editor
- text reader
- accounts
- file manager
- messenger 

## Used
- [Laravel 5](https://github.com/laravel/laravel)
- [Laravel Filemanager](https://github.com/UniSharp/laravel-filemanager)
- [Ionicons sprite](https://github.com/rastasheep/ionicons-sprite/)

## Features
File manager
- Create account to manage files and send messages 
- Create/delete/rename/move/open folders and text files, download/upload files 
- Add zoom area with the name of selected item
- Add time delay to avoid unintended clicks
- Select language to utter text; english and russian are available
- Enter the messenger

Reader
- Highlight and utter selected text
- Choose type of text selection: by word / by sentence / by paragraph
- Scroll text using forward/backward buttons
- Jump to the beginning/mid/end of text
- Add zoom area with the selected text
- Change font size
- Change speech speed
- Edit selected text

Editor 
- Choose between writing (math or text) and navigation mods
- Move cursor using forward/backward buttons
- Scroll and utter text by symbol/word/line in navigation mod
- Spell or utter selected word 
- Choose font size 
- Save edited text

Messenger
- Add contact
- Edit and save draft
- Send and read messages
- Refresh page

## Limitations
- Speech synthesis works fully in Chrome/desktop only. Firefox/Android and default Android browser does not support speech synthesis. 

## Known bugs
Major
- Speech resume doesn't work in Chrome/Android and Firefox/Windows
- Speech synthesis doesn't work on Android 5 and older

Minor
- Plenty of them

