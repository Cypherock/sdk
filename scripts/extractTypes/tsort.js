/**
 * general topological sort
 * @author SHIN Suzuki (shinout310@gmail.com)
 * @param Array<Array> edges : list of edges. each edge forms Array<ID,ID> e.g. [12 , 3]
 *
 * @returns Array : topological sorted list of IDs
 * */

function tsort(edges) {
  const nodes = {}; // hash: stringified id of the node => { id: id, afters: lisf of ids }
  const sorted = []; // sorted list of IDs ( returned value )
  const visited = {}; // hash: id of already visited node => true

  const Node = function (id) {
    this.id = id;
    this.afters = [];
  };

  // 1. build data structures
  edges.forEach(v => {
    const from = v[0];
    const to = v[1];
    if (!nodes[from]) nodes[from] = new Node(from);
    if (!nodes[to]) nodes[to] = new Node(to);
    nodes[from].afters.push(to);
  });

  // 2. topological sort
  Object.keys(nodes).forEach(function visit(idstr, ancestors) {
    const node = nodes[idstr];
    const { id } = node;

    // if already exists, do nothing
    if (visited[idstr]) return;

    if (!Array.isArray(ancestors)) ancestors = [];

    ancestors.push(id);

    visited[idstr] = true;

    node.afters.forEach(afterID => {
      if (ancestors.indexOf(afterID) >= 0)
        // if already in ancestors, a closed chain exists.
        throw new Error(`closed chain : ${afterID} is in ${id}`);

      visit(
        afterID.toString(),
        ancestors.map(v => v),
      ); // recursive call
    });

    sorted.unshift(id);
  });

  return sorted;
}

module.exports = tsort;
