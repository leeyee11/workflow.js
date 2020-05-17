import { createGraph } from './graph';
import { createObserver } from './observer';
import stage from './stage';

export const createStateMachine = function (config: Config): StateMachine {
  const _graph = createGraph(config);
  const _observer = createObserver();

  let _state = config.entry || _graph.getVertices().pop();
  let _context = config.context || {};
  let thisPointer = this;

  function getState(): Vertex {
    return _state;
  }

  function getObserver(): Observer {
    return _observer;
  }

  function test(target: Vertex): TestResult {
    const edge = _graph.getEdge(_state, target);
    if (!edge) {
      return {
        isPassed: false,
        message: 'No such edge in graph'
      };
    }
    const { validators = [] } = edge;
    for (let validator of validators) {
      if (!validator(_context)) {
        return {
          isPassed: false,
          message: `Validate failed :\n${validator}`
        }
      }
    }
    return { 
      isPassed: true,
      message: 'Validate passed'
    }
  }

  function goTo(target: Vertex): StateMachine {
    const stateMachineData: BaseData = {
      pointer: thisPointer,
      content: {
        _state,
        target,
        _context,
        _graph,
        message: null
      }
    };
    _observer.fire({
      name: `${_state}->${target}`,
      stage: stage.INITIALIZING
    }, stateMachineData);

    const { isPassed, message } = test(target);
    stateMachineData.content.message = message;
    
    if (isPassed) {
      _observer.fire({
        name: `${_state}->${target}`,
        stage: stage.PROCESSING
      }, stateMachineData);

      _state = target;

      _observer.fire({
        name: `${_state}->${target}`,
        stage: stage.FINISHED
      }, stateMachineData);
    } else {
      _observer.fire({
        name: `${_state}->${target}`,
        stage: stage.FAILED
      }, stateMachineData);
    }
    return {
      getState,
      test,
      goTo,
      getObserver
    }
  }

  return {
    getState,
    test,
    goTo,
    getObserver,
  }
}
