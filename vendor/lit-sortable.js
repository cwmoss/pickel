import Sortable from "./sortable.complete.esm.js";

/*Lit-wrapper for SortableJS to revert DOM-manipulation*/
export const LitSortable = {
  create: create,
};

function create(container, options) {
  return Sortable.create(container, options);
}

function createx(container, options, el, listname) {
  let onStart = options.onStart;
  let onMove = options.onMove;
  let onEnd = options.onEnd;

  let presortPrevious = [];

  options.onStart = e => {
    // used to put the items back in their pre-sort position onEnd
    presortPrevious = e.items.map(item => item.previousSibling)
  }

  return Sortable.create(container, options);

  options.onEnd = e => {
    const { items, newIndicies, oldIndicies } = e

    // RETURN ELEMENTS TO PREVIOUS POSITIONS, 'CANCELLING' THE SORT
    presortPrevious.forEach((previous, i) => previous.after(items[i]))

    // ALLOW LIT TO UPDATE THE DOM BY MOVING ITEMS IN ARRAY
    // IMPORTANT: NEED TO REMOVE ALL ITEMS FROM ARRAY AND ADD THEM BACK AS A 2nd STEP
    const movedArrayItems = oldIndicies.map(({ index }) => el[listname][index])

    // 1. REMOVE MOVED ITEMS
    const indiciesToRemove = oldIndicies.map(({ index }) => index)
    const myFilteredArray = el[listname].filter((item, i) => !indiciesToRemove.includes(i))

    // 2. ADD THEM ALL BACK IN
    newIndicies.forEach(({ index }, i) => myFilteredArray.splice(index, 0, movedArrayItems[i]))
    el[listname] = myFilteredArray

    if (onEnd) onEnd(e, el);
    // REQUEST LIT DOM UPDATE
    // this.requestUpdate();

    // UPDATE ARRAY IN DATABASE IF DESIRED
  }

  return Sortable.create(container, options);
}
function createOLDfix(container, options) {
  let onStart = options.onStart;
  let onMove = options.onMove;
  let onEnd = options.onEnd;

  /** Stores the child-structure of a container element.
   *  key = container element
   *  value = .childNodes of that container when drag started
   */
  var map = new Map();

  options.onStart = (e) => {
    // Create a new map to make sure no old childNode-state is kept from previous drags.
    map = new Map();

    // Store the childNodes of the container were the drag started.
    map.set(e.from, [...Array.prototype.slice.call(e.from.childNodes)]);

    if (onStart) onStart(e);
  };

  options.onMove = (e, originalEvent) => {
    // When entering this method the first, each container will have it's initial DOM-childNodes.
    // We only add each container to the map the first time we see it.

    if (!map.has(e.from))
      map.set(e.from, [...Array.prototype.slice.call(e.from.childNodes)]);

    if (!map.has(e.to))
      map.set(e.to, [...Array.prototype.slice.call(e.to.childNodes)]);

    if (onMove) onMove(e, originalEvent);
  };

  options.onClone = (e) => {
    if (!map.has(e.from))
      map.set(e.from, [...Array.prototype.slice.call(e.from.childNodes)]);

    if (!map.has(e.to))
      map.set(e.to, [...Array.prototype.slice.call(e.to.childNodes)]);
  };

  options.onEnd = (e) => {
    // Here we loop over the map and restore the DOM-structure to it's initial state.
    // Something other than SortableJS will have to trigger Lit to update and re-order the children.

    map.forEach((children, container) => {
      container.replaceChildren();
      children.forEach((child) => {
        container.appendChild(child);
      });
    });

    if (onEnd) onEnd(e);
  };

  return Sortable.create(container, options);
}
