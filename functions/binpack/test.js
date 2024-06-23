const SORT_AREA = (binsArray) => binsArray.sort((prev, current) => {
    const calc = (item) => item.width * item.height;
    const prevStandard = calc(prev);
    const currentStandard = calc(current);
    return prevStandard > currentStandard ? -1 : prevStandard < currentStandard ? 1 : 0;
})

const SORT_PERI = (binsArray) => binsArray.sort((prev, current) => {
    const calc = (item) => item.width + item.height;
    const prevStandard = calc(prev);
    const currentStandard = calc(current);
    return prevStandard > currentStandard ? -1 : prevStandard < currentStandard ? 1 : 0;
})

const SORT_DIFF = (binsArray) => binsArray.sort((prev, current) => {
    const calc = (item) => Math.abs(item.width - item.height);
    const prevStandard = calc(prev);
    const currentStandard = calc(current);
    return prevStandard > currentStandard ? -1 : prevStandard < currentStandard ? 1 : 0;
})

const SORT_SSIDE = (binsArray) => binsArray.sort((prev, current) => {
    const calc = (item) => (Math.min(item.width, item.height), Math.max(item.width, item.height));
    const prevStandard = calc(prev);
    const currentStandard = calc(current);
    return prevStandard > currentStandard ? -1 : prevStandard < currentStandard ? 1 : 0;
})

const SORT_LSIDE = (binsArray) => binsArray.sort((prev, current) => {
    const calc = (item) => (Math.max(item.width, item.height), Math.min(item.width, item.height));
    const prevStandard = calc(prev);
    const currentStandard = calc(current);
    return prevStandard > currentStandard ? -1 : prevStandard < currentStandard ? 1 : 0;
})

const SORT_RATIO = (binsArray) => binsArray.sort((prev, current) => {
    const calc = (item) => item.width / item.height;
    const prevStandard = calc(prev);
    const currentStandard = calc(current);
    return prevStandard > currentStandard ? -1 : prevStandard < currentStandard ? 1 : 0;
})

const SORT_NONE = (binsArray) => binsArray

const tempArray = [
    {width: 45, height: 45},
    {width: 70, height: 20},
    {width: 40, height: 40},
    {width: 50, height: 50},
]

class BinFactory {
    constructor(width, height, count, pack_algo, args, kwargs) {
        this._width = width
        this._height = height
        this._count = count
        this._pack_algo = pack_algo
        this._algo_args = args ? args : []
        this._algo_kwargs = kwargs ? kwargs : {}
        this._ref_bin = null
        this._bid = kwargs?.bid ? kwargs.bid : 0
    }

    _create_bin() {
        return this._pack_algo(this._width, this._height, ...this._algo_args, ...this._algo_kwargs)
    }

    is_empty() {
        return this._count < 1
    }

    fitness(width, height) {
        if (!this._ref_bin) {
            this._ref_bin = this._create_bin()
        }
        return this._ref_bin.fitness(width, height)
    }

    fits_inside(width, height) {
        // Determine if rectangle widthxheight will fit into empty bin
        if (!this._ref_bin) {
            this._ref_bin = this._create_bin()
        }
        return this._ref_bin._fits_surface(width, height)
    }

    new_bin() {
        if (this._count > 0) {
            this._count -= 1
            return this._create_bin()
        } else {
            return null
        }
    }

    __eq__(other) {
        return this._width * this._height === other._width * other._height
    }

    __lt__(other) {
        return this._width * this._height < other._width * other._height
    }

    __str__() {
        return `Bin : (${this._width}, ${this._height}, ${this._count})`
    }
}

const PackerBNFMixin = {
    /* BNF (Bin Next Fit): Only one open bin at a time.  If the rectangle
    doesn't fit, close the current bin and go to the next. */
    add_Rect(width, height, rid = null) {
        while (true === true) {
            if (this._open_bins.length === 0) {
                let new_bin = this._new_open_bin(width, height, rid)
                if (!new_bin) {
                    return null
                }
            }
            let rect = this._open_bins[0].add_rect(width, height, rid)
            if (rect) {
                return rect
            }
            let closed_bin = this._open_bins.shift()
            this._closed_bins.push(closed_bin)
        }
    }
}

const PackerBFFMixin = {
    /* BFF (Bin First Fit): Pack rectangle in first bin it fits */
    add_Rect(width, height, rid = null) {
        this._open_bind.forEach(bin => {
            let rect = bin.add_rect(width, height, rid)
            if (rect) {
                return rect
            }
        })
        while (true === true) {
            //can we find an unopened bin that will hold this rect?
            let new_bin = this._new_open_bin(width, height, rid)
            if (!new_bin) {
                return null
            }
            let rect = new_bin.add_rect(width, height, rid)
            if (rect) {
                return rect
            }
        }
    }
}

