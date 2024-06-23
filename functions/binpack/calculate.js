

import {Packer} from "../../pkg/packer/packer.js";

export async function onRequestPost(context) {
    // const body = await context.request.json()
    const body = await context.request.json()
    const pageWidth = body.pageWidth;
    const pageHeight = body.pageHeight;
    const pageMargin = body.pageMargin ? body.pageMargin : 0;
    const itemMargin = body.itemMargin ? body.itemMargin : 0;
    const items = body.items
    let packer = new Packer(items, pageWidth, pageHeight, pageMargin, itemMargin);
    packer.fit();
    items.forEach((item, itemIndex) => {
        let block = items[itemIndex];
        // console.log(block)
        if (block.fit) {
            console.log(block.fit.nodeId, block.fit.x, block.fit.y, block.width, block.height);
        }
    })
    console.log(packer.nodes)
    return Response.json({pages: packer.pages, items: packer.items})
}