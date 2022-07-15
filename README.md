# supa-app
A Supa Small Reactive View Library

## Install
```bash
npm i supa-app
```

# Counter App Demo
```javascript
import { h, text, runApp } from 'supa-app';

const IncrementBy = amt => state => ({ 
  ...state, count: state.count + amt 
});

runApp({
  node: document.getElementById('app'),
  state: {
    count: 0
  },
  effects: state => [],
  subscriptions: state => [],
  view: (state, setState) => {
    return (
      h('main', {}, 
        h('output', {}, 
          text('Counter: '), text(state.count)
        ),
        h('div', {},
          h('button', { onclick: () => setState(IncrementBy(1)) }, text('+')),
          h('button', { onclick: () => setState(IncrementBy(-1)) }, text('-'))
        )
      )
    )
  }
});
```