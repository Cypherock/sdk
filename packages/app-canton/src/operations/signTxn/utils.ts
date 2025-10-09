import { type DamlTransaction_Node as DamlTransactionNode } from '@canton-network/core-ledger-proto';

export const getOrderedNodeIds = (nodes: DamlTransactionNode[]) => {
  // This contains a map of nodes with their children
  // parentid => [ children1, children2 ]
  const nodesWithChildren: Record<string, string[]> = {};

  for (const individualNode of nodes) {
    if (
      individualNode.versionedNode.oneofKind === 'v1' &&
      individualNode.versionedNode.v1.nodeType.oneofKind
    ) {
      const v1Node = individualNode.versionedNode.v1;
      // only exercise and rollback nodes has children
      if (v1Node.nodeType.oneofKind === 'exercise') {
        const exerciseNode = v1Node.nodeType.exercise;
        nodesWithChildren[individualNode.nodeId] = exerciseNode.children;
      } else if (v1Node.nodeType.oneofKind === 'rollback') {
        const rollbackNode = v1Node.nodeType.rollback;
        nodesWithChildren[individualNode.nodeId] = rollbackNode.children;
      } else {
        nodesWithChildren[individualNode.nodeId] = [];
      }
    }
  }

  // nodes which are already explored
  const visitedNodes = new Set();
  // this contains node ids in order they are safe to send
  const orderedNodeIds: string[] = [];

  const visitNode = (nodeId: string) => {
    if (visitedNodes.has(nodeId)) {
      return;
    }
    visitedNodes.add(nodeId);

    for (const childrenId of nodesWithChildren[nodeId]) {
      visitNode(childrenId);
    }
    orderedNodeIds.push(nodeId);
  };

  // start visiting nodes
  for (const n of nodes) {
    visitNode(n.nodeId);
  }

  return orderedNodeIds;
};
