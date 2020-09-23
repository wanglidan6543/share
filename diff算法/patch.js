let allPatches;
let index = 0;  //需要补丁的索引

function patch(node, patches) {
    allPatches = patches
    patchWalk(node)
}

function patchWalk(node) {
    let currentPatch = allPatches[index++]
    let childNodes = node.childNodes;
    childNodes.forEach(child => {
        patchWalk(child)
    })
    //有补丁
    if (currentPatch) {
        doPatch(node, currentPatch)

    }
}

//给对应节点对应补丁
function doPatch(node, patches) {
    patches.forEach(item => {
        switch (item.type) {
            case 'ATTRS':
                for (let key in item.attrs) {
                    let val = item.attrs[key]
                    if (val) {
                        setAttr(node, key, val)
                    } else {
                        node.removeAttribute(key)
                    }
                }
                break;

            case 'TEXT':
                node.textContent = item.text
                break;

            case 'REPLACE':
                let newNode = (item.newNode instanceof Element) ? render(item.newNode) : document.createTextNode(item.newNode);
                node.parentNode.replaceChild(newNode, node)
                break;

            case 'REMOVE':
                node.remove()
                break;

            default:

                break;
        }
    })
}