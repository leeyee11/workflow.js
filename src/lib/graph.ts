export const createGraph = function (config: Config): Graph {
  const _vertices: Set<Vertex> = new Set(config.vertices);
  const _edgeMap: Map<string,Edge> = new Map();
  config.edges.forEach((edge) =>
    _edgeMap.set(`${edge.source}->${edge.target}`, edge)
  );

  function getVertices (): Array<Vertex> {
    return Array.from(_vertices);
  }

  function getEdges (): Array<Edge> {
    return Array.from(_edgeMap.values());
  }

  function getEdge (source: Vertex, target: Vertex): Edge {
    return _edgeMap.get(`${source}->${target}`) || null;
  }

  function clear(): void {
    _vertices.clear();
    _edgeMap.clear();
  }

  function addVertex (vert: Vertex): void {
    if( _vertices.has(vert) ){
      throw new Error('Vertex already exists');
      return;
    }
    _vertices.add(vert);
  }

  function addEdge (edge: Edge): void {
    if( _edgeMap.get(`${edge.source}->${edge.target}`) ){
      throw new Error('Edge already exists');
      return;
    }
    if(! _vertices.has(edge.source)) {
      throw new Error(`Vertex:${edge.source} doesn't exist`)
    }
    if(! _vertices.has(edge.target)){
      throw new Error(`Vertex:${edge.target} doesn't exist`)
    }
    _edgeMap.set(`${edge.source}->${edge.target}`, edge)
    
  }

  return {
    clear,
    addVertex,
    addEdge,
    getVertices,
    getEdges,
    getEdge,
  }

}
