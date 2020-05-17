// [0-9A-Za-z_\-]
type Vertex = string;

/*
  const transition: Transition = {
    name: `${sourceVertex}->${targetVertex}`
    stage: [initializing|processing|finished|failed]
  }
 */


interface Transition {
  name?: string,
  stage?: string,
}

interface BaseData {
  pointer: any,
  content: {
    _state: any,
    target: Vertex,
    _context: any,
    _graph: Graph,
    message: string,
  },
}

interface Edge {
  source: Vertex,
  target: Vertex,
  validators?: Function[] // Context -> Boolean
}

interface Graph {
  clear(): void,
  addVertex(vert: Vertex): void,
  addEdge(edge: Edge): void,
  getVertices(): Array<Vertex>,
  getEdges(): Array<Edge>,
  getEdge(source: Vertex, target: Vertex): Edge,
}

interface StateMachine {
  getState(): Vertex,
  test(target: Vertex): TestResult,
  goTo(target: Vertex): StateMachine,
  getObserver(): Observer
}

interface Observer {
  observe(transition: Transition, fn: Function): void,
  fire(transition: Transition, data: BaseData): void,
  remove(transition: Transition): void,
}

interface Config {
  vertices: Array<Vertex>,
  edges: Array<Edge>,
  entry?: Vertex,
  context?: Object,
}

interface TestResult {
  isPassed: Boolean,
  message?: string,
}