/******************************************************************************

 This is a very simple binary tree based bin packing algorithm that is initialized
 with a fixed width and height and will fit each block into the first node where
 it fits and then split that node into 2 parts (down and right) to track the
 remaining whitespace.

 Best results occur when the input blocks are sorted by height, or even better
 when sorted by max(width,height).

 Inputs:
 ------

 w:       width of target rectangle
 h:      height of target rectangle
 blocks: array of any objects that have .w and .h attributes

 Outputs:
 -------

 marks each block that fits with a .fit attribute pointing to a
 node with .x and .y coordinates

 Example:
 -------

 var blocks = [
 { w: 100, h: 100 },
 { w: 100, h: 100 },
 { w:  80, h:  80 },
 { w:  80, h:  80 },
 etc
 etc
 ];

 var packer = new Packer(500, 500);
 packer.fit(blocks);

 for(var n = 0 ; n < blocks.length ; n++) {
 var block = blocks[n];
 if (block.fit) {
 Draw(block.fit.x, block.fit.y, block.w, block.h);
 }
 }


 ******************************************************************************/

class PackerError extends Error {
    constructor(message, type) {
        super(message);
        this.name = 'PackerError';
        this.type = type; // 0 : 남은 공간 부족, 1 : 용지 자체가 item보다 작음
    }
}


export class Packer {
    constructor(items, width, height, pageMargin, itemMargin) {
        // 무조건 portrait 으로...
        this.width = Math.min(width, height)
        this.height = Math.max(width, height)
        this.items = this.processItem(items)
        this.pageMargin = isNaN(parseInt(pageMargin)) ? 0 : parseInt(pageMargin)
        this.itemMargin = isNaN(parseInt(itemMargin)) ? 0 : parseInt(itemMargin)
        this.count = 1
        this.pages = [
            {id: this.count, x: 0, max_y: 0, min_y: 0, width: this.width, height: this.height, items: []}
        ]
        let maxWidth = Math.max(this.items.map(item => item.width)) + 2 * (this.pageMargin + this.itemMargin)
        let maxHeight = Math.max(this.items.map(item => item.height)) + 2 * (this.pageMargin + this.itemMargin)
        if (maxWidth > this.width || maxHeight > this.height) {
            throw new PackerError('용지가 너무 작습니다.', 1)
        }
    }

    processItem(items) {
        let tempItems = items
        tempItems = items.map(item => {
            let longSide = Math.max(item.width, item.height)
            let shortSide = Math.min(item.width, item.height)
            item.width = shortSide
            item.height = longSide
            return item
        }).sort((prev, current) => {
            const prevStandard = prev.height
            const currentStandard = current.height
            return prevStandard > currentStandard ? -1 : prevStandard < currentStandard ? 1 : 0
        })
        return tempItems
    }

    getId() {
        this.count += 1
        return this.count
    }

    fit() {
        let page = this.pages[0]
        for (let itemIndex = 0; itemIndex < this.items.length; itemIndex++) {
            let item = this.items[itemIndex]
            page = this.firstPhase(item, page)
        }
        // 홀수 번째 그룹의 순서 정렬
        this.pages.map((page, pageIndex) => {
            if (pageIndex % 2 === 0) {
                return page
            }
            page.items = page.items.sort((prev, current) => {
                    return prev.x > current.x ? -1 : prev.x < current.x ? 1 : 0
                })
        })
        return {pages: this.pages, items: this.items}
    }

    firstPhase(item, page) {
        let pageItemCount = page.items.length
        if (pageItemCount === 0) {
            page.x = this.pageMargin
        }
        let pageRemainWidth = this.width - (page.x + this.pageMargin)
        if (item.width < pageRemainWidth) {
            item.x = page.x
            page.x += item.width + this.itemMargin
            page.items.push(item)
            let tempHeight = item.height + this.itemMargin + this.pageMargin
            page.max_y = Math.max(page.max_y, tempHeight)
            page.min_y = page.min_y === 0 ? tempHeight : Math.min(page.min_y, tempHeight)
            // console.log(page.items)
        } else {
            console.log('page is full')
            page = {id: this.getId(), x: 0, y: 0, width: this.width, height: this.height, items: []}
            this.pages.push(page)
            return this.firstPhase(item, page)
        }
        return page
    }
}
