export function removeAntiAdBlocker(): void {
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      // Helper function to check the text content recursively in a node and its children
      const checkNodeAndChildren = (node: Node) => {
        if (node instanceof HTMLElement) {
          // Check if the node contains the targeted text
          if (node.textContent?.includes('We’ve Noticed You’re Using an Ad Blocker')) {
            console.log('Anti ad-blocker detected!');
            // Find the ancestor with class "v-overlay"
            const overlayAncestor = node.closest('.v-overlay');
            if (overlayAncestor) {
              // Remove the ancestor from the DOM
              overlayAncestor.remove();
              console.log('Anti ad-blocker removed! ;)');
            }
          }
          // Recursively check child nodes
          node.childNodes.forEach(checkNodeAndChildren);
        }
      };

      // Check added nodes in mutation
      mutation.addedNodes.forEach((node) => {
        checkNodeAndChildren(node);
      });
    });
  });

  // Observe the entire document for DOM changes
  observer.observe(document.body, {
    childList: true, // Look for added/removed nodes
    subtree: true, // Also observe the entire subtree
  });
}
