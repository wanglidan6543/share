const ATTRS = 'ATTRS';
const TEXT = 'TEXT';
const REMOVE = 'REMOVE';
const REPLACE = 'REPLACE';
let Index = 0;

function diff(oldTree, newTree) {
    let patches = {}; //补丁
    let index = 0; //开始比较的节点
    //递归树  比较后的结果放到补丁包中

    walk(oldTree, newTree, index, patches)
    return patches;
}
//属性比较
function diffAttr(oldAttrs, newAttrs) {
    let patch = {}
    //新旧属性对比
    for (let key in oldAttrs) {
        if (oldAttrs[key] !== newAttrs[key]) {
            patch[key] = newAttrs[key]
        }
    }
    for (let key in newAttrs) {
        //老节点没有新节点的属性
        if (!oldAttrs.hasOwnProperty(key)) {
            patch[key] = newAttrs[key]
        }
    }

    return patch;
}

function walk(oldNode, newNode, index, patches) {
    //自己的补丁包
    let currentPatch = []
    //节点删除
    if (!newNode) {
        currentPatch.push({
            type: REMOVE,
            index
        })
    } else if (isString(oldNode) && isString(newNode)) {//字符串
        //文本不一致修改为最新的
        if (oldNode !== newNode) {
            currentPatch.push({
                type: TEXT,
                text: newNode
            })
        }
    } else if (oldNode.type === newNode.type) {//节点类型相同
        let attrs = diffAttr(oldNode.props, newNode.props);
        //判断属性是否有修改
        if (Object.keys(attrs).length > 0) {
            currentPatch.push({
                type: ATTRS,
                attrs
            })
        }
        //子节点  遍历
        diffChildren(oldNode.children, newNode.children, patches);
    } else { //节点被替换
        currentPatch.push({
            type: REPLACE,
            newNode
        })
    }
    //有补丁
    if (currentPatch.length > 0) {
        //将元素和补丁对应放到外面的大补丁中去
        patches[index] = currentPatch
    }

}

function diffChildren(oldChildren, newChildren, patches) {
    oldChildren.forEach((child, idx) => {
        //索引全局 index
        walk(child, newChildren[idx], ++Index, patches)
    })
}

function isString(node) {
    return Object.prototype.toString.call(node) === "[object String]"
}