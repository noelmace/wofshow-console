const commands = ['cat', 'clear', 'help', 'll', 'ls', 'la'];
const commandWithArgs = ['ll talks/', 'cat about.txt', 'cat .egg.txt'];

const header = document.querySelector('header');
const content = document.querySelector('.content');

const egg = document.createElement('video');
egg.src = 'https://media.giphy.com/media/2xIOiAPXonois/giphy.mp4';
egg.classList.add('egg');
egg.setAttribute('loop', '');
egg.setAttribute('muted', '');
egg.setAttribute('playsinline', '');

let isMinimized = false;

document.querySelector('.ui-btn.close').addEventListener('click', () => {
  if (!isMinimized) {
    document.body.appendChild(egg);
    egg.play();
    content.style.display = 'none';
  }
  header.style.display = 'none';
  setTimeout(() => {
    header.style.display = 'flex';
    content.style.display = 'block';
    document.body.removeChild(document.querySelector('.egg'));
    isMinimized = false;
  }, 3000);
});

document.querySelector('.ui-btn.minimize').addEventListener('click', () => {
  if (!isMinimized) {
    content.style.display = 'none';
    document.body.appendChild(egg);
    egg.play();
  } else {
    content.style.display = 'block';
    document.body.removeChild(document.querySelector('.egg'));
  }
  isMinimized = !isMinimized;
});

const cmdOutput = document.querySelector('.cmd-output');
const consoleInput = document.querySelector('.console-input');
const helpTemplate = document.getElementById('help');
const promptTemplate = document.getElementById('prompt');

const commandLineEl = cmd => {
  const el = document.importNode(promptTemplate.content, true);
  const cmdEl = document.createElement('span');
  cmdEl.innerText = cmd;
  el.querySelector('.command').appendChild(cmdEl);
  return el;
};

const helpEl = (msgs, cmd) => {
  const el = document.createElement('section');
  el.appendChild(commandLineEl(cmd));

  msgs.forEach(msg => {
    const msgEl = document.createElement('div');
    msgEl.innerText = msg;
    el.appendChild(msgEl);
  });

  return el;
};

const errorEl = cmd => {
  const el = document.createElement('section');
  const msgEl = document.createElement('div');
  const [command, ...args] = cmd.split(' ');
  msgEl.innerHTML = commands.includes(command)
    ? args.length > 0
      ? `Error: ${command}: can't use ${args.join(' ')}`
      : `Error: ${command}: some arguments are missing`
    : `wofsh: command not found: ${cmd}`;
  el.appendChild(msgEl);
  el.prepend(commandLineEl(cmd));
  return el;
};

const commandRunEl = cmd => {
  let el = errorEl(cmd);
  const templateId = `cmd_${cmd
    .replace(' ', '_')
    .replace('.', '')
    .replace('/', '')}`;
  const cmdTemplate = document.getElementById(templateId);
  if (cmdTemplate) {
    el = document.importNode(cmdTemplate.content, true);
    el.querySelector('section').prepend(commandLineEl(cmd));
  }
  return el;
};

consoleInput.addEventListener(
  'keydown',
  event => {
    if (event.keyCode === 9) {
      event.preventDefault();
      console.log('tab');
    }
  },
  false
);

consoleInput.addEventListener(
  'keyup',
  event => {
    if (event.keyCode === 13 || event.keyCode === 9) {
      let output;
      const value = event.srcElement.value;

      switch (event.keyCode) {
        // "Enter"
        case 13:
          event.preventDefault();
          if (!value) {
            output = document.createElement('section');
            const newPrompt = document.importNode(promptTemplate.content, true);
            output.appendChild(newPrompt);
          } else if (value === 'clear') {
            cmdOutput.innerHTML = '';
          } else {
            output = commandRunEl(value);
          }
          event.srcElement.value = '';
          break;
        // tab
        case 9:
          event.preventDefault();
          const [command, ...args] = value.split(' ');
          const possibleCommands = commands.filter(cmd => cmd.startsWith(value));
          const possibleCommandsWithArgs = commandWithArgs.filter(cmd => cmd.startsWith(value));

          if (!value) {
            output = helpEl(commands, value);
          } else if (args.length < 1 && possibleCommands.length === 1 && !commands.includes(command)) {
            event.srcElement.value = possibleCommands[0];
          } else if (args.length < 1 && possibleCommands.length > 1) {
            output = helpEl(possibleCommands, value);
          } else if (possibleCommandsWithArgs.length > 1 && args.length < 1 && !args[0]) {
            event.srcElement.value = value + ' ';
            output = helpEl(possibleCommandsWithArgs.map(c => c.split(' ')[1]), value);
          } else if (possibleCommandsWithArgs.length === 1 && !commandWithArgs.includes(value)) {
            event.srcElement.value = possibleCommandsWithArgs[0];
          } else if (possibleCommandsWithArgs.length > 1) {
            output = helpEl(possibleCommandsWithArgs.map(c => c.split(' ')[1]), value);
          } else {
            event.srcElement.value = `${value}_`;
            setTimeout(() => (event.srcElement.value = value), 200);
          }
          break;
      }

      if (output) {
        cmdOutput.appendChild(output);
        event.srcElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        event.srcElement.focus();
      }
    }
  },
  false
);

cmdOutput.appendChild(commandRunEl('ls'));
cmdOutput.appendChild(commandRunEl('cat about.txt'));
cmdOutput.appendChild(commandRunEl('ll talks/'));
cmdOutput.appendChild(commandRunEl('help'));

consoleInput.focus();