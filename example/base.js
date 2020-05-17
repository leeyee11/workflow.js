const { createWorkFlow } = require('../dist/index');

const state = {
    A2B: true,
    B2C: true,
    C2A: false,
}
const wf = createWorkFlow({
  vertices: ['A','B','C'],
  edges: [{
      source: 'A',
      target: 'B',
      validators: [
        (context) => context.A2B
      ]
    },{
      source: 'B',
      target: 'C',
      validators: [
        (context) => context.B2C
      ]
    },{
      source: 'C',
      target: 'A',
      validators: [
        (context) => context.C2A
      ]
    }],
  entry: 'A',
  context: state,
})
console.log(wf.getState())// 'A'
console.log(wf.goTo('B').getState()) // 'B'
console.log(wf.goTo('C').getState()) // 'C'
console.log(wf.goTo('A').getState()) // 'C'
console.log(wf.test('A')) // { isPassed : false, message: 'Validate failed :\n(context) => context.C2A'}
state.C2A = true;
console.log(wf.goTo('A').getState()) // 'A'