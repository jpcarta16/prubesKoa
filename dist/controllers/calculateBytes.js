export function calculateBytheRange(rangeHeader, totalBytes) {
    const strRangeArray = rangeHeader.replace(/bytes=/, '').split('-');
    const ranges = [];
    let [start, end] = [parseInt(strRangeArray[0]), parseInt(strRangeArray[1])];
    if (isNaN(start)) {
        start = 0;
    }
    if (isNaN(end)) {
        end = parseInt(totalBytes) - 1;
    }
    if (end <= start) {
        throw new Error('invalid range: start should be less than or equal to end');
    }
    ranges.push([start, end]);
    if (end < parseInt(totalBytes) - 1) {
        ranges.push([end + 1, parseInt(totalBytes) - 1]);
    }
    return {
        start,
        end,
        totalBytes: parseInt(totalBytes),
        calculatedTotalBytes: parseInt(totalBytes)
    };
}
//# sourceMappingURL=calculateBytes.js.map