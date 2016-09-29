# roku-remote

This script allows users to control a Roku on the network using your computer keyboard.

## Usage

1.  Install roku-remote:

```bash
npm install roku-remote
```

2.  Open a command line application (Terminal, iTerm, etc.) and start the script:

```bash
node remote
```

3.  The script will listen for your keypress events to navigate around the Roku as well as open apps, play content, search, and more!  A full key mapping can be found below.

4.  Press `CONTROL+C` to stop the remote

## Key Mappings

The following represents the current key mapping:

```js
{
  // Arrow Keys
  left: 'Left',
  right: 'Right',
  up: 'Up',
  down: 'Down',

  // Standard keys
  space: 'Play',
  backspace: 'Back',
  return: 'Select',

  // Sequences (shift key)
  H: 'home',
  R: 'Rev',
  F: 'Fwd',
  S: 'Search',
  E: 'Enter',

  // Other
  r: 'InstantReplay',
  b: 'InfoBackspace'
};
```
